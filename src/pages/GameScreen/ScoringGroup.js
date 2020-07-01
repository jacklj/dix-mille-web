import React from 'react';
import styled from 'styled-components';
import Die from './Die';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 20px;
  align-items: center;
`;

const DiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const ScoringGroup = ({ groupId, dice, ungroupGroup, isMyTurn }) => {
  // only show the 'Put back' button if it's your turn
  return (
    <Container>
      <DiceContainer>
        {dice &&
          Object.keys(dice).map((id) => (
            <Die id={id} key={id} value={dice[id]} isInGroup />
          ))}
      </DiceContainer>
      {isMyTurn && (
        <button onClick={() => ungroupGroup(groupId)}>Put back</button>
      )}
    </Container>
  );
};

export default ScoringGroup;
