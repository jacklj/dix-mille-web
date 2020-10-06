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
  selectCurrentRoll,
  selectPreviousScoringGroups,
  selectTurnScoreSoFar,
  selectIsRolling,
  selectBankedDice,
  selectBankedDiceOrder,
  selectAreAnyBankedDiceInvalid,
  selectIsBlapped,
} from 'redux/game/selectors';
import { selectIsSoundOn } from 'redux/settings/selectors';
import Die from 'components/BankedDie';
import GameLogic from 'services/GameLogic';
import bankDice from 'media/sounds/bankDice.mp3';
import { Button } from 'components/forms';
import stickCashRegister from 'media/sounds/stickCashRegister.mp3';

const Container = styled.div`
  flex: none;

  align-self: stretch;

  // so content doesn't go under the notch on notched phones
  // N.B. the max() function doesnt work on Firefox for Android.
  margin-left: max(env(safe-area-inset-left), 15px);

  @media (orientation: portrait) {
    height: var(--scoring-groups-area-height);

    margin-right: max(env(safe-area-inset-right), 15px);
  }

  @media (orientation: landscape) {
    width: var(--scoring-groups-area-width);

    margin-right: 0; // in the landscape layout, the right side of ScoringGroups is in the middle of the page, so
    // no "safe margin" necessary
  }

  margin-bottom: 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TurnScoreAndStickButtonContainer = styled.div`
  flex-shrink: 0;
  text-align: left;

  margin-top: 10px;
  margin-bottom: 10px;
  height: 2em; // so when the turn score is hidden, it doesn't shift the page

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TurnScore = styled.div`
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-right: 15px;
`;

const TurnScoreHeader = styled.div`
  text-transform: uppercase;

  font-size: 0.6em;
  letter-spacing: 1px;
`;

const TurnScoreValue = styled.div`
  font-size: 1em;
  line-height: 0.8em;
`;

const CustomButton = styled(Button)`
  // make button smaller
  height: 1.9em;
  font-size: 1.3em;

  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 0;
  padding-bottom: 0;
`;

const ScoringGroupsContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
  const isRolling = useSelector(selectIsRolling);

  const [showTurnScore, setShowTurnScore] = useState(false);

  const isSoundOn = useSelector(selectIsSoundOn);
  const [playBankingDiceSound] = useSound(bankDice, {
    soundEnabled: isSoundOn,
  });

  const previousIsRolling = useRef(isRolling);

  useEffect(() => {
    if (isRolling) {
      setShowTurnScore(false);
    } else if (previousIsRolling.current && !isRolling) {
      setTimeout(() => setShowTurnScore(true), diceCastAnimationLength);
    } else {
      setShowTurnScore(true);
    }

    previousIsRolling.current = isRolling;
  }, [isRolling]);

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

  // stick
  const currentRoll = useSelector(selectCurrentRoll);
  const hasRolled = !!currentRoll;
  const areAnyBankedDiceInvalid = useSelector(selectAreAnyBankedDiceInvalid);
  const isBlapped = useSelector(selectIsBlapped);
  const [isSticking, setIsSticking] = useState(false);

  const [playStickSound] = useSound(stickCashRegister, {
    soundEnabled: isSoundOn,
  });
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

    if (areAnyBankedDiceInvalid) {
      alert("There are invalid banked dice - can't stick.");
      setIsSticking(false);
      return;
    }

    try {
      await firebase.functions().httpsCallable('stick')({
        gameId,
      });
      playStickSound();
    } catch (error) {
      alert(error.message);
    }

    setIsSticking(false);
  };

  let canStick;

  if (!isMyTurn) {
    // not your turn - all disabled.
    canStick = false;
  } else if (isRolling) {
    // TODO needs to take into account isHoldingDownRollButton too
    // it's your turn and you're rolling
    canStick = false;
  } else if (!hasRolled) {
    // it's your turn, you're not rolling, and you haven't rolled yet
    canStick = false;
  } else if (isBlapped) {
    // it's your turn, you've rolled with a blap.
    canStick = false;
  } else {
    // it's your turn, you've rolled, and you havent blapped.
    canStick = !isSticking && hasRolled && !areAnyBankedDiceInvalid; // N.B. can stick when no scoring groups
  }

  // const noBankedDice = !bankedDice || Object.keys(bankedDice).length === 0;
  // const noPreviousScoringGroups =
  //   !previousScoringGroups || previousScoringGroups.length === 0;
  // if (noBankedDice && noPreviousScoringGroups) {
  //   return null;
  // }

  return (
    <Container>
      <TurnScoreAndStickButtonContainer>
        {typeof turnScoreSoFar === 'number' ? (
          <>
            <TurnScore>
              <TurnScoreHeader>Turn score</TurnScoreHeader>
              <TurnScoreValue>
                {showTurnScore ? turnScoreSoFar : '~'}
              </TurnScoreValue>
            </TurnScore>

            <CustomButton
              onClick={() => stick()}
              disabled={!canStick}
              loading={isSticking}>
              Stick
            </CustomButton>
          </>
        ) : null}
      </TurnScoreAndStickButtonContainer>

      <ScoringGroupsContainer>
        {bankedDiceOrder && (
          <DiceContainer key="current-roll-banking-zone">
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
        {previousScoringGroups &&
          previousScoringGroups.map(({ rollIndex, dice, order }) => {
            return (
              <DiceContainer
                key={`previous-scoring-group-for-roll-${rollIndex}`}>
                {order.map((diceId) => {
                  const value = dice[diceId];
                  return (
                    <Die key={diceId} id={diceId} value={value} isInGroup />
                  );
                })}
              </DiceContainer>
            );
          })}
      </ScoringGroupsContainer>
    </Container>
  );
};

export default ScoringGroups;
