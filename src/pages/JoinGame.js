import React, { useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loggedInAndJoinedGame } from 'redux/auth/slice';
import Button from 'components/ArtDecoButton';

const Label = styled.label`
  color: white;
  margin-right: 6px;
`;

const JoinGame = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const createAnonymousProfileAndJoinGame = async (event) => {
    setIsJoining(true);
    event.preventDefault();

    if (!gameCode) {
      alert('Game code must not be empty');
      setIsJoining(false);
      return;
    }

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
      isNewUser
        ? 'Created new anonymous account: '
        : 'Already logged in (anonymously): ',
      uid,
    );

    let res;
    try {
      res = await firebase
        .functions()
        .httpsCallable('createUserProfileAndJoinGame')({ gameCode });
    } catch (error) {
      alert(error.message);
      setIsJoining(false);
      return;
    }

    const { data } = res;
    const { gameId } = data;

    dispatch(
      loggedInAndJoinedGame({
        uid,
        type: 'gameJoiner',
        gameId,
        gameCode,
      }),
    );

    history.push('/playerSetup');
    setIsJoining(false);
  };

  return (
    <form onSubmit={(event) => createAnonymousProfileAndJoinGame(event)}>
      <div>
        <Label htmlFor="gameCode">Game code</Label>
        <input
          id="gameCode"
          type="text"
          value={gameCode}
          placeholder="Game code"
          onChange={(event) => setGameCode(event.target.value)}
        />
      </div>

      <Button disabled={isJoining}>{isJoining ? 'Loading...' : 'Next'}</Button>
    </form>
  );
};

export default JoinGame;
