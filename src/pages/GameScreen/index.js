import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { loggedInAndJoinedGame } from 'redux/auth/slice';
import {
  isItMyTurn,
  selectGameId,
  selectCurrentRoll,
  selectIsBlapped,
  selectCurrentTurn,
  selectCurrentRound,
  selectCurrentRollNumber,
  selectCurrentRollMinusScoringGroups,
  selectPreviousScoringGroupsSinceLastFullRoll,
  selectCurrentScoringGroups,
} from 'redux/game/selectors';
import Die from './Die';
import ScoringGroup from './ScoringGroup';
import Constants from 'services/constants';

const Text = styled.div`
  color: white;
`;

const Button = styled.button`
  margin: 20px;
`;

const DiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px;
`;

const ScoringGroupsContainer = styled.div``;

const areArraysEqual = (a, b) => a.every((value, index) => value === b[index]);

const diceSelectedInitialState = {
  a: false,
  b: false,
  c: false,
  d: false,
  e: false,
  f: false,
};

const GameScreen = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRound = useSelector(selectCurrentRound);
  const currentTurn = useSelector(selectCurrentTurn);
  const currentRoll = useSelector(selectCurrentRoll);
  const currentDiceRollMinusScoringGroups = useSelector(
    selectCurrentRollMinusScoringGroups,
  );
  const currentScoringGroups = useSelector(selectCurrentScoringGroups);
  const previousScoringGroups = useSelector(
    selectPreviousScoringGroupsSinceLastFullRoll,
  );
  const currentRollNumber = useSelector(selectCurrentRollNumber);
  const isBlapped = useSelector(selectIsBlapped);
  const [isRolling, setIsRolling] = useState(false);
  const [isGrouping, setIsGrouping] = useState(false);
  const [isBlappingAndFinishingTurn, setIsBlappingAndFinishingTurn] = useState(
    false,
  );
  const [diceSelectedState, setDiceSelectedState] = useState(
    diceSelectedInitialState,
  );

  useEffect(() => {
    setDiceSelectedState(diceSelectedInitialState);
  }, [currentRoll]);

  const rollDie = async (event) => {
    setIsRolling(true);
    event.preventDefault();

    if (!isMyTurn) {
      alert("You can't role - it's not your turn!");
      setIsRolling(false);
    }

    try {
      await firebase.functions().httpsCallable('rollDice')({
        gameId,
      });
      setIsRolling(false);
    } catch (error) {
      setIsRolling(false);
      console.error(error);
    }
  };

  const createDiceGroup = async () => {
    setIsGrouping(true);

    if (!isMyTurn) {
      alert("You can't create a group - it's not your turn!");
      setIsGrouping(false);
    }

    // check on front end for invalid groups, then write to DB (less secure but quicker for current turn player)
    const selectedDiceIds = Object.keys(diceSelectedState).filter(
      (id) => diceSelectedState[id],
    );
    const diceValues = selectedDiceIds.map((id) => currentRoll[id]);
    const numberOfDice = selectedDiceIds.length;

    let isValidGroup;
    let groupType;
    let score;
    let dice;
    if (numberOfDice === 1) {
      if (diceValues[0] === 1 || diceValues[0] === 5) {
        console.log("That's a valid group: 1 or 5!");

        isValidGroup = true;
        dice = {
          [selectedDiceIds[0]]: diceValues[0],
        };
        groupType = Constants.diceGroupTypes.oneOrFive;
        score = diceValues[0] === 1 ? 100 : 50;
      } else {
        alert("That's not a valid set of dice");

        isValidGroup = false;
      }
    } else if (numberOfDice === 3) {
      // 3 of a kind?
      const allTheSame = diceValues.every((value) => value === diceValues[0]);
      if (allTheSame) {
        console.log("That's a valid group: 3 of a kind!");
        isValidGroup = true;
        dice = {};
        selectedDiceIds.forEach((id) => (dice[id] = currentRoll[id]));
        groupType = Constants.diceGroupTypes.threeOfAKind;
        score = diceValues[0] === 1 ? 1000 : diceValues[0] * 100;
      } else {
        alert("That's not a valid set of dice");
        isValidGroup = false;
      }
    } else if (numberOfDice === 6) {
      const sixOfAKind = diceValues.every((value) => value === diceValues[0]);
      const sorted = diceValues.sort();
      const threePairs =
        sorted[0] === sorted[1] &&
        sorted[2] === sorted[3] &&
        sorted[4] === sorted[5];
      const run = areArraysEqual(sorted, [1, 2, 3, 4, 5, 6]);

      if (sixOfAKind) {
        // N.B. must check this before we check for 3 pairs, as 6 of a kind is a subset of 3 pairs
        // 6 of a kind (= instant win!)
        console.log("That's a valid group: 6 of a kind!");
        isValidGroup = true;
        dice = {};
        selectedDiceIds.forEach((id) => (dice[id] = currentRoll[id]));
        groupType = Constants.diceGroupTypes.sixOfAKind;
        score = 10000; // TODO it's actually an instant win, not just 10,000 score - sort this.
      } else if (threePairs) {
        // 3 pairs (=1000)
        console.log("That's a valid group: 3 pairs!");
        isValidGroup = true;
        dice = {};
        selectedDiceIds.forEach((id) => (dice[id] = currentRoll[id]));
        groupType = Constants.diceGroupTypes.threePairs;
        score = 1000;
      } else if (run) {
        // 1 2 3 4 5 6 (=1500)
        console.log("That's a valid group: a run!");
        isValidGroup = true;
        dice = {};
        selectedDiceIds.forEach((id) => (dice[id] = currentRoll[id]));
        groupType = Constants.diceGroupTypes.run;
        score = 1500;
      } else {
        alert("That's not a valid set of dice");
        isValidGroup = false;
      }
    } else {
      alert("That's not a valid set of dice");
      isValidGroup = false;
    }
    if (isValidGroup) {
      await firebase
        .database()
        .ref(
          `games/${gameId}/rounds/${currentRound}/turns/${currentTurn}/rolls/${currentRollNumber}/scoringGroups`,
        )
        .push({
          dice,
          groupType,
          score,
        });
    }
    setIsGrouping(false);
  };

  const ungroupGroup = async (groupId) => {
    if (!isMyTurn) {
      alert("You can't ungroup - it's not your turn!");
    }

    await firebase
      .database()
      .ref(
        `games/${gameId}/rounds/${currentRound}/turns/${currentTurn}/rolls/${currentRollNumber}/scoringGroups/${groupId}`,
      )
      .remove();
  };

  const endTurnAfterBlap = async (event) => {
    event.preventDefault();
    setIsBlappingAndFinishingTurn(true);

    if (!isMyTurn) {
      alert("You can't end the turn - it's not your turn!");
      setIsBlappingAndFinishingTurn(false);
    }

    const res = await firebase.functions().httpsCallable('endTurnAfterBlap')({
      gameId,
    });

    setIsBlappingAndFinishingTurn(false);
    console.log(res);
  };

  let gameUiJsx;
  const hasRolled = !!currentRoll;
  if (isMyTurn) {
    if (!hasRolled) {
      gameUiJsx = (
        <form onSubmit={(event) => rollDie(event)}>
          <Button disabled={isRolling}>
            {isRolling ? 'Rolling...' : 'Roll'}
          </Button>
        </form>
      );
    } else if (!isBlapped) {
      gameUiJsx = (
        <>
          <Button onClick={() => createDiceGroup()} disabled={isGrouping}>
            {isGrouping ? 'Grouping...' : 'Group dice'}
          </Button>
          <form onSubmit={(event) => rollDie(event)}>
            <Button disabled={isRolling}>
              {isRolling ? 'Rolling...' : 'Roll'}
            </Button>
          </form>
        </>
      );
    } else {
      gameUiJsx = (
        <>
          <form onSubmit={(event) => endTurnAfterBlap(event)}>
            <Button disabled={isBlappingAndFinishingTurn}>
              {isBlappingAndFinishingTurn
                ? 'Ending turn...'
                : 'Blapped - end turn'}
            </Button>
          </form>
          <Text>BLAP!</Text>
        </>
      );
    }
  } else {
    gameUiJsx = (
      <>
        <Text>It's not your turn yet...</Text>
      </>
    );
  }

  return (
    <>
      <DiceContainer>
        {currentDiceRollMinusScoringGroups &&
          Object.keys(currentDiceRollMinusScoringGroups).map((id) => (
            <Die
              id={id}
              key={id}
              value={currentRoll[id]}
              selected={diceSelectedState[id]}
              onClick={() => {
                console.log(`Clicked on dice '${id}'`);
                setDiceSelectedState((x) => ({ ...x, [id]: !x[id] }));
              }}
            />
          ))}
      </DiceContainer>
      <ScoringGroupsContainer>
        <Text>Scoring Groups</Text>
        <div>
          {currentScoringGroups &&
            Object.keys(currentScoringGroups).map((groupId) => {
              const groupObj = currentScoringGroups[groupId];
              const { dice } = groupObj;
              return (
                <ScoringGroup
                  key={groupId}
                  groupId={groupId}
                  dice={dice}
                  isCurrent
                  ungroupGroup={ungroupGroup}
                  isMyTurn={isMyTurn}
                />
              );
            })}
          {previousScoringGroups &&
            previousScoringGroups.map((sg) => {
              const { dice, groupId } = sg;
              return (
                <ScoringGroup
                  key={groupId}
                  groupId={groupId}
                  dice={dice}
                  isCurrent={false}
                  isMyTurn={isMyTurn}
                />
              );
            })}
        </div>
      </ScoringGroupsContainer>
      {gameUiJsx}
    </>
  );
};

export default GameScreen;
