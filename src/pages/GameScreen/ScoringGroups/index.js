import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';
import Helpers from 'services/Helpers';

import {
  isItMyTurn,
  selectGameId,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectPreviousScoringGroups,
  selectTurnScoreSoFar,
  selectIsRolling,
  selectBankedDice,
  selectBankedDiceOrder,
} from 'redux/game/selectors';
import { selectIsSoundOn } from 'redux/settings/selectors';
import Die from 'components/BankedDie';
import GameLogic from 'services/GameLogic';
import bankDice from 'media/sounds/bankDice.mp3';
import GameButtons from './GameButtons';

const Container = styled.div`
  flex: none;

  align-self: stretch;

  @media (orientation: portrait) {
    height: calc(
      10vw * 6 + 3em
    ); // TODO make this dynamic, based on dice size (has a max, also depends on both screen height and width)
  }

  @media (orientation: landscape) {
    width: calc(
      10vw * 6 + 3em
    ); // TODO make this dynamic, based on dice size (has a max, also depends on both screen height and width)
  }

  display: flex;
  flex-direction: column;
`;

const AllButButtonsContainer = styled.div`
  flex: 1;
  // so content doesn't go under the notch on notched phones
  margin-left: max(
    env(safe-area-inset-left),
    26px
  ); // min value of 32px, so dice dont scroll into button border radius curve and look weird
  margin-right: max(env(safe-area-inset-right), 26px);
  // N.B. the max() function doesnt work on Firefox for Android.
`;

const TurnScoreText = styled.div`
  flex-shrink: 0;
  text-align: left;

  color: white;
  margin-bottom: 10px;

  height: 1.4em; // so when the turn score is hidden, it doesn't shift the page
`;

const ScoringGroupsContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

const DiceContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const diceCastAnimationLength = 1000;

const ScoringGroups = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);

  const bankedDice = useSelector(selectBankedDice);
  const bankedDiceOrder = useSelector(selectBankedDiceOrder);
  const previousScoringGroups = useSelector(selectPreviousScoringGroups);
  const turnScoreSoFar = useSelector(selectTurnScoreSoFar);

  const currentRollNumber = useSelector(selectCurrentRollNumber);
  const isRollingCloud = useSelector(selectIsRolling);

  const [showTurnScore, setShowTurnScore] = useState(false);

  const isSoundOn = useSelector(selectIsSoundOn);
  const [playBankingDiceSound] = useSound(bankDice, {
    soundEnabled: isSoundOn,
  });

  const previousIsRollingCloud = useRef(isRollingCloud);

  useEffect(() => {
    if (isRollingCloud) {
      setShowTurnScore(false);
    } else if (previousIsRollingCloud.current && !isRollingCloud) {
      setTimeout(() => setShowTurnScore(true), diceCastAnimationLength);
    } else {
      setShowTurnScore(true);
    }

    previousIsRollingCloud.current = isRollingCloud;
  }, [isRollingCloud]);

  const [isUnbanking, setIsUnbanking] = useState(false);

  const unbankDie = async (diceId) => {
    // mark the dice as banked, and see if it updates the highest scoring combination of scoring groups from all
    // banked dice.
    setIsUnbanking(true);
    if (!isMyTurn) {
      console.warn("Can't unbank dice when it's not your turn");
      setIsUnbanking(false);
      return;
    }

    if (bankedDice && !bankedDice[diceId]) {
      console.warn(
        `dice '${diceId}' is already unbanked - can't unbank again.`,
      );
      setIsUnbanking(false);
      return;
    }

    if (isUnbanking) {
      console.warn(
        `already unbanking a dice - can't unbank another until it's done.`,
      );
      setIsUnbanking(false);
      return;
    }

    // recalculate scoring groups
    const newBankedDice = { ...bankedDice };
    delete newBankedDice[diceId];
    console.log('old banked dice: ', bankedDice);
    console.log('new banked dice: ', newBankedDice);

    const bankedDiceValuesMap = Helpers.transformDiceDetailsIntoValueMap(
      newBankedDice,
    );

    const { groups } = GameLogic.getHighestScoringGrouping(bankedDiceValuesMap);

    const updates = {};

    // mark dice as unbanked
    updates[`bankedDice/${diceId}`] = null; // https://firebase.google.com/docs/database/web/read-and-write#delete_data

    // update scoringGroups map (replace it entirely (for now?))
    // N.B. also update the denormalised `diceToScoringGroups` map
    // N.B. need to replace whole scoringGroups map and diceToScoringGroups map, because the scoring groups may
    // have completely changed.
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

    setIsUnbanking(false);
  };

  // const noBankedDice = !bankedDice || Object.keys(bankedDice).length === 0;
  // const noPreviousScoringGroups =
  //   !previousScoringGroups || previousScoringGroups.length === 0;
  // if (noBankedDice && noPreviousScoringGroups) {
  //   return null;
  // }

  return (
    <Container>
      <AllButButtonsContainer>
        <TurnScoreText>
          {typeof turnScoreSoFar === 'number' && showTurnScore
            ? `Turn score: ${turnScoreSoFar}`
            : null}
        </TurnScoreText>
        {bankedDiceOrder && (
          <DiceContainer>
            {bankedDiceOrder.map((diceId) => {
              const { value, scoringGroupId } = bankedDice[diceId];
              const isInScoringGroup = !!scoringGroupId;
              return (
                <Die
                  id={diceId}
                  key={diceId}
                  value={value}
                  isInGroup={isInScoringGroup}
                  onClick={() => unbankDie(diceId)}
                />
              );
            })}
          </DiceContainer>
        )}
        <ScoringGroupsContainer>
          {previousScoringGroups &&
            previousScoringGroups.map(({ rollIndex, dice, order }) => {
              return (
                <DiceContainer>
                  {order.map((diceId) => {
                    const value = dice[diceId];
                    return (
                      <Die id={diceId} key={diceId} value={value} isInGroup />
                    );
                  })}
                </DiceContainer>
              );
            })}
        </ScoringGroupsContainer>
      </AllButButtonsContainer>
      <GameButtons />
    </Container>
  );
};

export default ScoringGroups;
