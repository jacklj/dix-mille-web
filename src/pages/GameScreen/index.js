import React from 'react';

import ScoresTable from './ScoresTable';
import WinnerOverlay from './WinnerOverlay';
import RolledDice from './RolledDice';
import ScoringGroups from './ScoringGroups';
import GameEvents from './GameEvents';
import GameButtons from './GameButtons';

const GameScreen = () => {
  return (
    <>
      <RolledDice />
      <ScoringGroups />
      <GameEvents />
      <GameButtons />
      <ScoresTable />
      <WinnerOverlay />
    </>
  );
};

export default GameScreen;
