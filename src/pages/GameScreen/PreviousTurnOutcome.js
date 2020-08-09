import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { selectPreviousTurnOutcome } from 'redux/game/selectors';

const Text = styled.div`
  flex: none;

  color: white;
  font-size: 1.5em;
`;

const PreviousTurnOutcome = () => {
  const previousTurnOutcome = useSelector(selectPreviousTurnOutcome);

  if (!previousTurnOutcome) {
    return null;
  }

  return <Text>{previousTurnOutcome}</Text>;
};

export default PreviousTurnOutcome;
