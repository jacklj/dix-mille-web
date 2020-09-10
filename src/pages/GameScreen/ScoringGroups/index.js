import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';

import {
  isItMyTurn,
  selectGameId,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectPreviousScoringGroups,
  selectTurnScoreSoFar,
  selectIsRolling,
  selectBankedDiceWithValues,
  selectOrderedBankedDiceWithValuesAndGroupStatuses,
} from 'redux/game/selectors';
import { selectIsSoundOn } from 'redux/settings/selectors';
import ScoringGroup from './ScoringGroup';
import Die from 'components/BankedDie';
import GameLogic from 'services/GameLogic';
import bankDice from 'media/sounds/bankDice.mp3';

const Container = styled.div`
  flex: 1;
  flex-shrink: 0;

  align-self: stretch;

  // so content doesn't go under the notch on notched phones
  padding-left: max(
    env(safe-area-inset-left),
    32px
  ); // min value of 32px, so dice dont scroll into button border radius curve and look weird
  // padding-right: max(env(safe-area-inset-right), 32px); // no right padding, so the put back button can expand
  // all the way to the edge of the screen
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
  flex-direction: column-reverse;
`;

const DiceContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    max-width: 170px; // magic value because flexwrap: wrap adds extra container width to the
    // right when children wrap
  }
`;

const diceCastAnimationLength = 1000;

const ScoringGroups = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);

  const bankedDice = useSelector(selectBankedDiceWithValues);
  const orderedBankedDiceWithDetails = useSelector(
    selectOrderedBankedDiceWithValuesAndGroupStatuses,
  );
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

    const { groups, remainingDice } = GameLogic.getHighestScoringGrouping(
      newBankedDice,
    );

    const updates = {};
    const rollPath = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}`;

    // mark dice as banked
    updates[`bankedDice/${diceId}`] = null; // https://firebase.google.com/docs/database/web/read-and-write#delete_data

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

    await firebase.database().ref(rollPath).update(updates);
    playBankingDiceSound();

    setIsUnbanking(false);
  };

  const noBankedDice = !bankedDice || Object.keys(bankedDice).length === 0;
  const noPreviousScoringGroups =
    !previousScoringGroups || Object.keys(previousScoringGroups).length === 0;
  if (noBankedDice && noPreviousScoringGroups) {
    return null;
  }

  return (
    <Container>
      <TurnScoreText>
        {typeof turnScoreSoFar === 'number' && showTurnScore
          ? `Turn score: ${turnScoreSoFar}`
          : null}
      </TurnScoreText>
      {orderedBankedDiceWithDetails && (
        <DiceContainer>
          {orderedBankedDiceWithDetails.map(
            ({ id, value, scoringGroupId, score }) => (
              <Die
                id={id}
                key={id}
                value={value}
                isInGroup={!!scoringGroupId}
                score={score}
                onClick={() => unbankDie(id)}
              />
            ),
          )}
        </DiceContainer>
      )}
      <ScoringGroupsContainer>
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
      </ScoringGroupsContainer>
    </Container>
  );
};

export default ScoringGroups;
