import React, { useEffect } from 'react';
import styled from 'styled-components';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';

import AuthService from 'services/AuthService';
import Header from 'components/Header';
import Start from 'pages/Start';
import JoinGame from 'pages/JoinGame';
import PlayerSetup from 'pages/PlayerSetup';
import WaitingRoom from 'pages/WaitingRoom';

import {
  selectGameId,
  // selectCurrentPage,
  // selectScenario,
} from 'redux/game/selectors';
import { selectUid } from 'redux/auth/selectors';
import { userUpdated } from 'redux/auth/slice';
import { gameUpdated } from 'redux/game/slice';
import { avatarsUpdated } from 'redux/avatars/slice';

const Container = styled.div`
  text-align: center;
  min-height: 100vh;
  background-color: #282c34;
`;

const ContentContainer = styled.header`
  margin-top: 50px;
`;

function App() {
  const dispatch = useDispatch();
  const gameId = useSelector(selectGameId);
  // const currentPage = useSelector(selectCurrentPage);
  const uid = useSelector(selectUid);
  // const scenario = useSelector(selectScenario);

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
        console.log('User updated: ', userObj);
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
        console.log('Avatars updated: ', avatarsObj);
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
      <Container>
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
          </Switch>
        </ContentContainer>
      </Container>
    </Router>
  );
}

export default App;
