import React, { useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';

import {
  isItMyTurn,
  selectGameId,
  selectCurrentRoll,
  selectSelectedDice,
  selectIsBlapped,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectCurrentScoringGroups,
  selectTwoThrowsToDoubleIt,
} from 'redux/game/selectors';

import GameLogic from 'services/GameLogic';
import { Button } from 'components/forms';

const CustomButton = styled(Button)`
  margin: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const GameButtons = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);
  const currentRoll = useSelector(selectCurrentRoll);
  const selectedDice = useSelector(selectSelectedDice);

  const currentScoringGroups = useSelector(selectCurrentScoringGroups);

  const currentRollNumber = useSelector(selectCurrentRollNumber);
  const isBlapped = useSelector(selectIsBlapped);
  const twoThrowsToDoubleIt = useSelector(selectTwoThrowsToDoubleIt);

  const [isRolling, setIsRolling] = useState(false);
  const [isGrouping, setIsGrouping] = useState(false);
  const [isSticking, setIsSticking] = useState(false);

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

    // N.B. all validation logic must be done here, as we are writing directly to the DB from the
    // frontend - there's no cloud function involved.
    if (
      !selectedDice ||
      Object.values(selectedDice).filter((x) => x).length === 0
    ) {
      alert('No dice selected');
      setIsGrouping(false);
      return;
    }

    const selectedDiceWithValues = {}; // [diceId]: diceValue
    Object.keys(selectedDice)
      .filter((diceId) => selectedDice[diceId])
      .forEach((diceId) => {
        const value = currentRoll[diceId];
        selectedDiceWithValues[diceId] = value;
      });

    const {
      isValidGroups,
      invalidReason,
      groups,
    } = GameLogic.getValidScoringGroups(selectedDiceWithValues);

    if (isValidGroups) {
      const updates = {};
      const rollPath = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}`;
      groups.forEach((scoringGroup) => {
        const newPushKey = firebase
          .database()
          .ref(`${rollPath}/scoringGroups`)
          .push().key;
        updates[`scoringGroups/${newPushKey}`] = scoringGroup;
      });

      // also clear selected dice, as they've all been put in a group
      updates.selectedDice = null; // https://firebase.google.com/docs/database/web/read-and-write#delete_data

      await firebase.database().ref(rollPath).update(updates);
    } else {
      alert(invalidReason);
    }
    setIsGrouping(false);
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

  const hasRolled = !!currentRoll;

  let canGroup, canRoll, canStick;

  if (!isMyTurn) {
    canGroup = false;
    canRoll = false;
    canStick = false;
  } else if (isBlapped) {
    canGroup = false;
    canRoll = false;
    canStick = false;
  } else if (!hasRolled) {
    canGroup = false;
    canStick = false;
    canRoll = !isRolling;
  } else {
    const noScoringGroups =
      !currentScoringGroups || Object.keys(currentScoringGroups).length === 0;

    const noDiceSelected =
      !selectedDice ||
      Object.values(selectedDice).filter((x) => x).length === 0;

    canGroup = !isGrouping && !noDiceSelected;
    canRoll =
      !isRolling && !(hasRolled && noScoringGroups && !twoThrowsToDoubleIt);
    canStick = !isSticking && hasRolled; // N.B. can stick when no scoring groups
  }

  return (
    <ButtonsContainer>
      <CustomButton onClick={() => createDiceGroup()} disabled={!canGroup}>
        {isGrouping ? 'Banking...' : 'Bank dice'}
      </CustomButton>
      <form onSubmit={(event) => rollDie(event)}>
        <CustomButton disabled={!canRoll}>
          {isRolling ? 'Rolling...' : 'Roll'}
        </CustomButton>
      </form>
      <CustomButton onClick={() => stick()} disabled={!canStick}>
        {isSticking ? 'Sticking...' : 'Stick'}
      </CustomButton>
    </ButtonsContainer>
  );
};

export default GameButtons;
