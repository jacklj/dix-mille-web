import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';

import BlappedMessage from './BlappedMessage';
import YouHaveToRollAgainMessage from './YouHaveToRollAgainMessage';
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
// import {
//   selectWindowInnerHeight,
//   selectWindowInnerWidth,
// } from 'redux/ui/selectors';

const Container = styled.div`
  flex: 1;

  @media (orientation: landscape) {
    align-self: stretch;
  }

  @media (orientation: portrait) {
    width: 100%;
  }
`;

const diceCastAnimationLength = 1000;

const RolledDice = () => {
  // const innerHeight = useSelector(selectWindowInnerHeight);
  // const innerWidth = useSelector(selectWindowInnerWidth);

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
  const isRolling = useSelector(selectIsRolling);
  const [isBanking, setIsBanking] = useState(false);

  const isSoundOn = useSelector(selectIsSoundOn);
  const [playBankingDiceSound] = useSound(bankDice, {
    soundEnabled: isSoundOn,
  });

  const bankDie = async (diceId) => {
    // mark the dice as banked, and see if it updates the highest scoring combination of scoring groups from all
    // banked dice.

    if (isRolling) {
      console.warn(
        "Can't bank dice while rolling - the user may have accidentally clicked on a dice while it's inside the dice cup.",
      );
      return;
    }

    if (isBlapped) {
      console.warn("can't bank dice when blapped.");
      return;
    }

    if (isBanking) {
      console.warn(
        `already banking a dice - can't bank another until it's done.`,
      );
      return;
    }

    setIsBanking(true);

    if (!isMyTurn) {
      console.warn("Can't bank dice when it's not your turn");
      setIsBanking(false);
      return;
    }

    if (dice[diceId]?.isBanked) {
      // console.warn(`dice '${diceId}' is already banked - can't bank again.`);
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

    const { groups } = GameLogic.getHighestScoringGrouping(
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

    try {
      await firebase.database().ref(rollPath).update(updates);
      playBankingDiceSound();
      setIsBanking(false);
    } catch (error) {
      setIsBanking(false);
      throw error;
    }
  };

  const [showBlapped, setShowBlapped] = useState(false);
  const [
    showFirstOfTwoThrowsMessage,
    setShowFirstOfTwoThrowsMessage,
  ] = useState(false);

  useEffect(() => {
    if (isBlapped && !isRolling) {
      setTimeout(() => setShowBlapped(true), diceCastAnimationLength);
    } else {
      setShowBlapped(false);
    }
  }, [isBlapped, isRolling]);

  useEffect(() => {
    if (isFailedFirstOfTwoThrowsToDoubleIt && !isRolling) {
      setTimeout(
        () => setShowFirstOfTwoThrowsMessage(true),
        diceCastAnimationLength,
      );
    } else {
      setShowFirstOfTwoThrowsMessage(false);
    }
  }, [isFailedFirstOfTwoThrowsToDoubleIt, isRolling]);

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

  // N.B. need to keep the empty <Container> component, to keep the page layout!
  return (
    <>
      <Container>
        {/* <Text>width: {innerWidth}</Text>
        <Text>height: {innerHeight}</Text> */}
      </Container>
      {dice &&
        Object.entries(dice).map(([diceId, { value, isBanked, position }]) => (
          <Die
            id={diceId}
            key={diceId}
            value={value}
            onClick={() => bankDie(diceId)}
            rolling={isRolling}
            banked={isBanked}
            rotation={position?.rotation}
            positionX={position?.x}
            positionY={position?.y}
          />
        ))}
      {showBlapped ? <BlappedMessage /> : null}
      {showFirstOfTwoThrowsMessage ? <YouHaveToRollAgainMessage /> : null}
    </>
  );
};

export default RolledDice;
