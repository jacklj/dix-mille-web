import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import WinnerOverlay from './WinnerOverlay';
import RolledDice from './RolledDice';
import ScoringGroups from './ScoringGroups';
import BetweenTurnMessages from './BetweenTurnMessages';
import GameButtons from './GameButtons';

import { selectCurrentRoll } from 'redux/game/selectors';

const DiceZone = styled.div`
  flex: 1;
  overflow: scroll;

  display: flex;
  flex-direction: column;
  justify-content: 'space-between';
  align-items: center;

  @media (min-width: 900px) {
    width: 850px;
    align-self: center;
  }
`;

const GameScreen = () => {
  const currentRoll = useSelector(selectCurrentRoll);
  const hasRolled = !!currentRoll;

  return (
    <>
      <DiceZone>
        {hasRolled ? (
          <>
            <RolledDice />
            <ScoringGroups />
          </>
        ) : (
          <BetweenTurnMessages />
        )}
      </DiceZone>
      <GameButtons />
      <WinnerOverlay />
    </>
  );
};

export default GameScreen;
