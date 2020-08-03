import React from 'react';
import styled from 'styled-components';

import ScoresTable from './ScoresTable';
import WinnerOverlay from './WinnerOverlay';
import RolledDice from './RolledDice';
import ScoringGroups from './ScoringGroups';
import GameEvents from './GameEvents';
import GameButtons from './GameButtons';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const GameScreen = () => {
  return (
    <Container>
      <RolledDice />
      <ScoringGroups />
      {/* <GameEvents /> */}
      <GameButtons />
      {/* <ScoresTable /> */}
      <WinnerOverlay />
    </Container>
  );
};

export default GameScreen;
