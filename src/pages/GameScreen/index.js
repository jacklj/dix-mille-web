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
import Die from './Die';

const Text = styled.div`
  color: white;
`;

const Button = styled.button`
  margin: 20px;
`;

const DiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const GameScreen = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentDiceRoll = useSelector(selectCurrentDiceRoll);
  const isBlapped = useSelector(selectIsBlapped);
  const [isRolling, setIsRolling] = useState(false);

  const rollDie = async (event) => {
    setIsRolling(true);
    event.preventDefault();

    try {
      await firebase.functions().httpsCallable('rollDice')({
        gameId,
      });
      setIsRolling(false);
    } catch (error) {
      setIsRolling(false);
      console.error(error);
    }
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
          <Button disabled={isRolling}>
            {isRolling ? 'Rolling...' : 'Roll'}
          </Button>
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
      <DiceContainer>
        {currentDiceRoll &&
          Object.keys(currentDiceRoll).map((id) => (
            <Die id={id} key={id} value={currentDiceRoll[id]} />
          ))}
      </DiceContainer>
      {gameUiJsx}
    </>
  );
};

export default GameScreen;
