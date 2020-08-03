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

const Text = styled.div`
  color: white;
`;

const ScoringGroupsContainer = styled.div``;

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

  return (
    <ScoringGroupsContainer>
      <Text>Scoring Groups</Text>
      {typeof turnScoreSoFar === 'number' ? (
        <Text>Turn score: {turnScoreSoFar}</Text>
      ) : null}
      <div>
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
      </div>
    </ScoringGroupsContainer>
  );
};

export default ScoringGroups;
