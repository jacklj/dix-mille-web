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
  selectTwoThrowsToDoubleIt,
} from 'redux/game/selectors';
import Die from './Die';
import ScoringGroup from './ScoringGroup';
import ScoresTable from './ScoresTable';
import PreviousTurnOutcome from './PreviousTurnOutcome';
import Constants from 'services/constants';
import WinnerOverlay from './WinnerOverlay';
import GameLogic from 'services/GameLogic';

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
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ScoringGroupsContainer = styled.div``;

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
      alert(error.message);
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

    // NB all validation logic must be done here, as we are writing directly to the DB from the
    // frontend - there's no cloud function involved.
    const selectedDice = {};
    Object.keys(diceSelectedState)
      .filter((id) => diceSelectedState[id])
      .forEach((id) => {
        const value = currentRoll[id];
        selectedDice[id] = value;
      });

    if (Object.keys(selectedDice).length === 0) {
      alert('No dice selected');
      setIsGrouping(false);
      return;
    }

    const {
      isValidGroup,
      groupType,
      score,
      scoringGroupDice,
    } = GameLogic.getValidScoringGroups(selectedDice);

    if (isValidGroup) {
      await firebase
        .database()
        .ref(
          `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}/scoringGroups`,
        )
        .push({
          groupType,
          score,
          dice: scoringGroupDice,
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
    setIsSticking(true);

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

      const cantGroup = isGrouping || noDiceSelected;
      const cantRoll =
        isRolling || (hasRolled && noScoringGroups && !twoThrowsToDoubleIt);
      const cantStick = isSticking || !hasRolled; // can stick when no scoring groups

      gameUiJsx = (
        <ButtonsContainer>
          <Button onClick={() => createDiceGroup()} disabled={cantGroup}>
            {isGrouping ? 'Banking...' : 'Bank dice'}
          </Button>
          <form onSubmit={(event) => rollDie(event)}>
            <Button disabled={cantRoll}>
              {isRolling ? 'Rolling...' : 'Roll'}
            </Button>
          </form>
          <Button onClick={() => stick()} disabled={cantStick}>
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
        {isBlapped ? <Text>BLAP!</Text> : null}
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
                if (isMyTurn) {
                  setDiceSelectedState((x) => ({ ...x, [id]: !x[id] }));
                }
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
      <WinnerOverlay />
    </>
  );
};

export default GameScreen;
