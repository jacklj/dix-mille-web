import React, { useEffect, useState } from 'react';
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

const diceSelectedInitialState = {
  a: false,
  b: false,
  c: false,
  d: false,
  e: false,
  f: false,
};

const GameScreen = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const gameId = useSelector(selectGameId);
  const currentDiceRoll = useSelector(selectCurrentDiceRoll);
  const isBlapped = useSelector(selectIsBlapped);
  const [isRolling, setIsRolling] = useState(false);
  const [isGrouping, setIsGrouping] = useState(false);
  const [isBlappingAndFinishingTurn, setIsBlappingAndFinishingTurn] = useState(
    false,
  );
  const [diceSelectedState, setDiceSelectedState] = useState(
    diceSelectedInitialState,
  );

  useEffect(() => {
    setDiceSelectedState(diceSelectedInitialState);
  }, [currentDiceRoll]);

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

  const createDiceGroup = async () => {
    setIsGrouping(true);

    // check on front end for invalid groups, then write to DB (less secure but quicker for current turn player)
    const selectedDiceIds = Object.keys(diceSelectedState).filter(
      (id) => diceSelectedState[id],
    );
    const diceValues = selectedDiceIds.map((id) => currentDiceRoll[id]);
    const numberOfDice = selectedDiceIds.length;

    if (numberOfDice === 1) {
      if (diceValues[0] === 1 || diceValues[0] === 5) {
        console.log("That's a valid group: 1 or 5!");
      } else {
        alert("That's not a valid set of dice");
      }
    } else if (numberOfDice === 3) {
      // 3 of a kind?
      if (diceValues.every((value) => value === diceValues[0])) {
        console.log("That's a valid group: 3 of a kind!");
      } else {
        alert("That's not a valid set of dice");
      }
    } else {
      // TODO 3 pairs
      // TODO 1 2 3 4 5 6
      alert("That's not a valid set of dice");
    }
    setIsGrouping(false);
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
        <>
          <Button onClick={() => createDiceGroup()} disabled={isGrouping}>
            {isGrouping ? 'Grouping...' : 'Group dice'}
          </Button>
          <form onSubmit={(event) => rollDie(event)}>
            <Button disabled={isRolling}>
              {isRolling ? 'Rolling...' : 'Roll'}
            </Button>
          </form>
        </>
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
