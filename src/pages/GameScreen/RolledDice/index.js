import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';

import BlappedMessage from './BlappedMessage';
import {
  isItMyTurn,
  selectGameId,
  selectCurrentRoll,
  selectSelectedDice,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectCurrentRollMinusScoringGroups,
  selectIsBlapped,
  selectIsFailedFirstOfTwoThrowsToDoubleIt,
  selectIsRolling,
} from 'redux/game/selectors';
import Die from 'components/Dice3d';

const Container = styled.div`
  flex-shrink: 0;
  min-height: 50px; // so when you've banked all dice, the banked dice don't go all the way
  // to the top of the page - there's still the suggestion of a dice rolling area.

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px;
  max-width: 700px;
`;

const InfoText = styled.div`
  flex: none;

  font-family: Limelight;
  font-size: 1.3em;
  color: #fff;
  margin-bottom: 10px;
`;

const RolledDice = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);
  const currentRoll = useSelector(selectCurrentRoll);
  const currentRollNumber = useSelector(selectCurrentRollNumber);
  const selectedDice = useSelector(selectSelectedDice);
  const currentDiceRollMinusScoringGroups = useSelector(
    selectCurrentRollMinusScoringGroups,
  );
  const isBlapped = useSelector(selectIsBlapped);
  const isFailedFirstOfTwoThrowsToDoubleIt = useSelector(
    selectIsFailedFirstOfTwoThrowsToDoubleIt,
  );
  const isRollingCloud = useSelector(selectIsRolling);

  const selectOrUnselectDie = async (diceId) => {
    console.log(`Clicked on dice '${diceId}'`);
    if (!isMyTurn) {
      console.warn("Can't select dice when it's not your turn");
      return;
    }

    // toggle die selected state
    const path = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}/selectedDice`;
    await firebase
      .database()
      .ref(path)
      .update({
        [diceId]: !selectedDice?.[diceId],
      });
  };

  const [showBlapped, setShowBlapped] = useState(false);
  const [
    showFirstOfTwoThrowsMessage,
    setShowFirstOfTwoThrowsMessage,
  ] = useState(false);

  useEffect(() => {
    if (isBlapped && !isRollingCloud) {
      setTimeout(() => setShowBlapped(true), 1500);
    } else {
      setShowBlapped(false);
    }
  }, [isBlapped, isRollingCloud]);

  useEffect(() => {
    if (isFailedFirstOfTwoThrowsToDoubleIt && !isRollingCloud) {
      setTimeout(() => setShowFirstOfTwoThrowsMessage(true), 1500);
    } else {
      setShowFirstOfTwoThrowsMessage(false);
    }
  }, [isFailedFirstOfTwoThrowsToDoubleIt, isRollingCloud]);

  return (
    <>
      <Container>
        {currentDiceRollMinusScoringGroups &&
          Object.keys(currentDiceRollMinusScoringGroups).map((id) => (
            <Die
              id={id}
              key={id}
              value={currentRoll[id]}
              selected={selectedDice && selectedDice[id]}
              onClick={() => selectOrUnselectDie(id)}
              rolling={isRollingCloud}
            />
          ))}
      </Container>
      {showFirstOfTwoThrowsMessage ? (
        <InfoText>You have to roll again!</InfoText>
      ) : null}
      {showBlapped ? <BlappedMessage /> : null}
    </>
  );
};

export default RolledDice;
