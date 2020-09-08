import React, { useEffect } from 'react';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';

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
import ContentContainer from 'components/ContentContainer';

function App() {
  const dispatch = useDispatch();
  const gameId = useSelector(selectGameId);
  const uid = useSelector(selectUid);
  const startedAt = useSelector(selectGameStartedAt);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log('User signed in', user);
        // const { displayName: name, email, uid } = user;
        // dispatch(loggedIn({ uid, name, email }));
      } else {
        // User is signed out.
        console.log('User signed out', user);
        // dispatch(loggedOut());
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [dispatch]);

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

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/" exact>
            <ContentContainer>
              <Start />
            </ContentContainer>
          </Route>
          <Route path="/joinGame">
            <ContentContainer>
              <JoinGame />
            </ContentContainer>
          </Route>
          <Route path="/playerSetup">
            <ContentContainer>
              <PlayerSetup />
            </ContentContainer>
          </Route>
          <Route path="/waitingRoom">
            <ContentContainer>
              <WaitingRoom />
            </ContentContainer>
          </Route>
          <Route path="/gameScreen">
            <GameScreen />
          </Route>
        </Switch>
      </TopLevelContainer>
    </Router>
  );
}

export default App;
