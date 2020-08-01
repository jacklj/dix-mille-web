import React, { useState } from 'react';
import styled from 'styled-components';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/functions';

import { loggedInAndCreatedGame } from 'redux/auth/slice';

const Container = styled.div`
  color: white;
  font-size: 1.5em;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const IntroText = styled.div`
  margin-top: 40px;
  margin-bottom: 80px;
`;

const Button = styled.button`
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: rgba(48, 25, 53, 0.9);
  border: 2px solid #ffbf00;
  border-style: double;
  border-radius: 50px;
  margin-bottom: 40px;
  box-shadow: 0 0 0 2px rgba(48, 25, 53, 0.9), 0 0 0 4px #ffbf00;

  color: #ffbf00;
  font-family: 'Poiret One', 'Helvetica Neue', sans-serif;
  font-weight: 600;
  font-size: 1.3em;
  text-transform: uppercase;
  text-shadow: 0px -4px 5px #000000;

  &:active {
    background-color: rgb(200, 50, 50);
  }
`;

const Start = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isStartingGame, setIsStartingGame] = useState(false);

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

  return (
    <Container>
      <IntroText>Play the classic French café table dice game.</IntroText>
      <div>
        <Button
          onClick={() => createAnonymousProfileAndGame()}
          disabled={isStartingGame}>
          {isStartingGame ? 'Starting...' : 'Start a new game'}
        </Button>
      </div>
      <div>
        <Button onClick={() => history.push('/joinGame')}>Join game</Button>
      </div>
    </Container>
  );
};

export default Start;
