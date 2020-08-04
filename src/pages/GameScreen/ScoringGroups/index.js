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
  align-self: stretch;
`;

const Hr = styled.hr`
  height: 5px;
  width: 80%;

  margin-bottom: 3px;

  background-color: rgb(180, 176, 85);
  border: 0;
  border-radius: 5px;
`;

const TurnScoreText = styled.div`
  color: white;
  margin-bottom: 10px;
`;

const ScoringGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
      <Hr />
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
