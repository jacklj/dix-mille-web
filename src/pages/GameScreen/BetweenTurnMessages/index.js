import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import {
  isItMyTurn,
  selectIsRolling,
  selectCurrentRoll,
  selectCurrentTurnPlayerName,
} from 'redux/game/selectors';
import PreviousTurnOutcome from './PreviousTurnOutcome';

const OuterContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  display: flex;

  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  margin: 10px;
  max-width: 700px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Text = styled.div`
  flex: none;

  font-family: Limelight;
  font-size: 2em;
  color: white;
`;

const makePossessive = (word) => {
  if (!word) {
    return word;
  }

  const lastLetter = word[word.length - 1];

  if (lastLetter.toLowerCase() === 's') {
    return word + "'";
  } else {
    return word + "'s";
  }
};

const BetweenTurnMessages = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const currentTurnPlayersName = useSelector(selectCurrentTurnPlayerName);
  const isRolling = useSelector(selectIsRolling);
  const currentRoll = useSelector(selectCurrentRoll);
  const hasRolled = !!currentRoll;

  if (isRolling || hasRolled) {
    return null;
  }

  const turnMessage = `It's ${
    isMyTurn ? 'your' : makePossessive(currentTurnPlayersName)
  } turn!`;

  return (
    <OuterContainer>
      <Container>
        <PreviousTurnOutcome />
        <Text>{turnMessage}</Text>
      </Container>
    </OuterContainer>
  );
};

export default BetweenTurnMessages;
