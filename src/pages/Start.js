import React from 'react';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/functions';

import { loggedInAndCreatedGame } from 'redux/auth/slice';

const Start = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const createAnonymousProfileAndGame = async () => {
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

    const res = await firebase
      .functions()
      .httpsCallable('createUserProfileAndCreateGame')();

    console.log('cf done: ', res); // could return user and game data here, but also need to subscribe to the game obj
    const { data } = res;
    const gameId = data.gameId;
    const gameCode = data.gameCode;

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
    <>
      <div>
        <button onClick={() => createAnonymousProfileAndGame()}>
          Start a new game
        </button>
      </div>
      <div>
        <button onClick={() => history.push('/joinGame')}>Join game</button>
      </div>
    </>
  );
};

export default Start;
