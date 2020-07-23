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

const sortDiceByValue = (diceMap) => {
  const asArray = Object.keys(diceMap).map((id) => ({
    id,
    value: diceMap[id],
  }));

  const sorted = asArray.sort((a, b) => a.value - b.value);

  return sorted;
};

const ScoringGroup = ({ groupId, dice, ungroupGroup, isMyTurn }) => {
  // only show the 'Put back' button if it's your turn

  // sort dice group by value
  const diceIndexedByValue = {};
  Object.keys(dice).forEach((id) => {
    const value = dice[id];
    if (!diceIndexedByValue[value]) {
      diceIndexedByValue[value] = [];
    }
    diceIndexedByValue[value].push(id);
  });
  const sortedDice = sortDiceByValue(dice);

  return (
    <Container>
      <DiceContainer>
        {sortedDice &&
          sortedDice.map(({ id, value }) => (
            <Die id={id} key={id} value={value} isInGroup />
          ))}
      </DiceContainer>
      {isMyTurn && (
        <button onClick={() => ungroupGroup(groupId)}>ⓧ Put back</button>
      )}
    </Container>
  );
};

export default ScoringGroup;
