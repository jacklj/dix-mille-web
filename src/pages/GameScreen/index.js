import React from 'react';
import styled from 'styled-components';

import WinnerOverlay from './WinnerOverlay';
import RolledDice from './RolledDice';
import ScoringGroups from './ScoringGroups';
import BetweenTurnMessages from './BetweenTurnMessages';
import DiceCup from './DiceCup';

const Container = styled.div`
  flex: 1;
  overflow-y: hidden;
  overflow-x: hidden;

  z-index: 0; // establish stacking context for pages (so Overlay is always on top)

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  align-items: center;

  @media (min-width: 900px) {
    // Unless mobile in landscape - allow to be full width?
    width: 900px;
    align-self: center;
  }

  @media (orientation: landscape) {
    flex-direction: row-reverse;
  }

  position: relative;
`;

const GameScreen = () => {
  // const currentRoll = useSelector(selectCurrentRoll);
  // const hasRolled = !!currentRoll;

  return (
    <>
      <Container>
        <BetweenTurnMessages />
        <RolledDice />
        <ScoringGroups />
        <DiceCup />
      </Container>
      <WinnerOverlay />
    </>
  );
};

export default GameScreen;
