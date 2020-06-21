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

  const rollDie = async (event) => {
    event.preventDefault();

    const res = await firebase.functions().httpsCallable('rollDice')({
      gameId,
    });

    console.log(res);
  };

  let jsx;
  if (isMyTurn) {
    jsx = (
      <form onSubmit={(event) => rollDie(event)}>
        <Button>Roll</Button>
      </form>
    );
  } else {
    jsx = (
      <>
        <Text>It's not your turn yet...</Text>
      </>
    );
  }

  return (
    <>
      <Text>Game page!</Text>
      {jsx}
      <Text>{JSON.stringify(currentDiceRoll)}</Text>
    </>
  );
};

export default GameScreen;
