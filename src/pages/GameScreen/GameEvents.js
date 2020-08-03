import React, { useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';

import {
  isItMyTurn,
  selectGameId,
  selectCurrentRoll,
  selectIsBlapped,
} from 'redux/game/selectors';

import PreviousTurnOutcome from './PreviousTurnOutcome';

import { Button } from 'components/forms';

const Text = styled.div`
  color: white;
`;

const CustomButton = styled(Button)`
  margin: 20px;
`;

const GameButtons = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentRoll = useSelector(selectCurrentRoll);
  const isBlapped = useSelector(selectIsBlapped);

  const [isBlappingAndFinishingTurn, setIsBlappingAndFinishingTurn] = useState(
    false,
  );

  const endTurnAfterBlap = async (event) => {
    event.preventDefault();
    setIsBlappingAndFinishingTurn(true);

    if (!isMyTurn) {
      alert("You can't end the turn - it's not your turn!");
      setIsBlappingAndFinishingTurn(false);
      return;
    }

    try {
      const res = await firebase.functions().httpsCallable('endTurnAfterBlap')({
        gameId,
      });
      console.log(res);
    } catch (error) {
      alert(error.message);
    }

    setIsBlappingAndFinishingTurn(false);
  };

  let gameUiJsx;
  const hasRolled = !!currentRoll;

  if (isMyTurn) {
    if (!hasRolled) {
      gameUiJsx = (
        <>
          <PreviousTurnOutcome />
          <Text>Your turn now!</Text>
        </>
      );
    } else if (isBlapped) {
      gameUiJsx = (
        <>
          <form onSubmit={(event) => endTurnAfterBlap(event)}>
            <CustomButton disabled={isBlappingAndFinishingTurn}>
              {isBlappingAndFinishingTurn
                ? 'Ending turn...'
                : 'Blapped - end turn'}
            </CustomButton>
          </form>
          <Text>BLAP!</Text>
        </>
      );
    } else {
      gameUiJsx = null;
    }
  } else {
    gameUiJsx = (
      <>
        {!hasRolled && <PreviousTurnOutcome />}
        {isBlapped ? <Text>BLAP!</Text> : null}
        <Text>It's not your turn...</Text>
      </>
    );
  }

  return gameUiJsx;
};

export default GameButtons;
