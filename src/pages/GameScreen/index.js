import React from 'react';
import styled from 'styled-components';

import ScoresTable from './ScoresTable';
import WinnerOverlay from './WinnerOverlay';
import RolledDice from './RolledDice';
import ScoringGroups from './ScoringGroups';
import GameEvents from './GameEvents';
import GameButtons from './GameButtons';

const DiceZone = styled.div`
  flex: 1;
  overflow: scroll;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 900px) {
    width: 850px;
    align-self: center;
  }
`;

const GameScreen = () => {
  return (
    <>
      <DiceZone>
        <RolledDice />
        <ScoringGroups />
      </DiceZone>
      {/* <GameEvents /> */}
      {/* <ScoresTable /> */}
      <GameButtons />
      <WinnerOverlay />
    </>
  );
};

export default GameScreen;
