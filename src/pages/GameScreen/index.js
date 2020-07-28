import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';

import {
  isItMyTurn,
  selectGameId,
  selectCurrentRoll,
  selectIsBlapped,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectCurrentRollMinusScoringGroups,
  selectPreviousScoringGroupsSinceLastFullRoll,
  selectCurrentScoringGroups,
  selectTurnScoreSoFar,
  selectHasSomeoneWon,
  selectTwoThrowsToDoubleIt,
} from 'redux/game/selectors';
import Die from './Die';
import ScoringGroup from './ScoringGroup';
import ScoresTable from './ScoresTable';
import PreviousTurnOutcome from './PreviousTurnOutcome';
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

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ScoringGroupsContainer = styled.div``;

const WinnerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(10, 10, 10, 0.5);
`;

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
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);
  const currentRoll = useSelector(selectCurrentRoll);
  const currentDiceRollMinusScoringGroups = useSelector(
    selectCurrentRollMinusScoringGroups,
  );
  const currentScoringGroups = useSelector(selectCurrentScoringGroups);
  const previousScoringGroups = useSelector(
    selectPreviousScoringGroupsSinceLastFullRoll,
  );
  const turnScoreSoFar = useSelector(selectTurnScoreSoFar);

  const currentRollNumber = useSelector(selectCurrentRollNumber);
  const isBlapped = useSelector(selectIsBlapped);
  const hasSomeoneWon = useSelector(selectHasSomeoneWon);
  const twoThrowsToDoubleIt = useSelector(selectTwoThrowsToDoubleIt);

  const [isRolling, setIsRolling] = useState(false);
  const [isGrouping, setIsGrouping] = useState(false);
  const [isSticking, setIsSticking] = useState(false);
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
    event.preventDefault();
    setIsRolling(true);

    if (!isMyTurn) {
      alert("You can't roll - it's not your turn!");
      setIsRolling(false);
      return;
    }

    try {
      await firebase.functions().httpsCallable('rollDice')({
        gameId,
      });
    } catch (error) {
      console.error(error);
    }
    setIsRolling(false);
  };

  const createDiceGroup = async () => {
    setIsGrouping(true);

    if (!isMyTurn) {
      alert("You can't create a group - it's not your turn!");
      setIsGrouping(false);
      return;
    }

    // check on front end for invalid groups, then write to DB (less secure but quicker for current turn player)
    const selectedDiceIds = Object.keys(diceSelectedState).filter(
      (id) => diceSelectedState[id],
    );

    if (selectedDiceIds.length === 0) {
      alert('No dice selected');
      setIsGrouping(false);
      return;
    }

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
          `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}/scoringGroups`,
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
      return;
    }

    await firebase
      .database()
      .ref(
        `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}/scoringGroups/${groupId}`,
      )
      .remove();
  };

  const stick = async () => {
    if (!isMyTurn) {
      alert("You can't stick - it's not your turn!");
      setIsSticking(false);
      return;
    }

    // if haven't rolled, can't stick.
    // once you've rolled for the first time, you can stick at any time:
    //   - immediately, with a score of 0 (could be useful in the case when you are very near to 10,000 so you
    //     need a very specific score)
    //   - after banking some scoring groups
    //   - also immediately after any reroll (numberOfDice < 6 or numberOfDice === 6) if you don't want any possible
    //     scoring groups
    // Basically you can stick as soon as you've exposed yourself to the risk of blapping
    const hasRolled = !!currentRoll;
    if (!hasRolled) {
      alert("You can't stick - you haven't done your first roll yet !");
      setIsSticking(false);
      return;
    }

    try {
      const res = await firebase.functions().httpsCallable('stick')({
        gameId,
      });
      console.log('Done stick: ', res);
    } catch (error) {
      alert(error.message);
    }

    setIsSticking(false);
  };

  const endTurnAfterBlap = async (event) => {
    event.preventDefault();
    setIsBlappingAndFinishingTurn(true);

    if (!isMyTurn) {
      alert("You can't end the turn - it's not your turn!");
      setIsBlappingAndFinishingTurn(false);
      return;
    }

    try {
      const res = await firebase.functions().httpsCallable('endTurnAfterBlap')({
        gameId,
      });
      console.log(res);
    } catch (error) {
      alert(error.message);
    }

    setIsBlappingAndFinishingTurn(false);
  };

  let gameUiJsx;
  const hasRolled = !!currentRoll;

  if (isMyTurn) {
    if (!hasRolled) {
      gameUiJsx = (
        <>
          <PreviousTurnOutcome />
          <form onSubmit={(event) => rollDie(event)}>
            <Button disabled={isRolling}>
              {isRolling ? 'Rolling...' : 'Roll'}
            </Button>
          </form>
        </>
      );
    } else if (!isBlapped) {
      const noScoringGroups =
        !currentScoringGroups || Object.keys(currentScoringGroups).length === 0;
      const noDiceSelected =
        Object.keys(diceSelectedState).filter((id) => diceSelectedState[id])
          .length === 0;

      gameUiJsx = (
        <ButtonsContainer>
          <Button
            onClick={() => createDiceGroup()}
            disabled={isGrouping || noDiceSelected}>
            {isGrouping ? 'Grouping...' : 'Group dice'}
          </Button>
          <form onSubmit={(event) => rollDie(event)}>
            <Button
              disabled={
                isRolling ||
                (hasRolled && noScoringGroups && !twoThrowsToDoubleIt)
              }>
              {isRolling ? 'Rolling...' : 'Roll'}
            </Button>
          </form>
          <Button onClick={() => stick()} disabled={!hasRolled}>
            {isSticking ? 'Sticking...' : 'Stick'}
          </Button>
        </ButtonsContainer>
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
        {!hasRolled && <PreviousTurnOutcome />}
        <Text>It's not your turn...</Text>
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
      {gameUiJsx}
      <ScoringGroupsContainer>
        <Text>Scoring Groups</Text>
        {typeof turnScoreSoFar === 'number' ? (
          <Text>Turn score: {turnScoreSoFar}</Text>
        ) : null}
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
      <ScoresTable />
      {hasSomeoneWon && (
        <WinnerOverlay>
          <Text>{`${
            hasSomeoneWon.didIWin ? 'You' : hasSomeoneWon.winnersName
          } won!`}</Text>
        </WinnerOverlay>
      )}
    </>
  );
};

export default GameScreen;
