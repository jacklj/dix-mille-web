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

const Container = styled.div`
  flex: 1;

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
    <Container>
      <PreviousTurnOutcome />
      <Text>{turnMessage}</Text>
    </Container>
  );
};

export default BetweenTurnMessages;
