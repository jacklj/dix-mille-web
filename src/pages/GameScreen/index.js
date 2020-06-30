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
  justify-content: space-between;
  margin: 20px;
`;

const GameScreen = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentDiceRoll = useSelector(selectCurrentDiceRoll);
  const isBlapped = useSelector(selectIsBlapped);
  const [isRolling, setIsRolling] = useState(false);
  const [isBlappingAndFinishingTurn, setIsBlappingAndFinishingTurn] = useState(
    false,
  );
  const [diceSelectedState, setDiceSelectedState] = useState({
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
  });

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
    setIsBlappingAndFinishingTurn(true);
    event.preventDefault();

    const res = await firebase.functions().httpsCallable('endTurnAfterBlap')({
      gameId,
    });

    setIsBlappingAndFinishingTurn(false);
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
            <Button disabled={isBlappingAndFinishingTurn}>
              {isBlappingAndFinishingTurn
                ? 'Ending turn...'
                : 'Blapped - end turn'}
            </Button>
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
      <DiceContainer>
        {currentDiceRoll &&
          Object.keys(currentDiceRoll).map((id) => (
            <Die
              id={id}
              key={id}
              value={currentDiceRoll[id]}
              selected={diceSelectedState[id]}
              onClick={() => {
                console.log(`Clicked on dice '${id}'`);
                setDiceSelectedState((x) => ({ ...x, [id]: !x[id] }));
              }}
            />
          ))}
      </DiceContainer>
      {gameUiJsx}
    </>
  );
};

export default GameScreen;
