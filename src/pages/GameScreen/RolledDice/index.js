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
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectIsBlapped,
  selectIsFailedFirstOfTwoThrowsToDoubleIt,
  selectIsRolling,
  selectIsSuccessfulTwoThrowsToDoubleIt,
  selectAllCurrentDiceWithDetails,
} from 'redux/game/selectors';
import { selectIsSoundOn } from 'redux/settings/selectors';
import Die from 'components/Dice3d';
import GameLogic from 'services/GameLogic';
import cheer from 'media/sounds/cheer.mp3';
import disappointed from 'media/sounds/disappointed.mp3';
import bankDice from 'media/sounds/bankDice.mp3';
import Helpers from 'services/Helpers';

const Container = styled.div`
  flex: 1;
  min-height: 50px; // so when you've banked all dice, the banked dice don't go all the way
  // to the top of the page - there's still the suggestion of a dice rolling area.

  @media (orientation: landscape) {
    align-self: stretch;
  }

  @media (orientation: portrait) {
    width: 100%;
  }

`;

const InfoText = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;

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
  const dice = useSelector(selectAllCurrentDiceWithDetails);
  const currentRollNumber = useSelector(selectCurrentRollNumber);
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
    if (isBanking) {
      console.warn(
        `already banking a dice - can't bank another until it's done.`,
      );
      setIsBanking(false);
      return;
    }

    setIsBanking(true);

    if (!isMyTurn) {
      console.warn("Can't bank dice when it's not your turn");
      setIsBanking(false);
      return;
    }

    if (dice[diceId]?.isBanked) {
      console.warn(`dice '${diceId}' is already banked - can't bank again.`);
      setIsBanking(false);
      return;
    }

    // calculate any scoring groups
    const bankedDice = Helpers.filterBankedDice(dice);
    const bankedDiceValuesMap = Helpers.transformDiceDetailsIntoValueMap(
      bankedDice,
    );
    const existingBankedDicePlusNewOne = {
      ...bankedDiceValuesMap,
      [diceId]: dice[diceId].value,
    };

    const { groups, remainingDice } = GameLogic.getHighestScoringGrouping(
      existingBankedDicePlusNewOne,
    );

    const updates = {};

    // mark dice as banked
    updates[`bankedDice/${diceId}`] = true;

    // update scoringGroups map (replace it entirely (for now?))
    // N.B. also update the denormalised `diceToScoringGroups` map
    const rollPath = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}`;
    const scoringGroups = {};
    const diceToScoringGroups = {};
    groups.forEach((scoringGroup) => {
      const newScoringGroupKey = firebase
        .database()
        .ref(`${rollPath}/scoringGroups`)
        .push().key;

      scoringGroups[newScoringGroupKey] = scoringGroup;
      Object.keys(scoringGroup.dice).forEach((diceId) => {
        diceToScoringGroups[diceId] = newScoringGroupKey;
      });
    });
    updates.scoringGroups = scoringGroups; // replace existing scoringGroups map
    updates.diceToScoringGroups = diceToScoringGroups;

    await firebase.database().ref(rollPath).update(updates);
    playBankingDiceSound();
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
    <Container>
      {dice &&
        Object.entries(dice).map(([diceId, { value, isBanked, position }]) => (
          <Die
            id={diceId}
            key={diceId}
            value={value}
            onClick={() => bankDie(diceId)}
            rolling={isRollingCloud}
            banked={isBanked}
            rotation={position?.rotation}
            positionX={position?.x}
            positionY={position?.y}
          />
        ))}
      {showFirstOfTwoThrowsMessage ? (
        <InfoText>You have to roll again!</InfoText>
      ) : null}
      {showBlapped ? <BlappedMessage /> : null}
    </Container>
  );
};

export default RolledDice;
