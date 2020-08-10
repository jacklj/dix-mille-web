import React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';

import {
  isItMyTurn,
  selectGameId,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectPreviousScoringGroupsSinceLastFullRoll,
  selectCurrentScoringGroups,
  selectTurnScoreSoFar,
} from 'redux/game/selectors';
import ScoringGroup from './ScoringGroup';

const Container = styled.div`
  flex: 1;
  flex-shrink: 0;

  align-self: stretch;

  // so content doesn't go under the notch on notched phones
  padding-left: max(
    env(safe-area-inset-left),
    32px
  ); // min value of 32px, so dice dont scroll into button border radius curve and look weird
  padding-right: max(env(safe-area-inset-right), 32px);
  // N.B. the max() function doesnt work on Firefox for Android.
`;

const TurnScoreText = styled.div`
  flex-shrink: 0;
  text-align: left;

  color: white;
  margin-bottom: 10px;
`;

const ScoringGroupsContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column-reverse;
`;

const ScoringGroups = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);

  const currentScoringGroups = useSelector(selectCurrentScoringGroups);
  const previousScoringGroups = useSelector(
    selectPreviousScoringGroupsSinceLastFullRoll,
  );
  const turnScoreSoFar = useSelector(selectTurnScoreSoFar);

  const currentRollNumber = useSelector(selectCurrentRollNumber);

  const ungroupGroup = async (groupId) => {
    if (!isMyTurn) {
      alert("You can't ungroup - it's not your turn!");
      return;
    }

    await firebase
      .database()
      .ref(
        `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}/scoringGroups/${groupId}`,
      )
      .remove();
  };

  if (
    (!currentScoringGroups || Object.keys(currentScoringGroups).length === 0) &&
    (!previousScoringGroups || Object.keys(previousScoringGroups).length === 0)
  ) {
    return null;
  }

  return (
    <Container>
      {typeof turnScoreSoFar === 'number' ? (
        <TurnScoreText>Turn score: {turnScoreSoFar}</TurnScoreText>
      ) : null}
      <ScoringGroupsContainer>
        {currentScoringGroups &&
          Object.keys(currentScoringGroups).map((groupId) => {
            const groupObj = currentScoringGroups[groupId];
            const { dice } = groupObj;
            return (
              <ScoringGroup
                key={groupId}
                groupId={groupId}
                dice={dice}
                isCurrent
                ungroupGroup={ungroupGroup}
                isMyTurn={isMyTurn}
              />
            );
          })}
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
