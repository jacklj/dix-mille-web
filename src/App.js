import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';

import AuthService from 'services/AuthService';
import Header from 'components/Header';
import Start from 'pages/Start';
import JoinGame from 'pages/JoinGame';
import PlayerSetup from 'pages/PlayerSetup';
import WaitingRoom from 'pages/WaitingRoom';
import GameScreen from 'pages/GameScreen';

import { selectGameId, selectGameStartedAt } from 'redux/game/selectors';
import { selectUid } from 'redux/auth/selectors';
import { userUpdated } from 'redux/auth/slice';
import { gameUpdated } from 'redux/game/slice';
import { avatarsUpdated } from 'redux/avatars/slice';
import TopLevelContainer from 'components/TopLevelContainer';

const ContentContainer = styled.div`
  flex: 19;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;

function App() {
  const dispatch = useDispatch();
  const gameId = useSelector(selectGameId);
  const uid = useSelector(selectUid);
  const startedAt = useSelector(selectGameStartedAt);

  useEffect(() => {
    AuthService.subscribeToAuthStateChangeListener();
    return () => AuthService.unsubscribeFromAuthStateChangeListener();
  }, []);

  useEffect(() => {
    // subscribe to user
    const userRef = firebase.database().ref(`users/${uid}`);
    if (uid) {
      userRef.on('value', (snapshot) => {
        const userObj = snapshot.val();
        dispatch(userUpdated(userObj));
      });
    }

    return () => userRef.off(); // unsubscriber
  }, [dispatch, gameId, uid]);

  useEffect(() => {
    // subscribe to game
    const gameRef = firebase.database().ref(`games/${gameId}`);
    if (gameId && uid) {
      gameRef.on('value', (snapshot) => {
        const gameObj = snapshot.val();
        dispatch(gameUpdated(gameObj));
      });
    }

    return () => gameRef.off(); // unsubscriber
  }, [dispatch, gameId, uid]);

  useEffect(() => {
    // subscribe to avatars
    let avatarsRef;

    if (uid) {
      // must  be logged in
      avatarsRef = firebase.database().ref('avatars');
      avatarsRef.on('value', (snapshot) => {
        const avatarsObj = snapshot.val();
        dispatch(avatarsUpdated(avatarsObj));
      });
    }

    return () => {
      if (avatarsRef) {
        avatarsRef.off(); // unsubscriber
      }
    };
  }, [dispatch, uid]);

  // N.B. <Redirect> components auto nav to the specified route (it's "declarative routing")
  return (
    <Router>
      {startedAt && <Redirect to="/gameScreen" />}
      <TopLevelContainer>
        <Header />
        <ContentContainer>
          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/" exact>
              <Start />
            </Route>
            <Route path="/joinGame">
              <JoinGame />
            </Route>
            <Route path="/playerSetup">
              <PlayerSetup />
            </Route>
            <Route path="/waitingRoom">
              <WaitingRoom />
            </Route>
            <Route path="/gameScreen">
              <GameScreen />
            </Route>
          </Switch>
        </ContentContainer>
      </TopLevelContainer>
    </Router>
  );
}

export default App;
