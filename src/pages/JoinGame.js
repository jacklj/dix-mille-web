import React, { useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loggedInAndJoinedGame } from 'redux/auth/slice';

const Label = styled.label`
  color: white;
  margin-right: 6px;
`;

const Button = styled.button`
  margin: 20px;
`;

const JoinGame = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [gameCode, setGameCode] = useState('');

  const createAnonymousProfileAndJoinGame = async (event) => {
    event.preventDefault();

    if (!gameCode) {
      alert('Game code must not be empty');
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

    const res = await firebase
      .functions()
      .httpsCallable('createUserProfileAndJoinGame')({ gameCode });

    if (!res.data.success) {
      alert(res.data.reason);
      return;
    }

    const { data } = res;
    const { gameId, scenario } = data;

    dispatch(
      loggedInAndJoinedGame({
        uid,
        type: 'gameJoiner',
        gameId,
        gameCode,
        scenario,
      }),
    );

    history.push('/playerSetup');
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

      <Button>Next</Button>
    </form>
  );
};

export default JoinGame;
