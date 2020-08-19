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
  selectIsFirstOfTwoThrowsToDoubleIt,
  selectIsRolling,
} from 'redux/game/selectors';

import GameLogic from 'services/GameLogic';
import { Button } from 'components/forms';

const padding = 3;

const Colours = {
  disabled: 'rgb(180, 176, 85)',
  normal: '#ffdc73',
  hover: '#ffbf00',
  active: '#ffbf00',
};

const Container = styled.div`
  flex: 0 1 auto;
  align-self: stretch;

  display: flex;
  justify-content: center;
  align-items: stretch;

  border: none;
  border-top: 5px solid ${Colours.disabled};

  border-radius: 50px;
  padding: ${padding}px;

  @media (min-width: 900px) {
    width: 850px;
    align-self: center;

    border: 5px solid ${Colours.disabled};
    margin-bottom: 10px;
  }
`;

const CustomButton = styled(Button)`
  flex: 1;

  // override any margin or padding
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;

  // single border, rather than double
  border-radius: 0;
  border-width: 5px;
  border-style: solid;

  &:hover {
    border-width: 5px;
    border-style: solid;
  }

  &:active {
    border-width: 5px;
    border-style: solid;
  }

  // middle button margin (N.B. nth-child is 1-indexed)
  &:nth-child(2) {
    margin-left: ${padding}px;
    margin-right: ${padding}px;
  }

  // edges of buttons component are rounded
  &:first-child {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }

  &:last-child {
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
  }
`;

const GameButtons = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);
  const currentRoll = useSelector(selectCurrentRoll);
  const selectedDice = useSelector(selectSelectedDice);
  const isRollingCloud = useSelector(selectIsRolling);

  const currentScoringGroups = useSelector(selectCurrentScoringGroups);

  const currentRollNumber = useSelector(selectCurrentRollNumber);
  const isBlapped = useSelector(selectIsBlapped);
  const isFirstOfTwoThrowsToDoubleIt = useSelector(
    selectIsFirstOfTwoThrowsToDoubleIt,
  );

  const [isHoldingDownRollButton, setIsHoldingDownRollButton] = useState(false);
  const [isGrouping, setIsGrouping] = useState(false);
  const [isSticking, setIsSticking] = useState(false);
  const [
    isFinishingTurnAfterBlapping,
    setIsFinishingTurnAfterBlapping,
  ] = useState(false);

  // do an effect for [isHoldingDownRollButton, isRollingCloud] - sets
  // isRolling from to true when isHoldingDownRollButton !x => x, and to false
  // on the second of either going from x => !x

  const rollDiceMouseDown = async (event) => {
    console.log('mouse down');
    event.stopPropagation();

    if (isHoldingDownRollButton) {
      // already rolling - user probably mouse up'ed off the button, then tried to fix it
      // by clicking on Roll button again
      return;
    }

    setIsHoldingDownRollButton(true);
    console.log(
      'setIsHoldingDownRollButton has just been set to true: ',
      isHoldingDownRollButton,
    );

    if (!isMyTurn) {
      alert("You can't roll - it's not your turn!");
      setIsHoldingDownRollButton(false);
      return;
    }

    try {
      await firebase.functions().httpsCallable('rollDice')({
        gameId,
      });

      // if (!isHoldingDownRollButton) {
      //   // when the cf returned, user had already let go of Roll button
      //   console.log(
      //     'when roll cf returned, user had already let go of roll button - write isRolling: false to DB',
      //     isHoldingDownRollButton,
      //   );
      //   const path = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/isRolling`;
      //   await firebase.database().ref(path).set(false);

      //   // setIsHoldingDownRollButton(false);
      // }
    } catch (error) {
      alert(error.message);
      // write isRolling: false to DB (or catch error in cloud function and do this?)
      // setIsHoldingDownRollButton(false);
    }
  };

  const rollDiceMouseUp = async (event) => {
    console.log('mouse up');
    if (!isHoldingDownRollButton) {
      // user wasn't holding the button down - dont do anything
    }
    event.stopPropagation();

    setIsHoldingDownRollButton(false);

    if (!isRollingCloud) {
      // cloud function hasn't returned yet - dont write to DB
      return;
    }

    // TODO check that roll has been received
    console.log(
      'user let go of roll button, and roll has been received - set isRolling: false',
    );

    const path = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/isRolling`;
    await firebase.database().ref(path).set(false);
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

  const endTurnAfterBlap = async () => {
    setIsFinishingTurnAfterBlapping(true);

    if (!isMyTurn) {
      alert("You can't end the turn - it's not your turn!");
      setIsFinishingTurnAfterBlapping(false);
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

    setIsFinishingTurnAfterBlapping(false);
  };

  const hasRolled = !!currentRoll;

  let canGroup, isRollDisabled, canStick, canEndTurnAfterBlap;
  const isRollLoading = isRollingCloud || isHoldingDownRollButton;

  if (!isMyTurn) {
    canGroup = false;
    isRollDisabled = false;
    canStick = false;
    canEndTurnAfterBlap = false;
  } else if (isBlapped) {
    canGroup = false;
    isRollDisabled = false;
    canStick = false;
    canEndTurnAfterBlap = !isFinishingTurnAfterBlapping;
  } else if (!hasRolled) {
    canGroup = false;
    canStick = false;
    isRollDisabled = !isHoldingDownRollButton;
    canEndTurnAfterBlap = false;
  } else {
    const noScoringGroups =
      !currentScoringGroups || Object.keys(currentScoringGroups).length === 0;

    const noDiceSelected =
      !selectedDice ||
      Object.values(selectedDice).filter((x) => x).length === 0;

    canGroup = !isGrouping && !noDiceSelected;
    isRollDisabled =
      // !isHoldingDownRollButton &&
      !(hasRolled && noScoringGroups && !isFirstOfTwoThrowsToDoubleIt);
    canStick = !isSticking && hasRolled; // N.B. can stick when no scoring groups
    canEndTurnAfterBlap = false;
  }
  return (
    <Container>
      <CustomButton
        onClick={() => createDiceGroup()}
        disabled={!canGroup}
        loading={isGrouping}>
        Bank
      </CustomButton>
      <CustomButton
        onMouseDown={rollDiceMouseDown}
        onMouseUp={rollDiceMouseUp}
        // disabled={!isRollDisabled}
        // loading={isRollLoading}
      >
        {isRollLoading ? 'Rolling' : 'Roll'}
      </CustomButton>
      {isBlapped ? (
        <CustomButton
          onClick={() => endTurnAfterBlap()}
          disabled={!canEndTurnAfterBlap}
          loading={isFinishingTurnAfterBlapping}>
          Next
        </CustomButton>
      ) : (
        <CustomButton
          onClick={() => stick()}
          disabled={!canStick}
          loading={isSticking}>
          Stick
        </CustomButton>
      )}
    </Container>
  );
};

export default GameButtons;
