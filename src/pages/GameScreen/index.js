import React from 'react';

import ScoresTable from './ScoresTable';
import WinnerOverlay from './WinnerOverlay';
import RolledDice from './RolledDice';
import ScoringGroups from './ScoringGroups';
import GameButtons from './GameButtons';

const GameScreen = () => {
  return (
    <>
      <RolledDice />
      <GameButtons />
      <ScoringGroups />
      <ScoresTable />
      <WinnerOverlay />
    </>
  );
};

export default GameScreen;
