import React from 'react';
import styled from 'styled-components';

import Die from 'components/Die';
import PutBackButton from './PutBackButton';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  flexwrap: nowrap;
  overflow: hidden;

  margin-bottom: 10px;
`;

const DiceContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    max-width: 170px;
  }
`;

const sortDiceByValue = (diceMap) => {
  const asArray = Object.keys(diceMap).map((id) => ({
    id,
    value: diceMap[id],
  }));

  const sorted = asArray.sort((a, b) => a.value - b.value);

  return sorted;
};

const ScoringGroup = ({ groupId, dice, ungroupGroup, isMyTurn, isCurrent }) => {
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

      {isMyTurn && isCurrent && (
        <PutBackButton onClick={() => ungroupGroup(groupId)} />
      )}
    </Container>
  );
};

export default ScoringGroup;
