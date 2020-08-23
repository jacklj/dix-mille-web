import React, { useState } from 'react';
import styled from 'styled-components';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/functions';

import Logo from './Logo';
import { loggedInAndCreatedGame } from 'redux/auth/slice';
import { Button } from 'components/forms';
import SetupScreenContainer from 'components/SetupScreenContainer';
import Dice from 'components/Dice3d';

const IntroText = styled.div`
  margin-top: 40px;
  margin-bottom: 80px;

  color: #ffdc73;
  font-size: 1.5em;

  text-shadow: 0 8px 8px rgba(0, 0, 0, 0.5);
`;

const CustomButton = styled(Button)`
  margin-bottom: 40px;
`;

const Start = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [desiredDiceValue, setDesiredDiceValue] = useState(1);
  const [actualDiceValue, setActualDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const createAnonymousProfileAndGame = async () => {
    setIsStartingGame(true);
    // set auth persistence level:
    // LOCAL - persists across tabs
    // SESSION - persists within a tab (across page refreshes, but not shared between tabs)
    // NONE - doesnt persist at all.
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    const result = await firebase.auth().signInAnonymously();
    const { additionalUserInfo, user } = result;
    const { uid } = user;
    const { isNewUser } = additionalUserInfo;

    console.log(
      `[createAnonymousProfileAndGame] ${
        isNewUser
          ? 'Created new anonymous account'
          : 'Already logged in (anonymously)'
      }: ${uid}`,
    );

    let res;
    try {
      res = await firebase
        .functions()
        .httpsCallable('createUserProfileAndCreateGame')();
    } catch (error) {
      alert(error.message);
      setIsStartingGame(false);
      return;
    }

    console.log('cf done: ', res); // could return user and game data here, but also need to subscribe to the game obj
    const { data } = res;
    const { gameId, gameCode } = data;

    dispatch(
      loggedInAndCreatedGame({
        uid,
        type: 'gameCreator',
        gameId,
        gameCode,
      }),
    );

    history.push('/playerSetup');
  };

  // N.B. <div>s around buttons are to fix a bug in mobile Safari where the flex container
  // forces the buttons to be really short (ie squished vertically)

  const startRolling = (event) => {
    event.preventDefault();
    setRolling(true);
  };

  const stopRolling = (event) => {
    event.preventDefault();

    setRolling(false);
    setActualDiceValue(desiredDiceValue);
  };

  return (
    <SetupScreenContainer>
      <select
        value={desiredDiceValue}
        onChange={(event) => {
          setDesiredDiceValue(parseInt(event.target.value));
        }}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>

      <button
        onMouseDown={startRolling}
        onTouchStart={startRolling}
        onMouseUp={stopRolling}
        onTouchEnd={stopRolling}>
        roll
      </button>
      <Logo />

      <Dice value={actualDiceValue} rolling={rolling} />
      <IntroText>Play the classic French café table dice game.</IntroText>
      <div>
        <CustomButton
          onClick={() => createAnonymousProfileAndGame()}
          loading={isStartingGame}
          loadingMessage="Starting">
          Start game
        </CustomButton>
      </div>
      <div>
        <CustomButton onClick={() => history.push('/joinGame')}>
          Join game
        </CustomButton>
      </div>
    </SetupScreenContainer>
  );
};

export default Start;
