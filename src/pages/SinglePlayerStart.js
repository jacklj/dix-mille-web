import React, { useState } from 'react';
import styled from 'styled-components';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/functions';

import { loggedInAndCreatedGame } from 'redux/auth/slice';
import { Button } from 'components/forms';
import SetupScreenContainer from 'components/SetupScreenContainer';
import HighScoresTable from 'components/HighScoresTable';
import Link from 'components/Link';
import { H2, Text } from 'components/intro';

const CustomButton = styled(Button)`
  margin-bottom: 40px;
`;

const SinglePlayerStart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isStartingGame, setIsStartingGame] = useState(false);

  const createAnonymousProfileAndGame = async () => {
    setIsStartingGame(true);
    // set auth persistence level:
    // LOCAL - persists across tabs
    // SESSION - persists within a tab (across page refreshes, but not shared between tabs)
    // NONE - doesnt persist at all.
    await firebase
      .auth()
      .setPersistence(
        process.env.NODE_ENV === 'development'
          ? firebase.auth.Auth.Persistence.SESSION
          : firebase.auth.Auth.Persistence.LOCAL,
      );

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
        .httpsCallable('createUserProfileAndCreateGame')({
        gameType: 'singlePlayer',
      });
    } catch (error) {
      alert(error.message);
      setIsStartingGame(false);
      return;
    }

    // could return user and game data here, but also need to subscribe to the game obj
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

  return (
    <SetupScreenContainer>
      <H2>Single player</H2>
      <Text>Score as many points as you can in 6 rounds.</Text>

      <div>
        <CustomButton
          onClick={() => createAnonymousProfileAndGame()}
          loading={isStartingGame}
          loadingMessage="Starting">
          Start game
        </CustomButton>
      </div>
      <HighScoresTable />

      <Link onClick={() => history.goBack()}>{' < back'}</Link>
    </SetupScreenContainer>
  );
};

export default SinglePlayerStart;
