import React, { useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { loggedInAndJoinedGame } from 'redux/auth/slice';
import {
  isItMyTurn,
  selectGameId,
  selectCurrentDiceRoll,
  selectIsBlapped,
} from 'redux/game/selectors';

const Text = styled.div`
  color: white;
`;

const Button = styled.button`
  margin: 20px;
`;

const GameScreen = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentDiceRoll = useSelector(selectCurrentDiceRoll);
  const isBlapped = useSelector(selectIsBlapped);

  const rollDie = async (event) => {
    event.preventDefault();

    const res = await firebase.functions().httpsCallable('rollDice')({
      gameId,
    });

    console.log(res);
  };

  const endTurnAfterBlap = async (event) => {
    event.preventDefault();

    const res = await firebase.functions().httpsCallable('endTurnAfterBlap')({
      gameId,
    });

    console.log(res);
  };

  let gameUiJsx;
  if (isMyTurn) {
    if (!isBlapped) {
      gameUiJsx = (
        <form onSubmit={(event) => rollDie(event)}>
          <Button>Roll</Button>
        </form>
      );
    } else {
      gameUiJsx = (
        <>
          <form onSubmit={(event) => endTurnAfterBlap(event)}>
            <Button>Blapped - end turn</Button>
          </form>
          <Text>BLAP!</Text>
        </>
      );
    }
  } else {
    gameUiJsx = (
      <>
        <Text>It's not your turn yet...</Text>
      </>
    );
  }

  return (
    <>
      <Text>Game page!</Text>
      <Text>{JSON.stringify(currentDiceRoll)}</Text>
      {gameUiJsx}
    </>
  );
};

export default GameScreen;
