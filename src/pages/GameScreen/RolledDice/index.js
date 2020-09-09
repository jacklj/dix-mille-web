import React, { useState, useEffect, useRef } from 'react';
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
  selectBankedDiceWithValues,
  selectSelectedDice,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectCurrentRollMinusScoringGroups,
  selectIsBlapped,
  selectIsFailedFirstOfTwoThrowsToDoubleIt,
  selectIsRolling,
  selectIsSuccessfulTwoThrowsToDoubleIt,
} from 'redux/game/selectors';
import { selectIsSoundOn } from 'redux/settings/selectors';
import Die from 'components/Dice3d';
import GameLogic from 'services/GameLogic';
import cheer from 'media/sounds/cheer.mp3';
import disappointed from 'media/sounds/disappointed.mp3';
import bankDice from 'media/sounds/bankDice.mp3';

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

const diceCastAnimationLength = 1000;

const RolledDice = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);
  const currentRoll = useSelector(selectCurrentRoll);
  const bankedDice = useSelector(selectBankedDiceWithValues);
  const currentRollNumber = useSelector(selectCurrentRollNumber);
  const selectedDice = useSelector(selectSelectedDice);
  const currentDiceRollMinusScoringGroups = useSelector(
    selectCurrentRollMinusScoringGroups,
  );
  const isBlapped = useSelector(selectIsBlapped);
  const isFailedFirstOfTwoThrowsToDoubleIt = useSelector(
    selectIsFailedFirstOfTwoThrowsToDoubleIt,
  );
  const isSuccessfulTwoThrowsToDoubleIt = useSelector(
    selectIsSuccessfulTwoThrowsToDoubleIt,
  );
  const isRollingCloud = useSelector(selectIsRolling);
  const [isBanking, setIsBanking] = useState(false);

  const isSoundOn = useSelector(selectIsSoundOn);
  const [playBankingDiceSound] = useSound(bankDice, {
    soundEnabled: isSoundOn,
  });

  const bankDie = async (diceId) => {
    // mark the dice as banked, and see if it updates the highest scoring combination of scoring groups from all
    // banked dice.
    setIsBanking(true);
    if (!isMyTurn) {
      console.warn("Can't bank dice when it's not your turn");
      setIsBanking(false);
      return;
    }

    if (bankedDice[diceId]) {
      console.warn(`dice '${diceId}' is already banked - can't bank again.`);
      setIsBanking(false);
      return;
    }

    if (isBanking) {
      console.warn(
        `already banking a dice - can't bank another until it's done.`,
      );
      setIsBanking(false);
      return;
    }

    // calculate any scoring groups
    const existingBankedDicePlusNewOne = {
      ...bankedDice,
      [diceId]: currentRoll[diceId],
    };

    const {
      isValidGroups,
      invalidReason,
      groups,
    } = GameLogic.getValidScoringGroups(existingBankedDicePlusNewOne);

    if (isValidGroups) {
      const updates = {};
      const rollPath = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}`;

      // mark dice as banked
      updates[`bankedDice/${diceId}`] = true;

      // update scoringGroups map (replace it entirely (for now?))
      const scoringGroups = {};
      groups.forEach((scoringGroup) => {
        const newPushKey = firebase
          .database()
          .ref(`${rollPath}/scoringGroups`)
          .push().key;

        scoringGroups[newPushKey] = scoringGroup;
      });
      updates.scoringGroups = scoringGroups; // replace existing scoringGroups map

      // also clear selected dice, as they've all been put in a group
      // updates.selectedDice = null; // https://firebase.google.com/docs/database/web/read-and-write#delete_data

      await firebase.database().ref(rollPath).update(updates);
      playBankingDiceSound();
    } else {
      alert(invalidReason);
    }
    setIsBanking(false);
  };

  const [showBlapped, setShowBlapped] = useState(false);
  const [
    showFirstOfTwoThrowsMessage,
    setShowFirstOfTwoThrowsMessage,
  ] = useState(false);

  useEffect(() => {
    if (isBlapped && !isRollingCloud) {
      setTimeout(() => setShowBlapped(true), diceCastAnimationLength);
    } else {
      setShowBlapped(false);
    }
  }, [isBlapped, isRollingCloud]);

  useEffect(() => {
    if (isFailedFirstOfTwoThrowsToDoubleIt && !isRollingCloud) {
      setTimeout(
        () => setShowFirstOfTwoThrowsMessage(true),
        diceCastAnimationLength,
      );
    } else {
      setShowFirstOfTwoThrowsMessage(false);
    }
  }, [isFailedFirstOfTwoThrowsToDoubleIt, isRollingCloud]);

  const [playCheerSound] = useSound(cheer, {
    soundEnabled: isSoundOn,
  });
  const [playDisappointedSound] = useSound(disappointed, {
    soundEnabled: isSoundOn,
  });

  const previousIsSuccessfulTwoThrowsToDoubleIt = useRef(
    isSuccessfulTwoThrowsToDoubleIt,
  );
  const previousIsFailedFirstOfTwoThrowsToDoubleIt = useRef(
    isFailedFirstOfTwoThrowsToDoubleIt,
  );

  useEffect(() => {
    if (
      !previousIsSuccessfulTwoThrowsToDoubleIt.current &&
      isSuccessfulTwoThrowsToDoubleIt
    ) {
      setTimeout(playCheerSound, diceCastAnimationLength);
    }
    previousIsSuccessfulTwoThrowsToDoubleIt.current = isSuccessfulTwoThrowsToDoubleIt;
  }, [isSuccessfulTwoThrowsToDoubleIt, playCheerSound]);

  useEffect(() => {
    if (
      !previousIsFailedFirstOfTwoThrowsToDoubleIt.current &&
      isFailedFirstOfTwoThrowsToDoubleIt
    ) {
      setTimeout(playDisappointedSound, diceCastAnimationLength);
    }
    previousIsFailedFirstOfTwoThrowsToDoubleIt.current = isFailedFirstOfTwoThrowsToDoubleIt;
  }, [isFailedFirstOfTwoThrowsToDoubleIt, playDisappointedSound]);

  return (
    <>
      <Container>
        {currentRoll &&
          Object.keys(currentRoll).map((id) => (
            <Die
              id={id}
              key={id}
              value={currentRoll[id]}
              selected={selectedDice && selectedDice[id]}
              onClick={() => bankDie(id)}
              rolling={isRollingCloud}
              banked={bankedDice?.[id]}
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
