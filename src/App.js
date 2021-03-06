import React, { Suspense, useEffect } from 'react';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';

import Header from 'components/Header';
import Overlays from 'components/Overlays';
import TopLevelContainer from 'components/TopLevelContainer';
import ContentContainer from 'components/ContentContainer';
import Loading from 'components/Loading';
import { selectGameId, selectGameStartedAt } from 'redux/game/selectors';
import { selectUid } from 'redux/auth/selectors';
import { userUpdated } from 'redux/auth/slice';
import { gameUpdated } from 'redux/game/slice';
import { avatarsUpdated } from 'redux/avatars/slice';

const Start = React.lazy(() => import('pages/Start'));
const SinglePlayerStart = React.lazy(() => import('pages/SinglePlayerStart'));
const MultiplayerStart = React.lazy(() => import('pages/MultiplayerStart'));
const JoinGame = React.lazy(() => import('pages/JoinGame'));
const PlayerSetup = React.lazy(() => import('pages/PlayerSetup'));
const WaitingRoom = React.lazy(() => import('pages/WaitingRoom'));
const GameScreen = React.lazy(() => import('pages/GameScreen'));

function App() {
  const dispatch = useDispatch();
  const gameId = useSelector(selectGameId);
  const uid = useSelector(selectUid);
  const startedAt = useSelector(selectGameStartedAt);

  useEffect(() => {
    // subscribe to auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        // console.log('User signed in');
      } else {
        // User is signed out.
        // console.log('User signed out');
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    // subscribe to user object changes
    const userRef = firebase.database().ref(`users/${uid}`);
    if (uid) {
      userRef.on('value', (snapshot) => {
        const userObj = snapshot.val();
        dispatch(userUpdated(userObj));
      });
    }

    return () => userRef.off();
  }, [dispatch, gameId, uid]);

  useEffect(() => {
    // subscribe to game object changes
    const gameRef = firebase.database().ref(`games/${gameId}`);
    if (gameId && uid) {
      // console.log('subscribe to game object');
      gameRef.on('value', (snapshot) => {
        const gameObj = snapshot.val();
        dispatch(gameUpdated(gameObj));
      });
    }

    return () => {
      // console.log('unsubscribe from game object.');
      gameRef.off(); // unsubscriber - if you finish or quit a game, will hopefully unsubscribe and then not resubscribe!
    };
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
        <Overlays />

        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path="/" exact>
              <ContentContainer>
                <Start />
              </ContentContainer>
            </Route>
            <Route path="/singlePlayerStart">
              <ContentContainer>
                <SinglePlayerStart />
              </ContentContainer>
            </Route>
            <Route path="/multiplayerStart">
              <ContentContainer>
                <MultiplayerStart />
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
        </Suspense>
      </TopLevelContainer>
    </Router>
  );
}

export default App;
