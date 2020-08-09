import React, { useState } from 'react';
import styled from 'styled-components';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/functions';

import { loggedInAndCreatedGame } from 'redux/auth/slice';
import { Button } from 'components/forms';

const Container = styled.div`
  overflow: scroll;
`;

const IntroText = styled.div`
  margin-top: 40px;
  margin-bottom: 80px;

  color: #ffdc73;
  font-size: 1.5em;
`;

const CustomButton = styled(Button)`
  margin-bottom: 40px;
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
        <CustomButton
          onClick={() => createAnonymousProfileAndGame()}
          loading={isStartingGame}
          disabled={isStartingGame}>
          {isStartingGame ? 'Starting...' : 'Start a new game'}
        </CustomButton>
      </div>
      <div>
        <CustomButton onClick={() => history.push('/joinGame')}>
          Join game
        </CustomButton>
      </div>
    </Container>
  );
};

export default Start;
