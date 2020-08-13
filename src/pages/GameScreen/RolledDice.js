import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';

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
} from 'redux/game/selectors';
import Die from 'components/Die';
import blapSprites from './blapSprites.mp3';

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

const spriteMap = {
  annaBlap: [73, 1226],
  edBlaaaaap: [1318, 1116],
  edHighBlap: [2498, 918],
  emmaBlap: [3449, 914],
  lewisBlap: [4385, 1332],
  madsBlap1: [5786, 1267],
  madsBlap2: [7164, 1428],
  madsCanYouMakeANoiseLikeThisHoho: [8725, 3770],
  williamCrazyBlap1: [12514, 2925],
  williamCrazyBlap2: [15485, 955],
};

const useSoundOptions = {
  sprite: spriteMap,
};

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

  const [playBlapSound] = useSound(blapSprites, {
    sprite: {
      annaBlap: [73, 1226],
      edBlaaaaap: [1318, 1116],
      edHighBlap: [2498, 918],
      emmaBlap: [3449, 914],
      lewisBlap: [4385, 1332],
      madsBlap1: [5786, 1267],
      madsBlap2: [7164, 1428],
      madsCanYouMakeANoiseLikeThisHoho: [8725, 3770],
      williamCrazyBlap1: [12514, 2925],
      williamCrazyBlap2: [15485, 955],
    },
  });

  useEffect(() => {
    if (isBlapped) {
      const blapNames = Object.keys(spriteMap);
      const randomIndex = Math.floor(Math.random() * blapNames.length);
      const randomSpriteName = blapNames[randomIndex];

      console.log(`play ${randomSpriteName}!`);

      playBlapSound('williamCrazyBlap1'); // randomSpriteName);
    }
  }, [isBlapped, playBlapSound]);

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
            />
          ))}
      </Container>
      {isFailedFirstOfTwoThrowsToDoubleIt ? (
        <InfoText>You have to roll again!</InfoText>
      ) : null}
      {isBlapped ? <BlappedMessage /> : null}
    </>
  );
};

export default RolledDice;
