import React, { useState } from 'react';
import 'firebase/functions';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/functions';

import {
  selectGameId,
  selectAllUserIdsWithFilledOutProfiles,
} from 'redux/game/selectors';
import { selectLoggedInUsersDetails } from 'redux/auth/selectors';
import GameCode from 'components/GameCode';
import Player from './Player';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.div`
  color: white;
`;

const PlayersContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-self: stretch;
`;

const ErrorMessage = styled.div`
  color: white;
  margin: 5px;
`;

const WaitingRoom = () => {
  const gameId = useSelector(selectGameId);
  const playerUids = useSelector(selectAllUserIdsWithFilledOutProfiles);
  const myDetails = useSelector(selectLoggedInUsersDetails);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const minimumNumberOfPlayers = 2;

  const { type, uid: myUid } = myDetails;

  const totalNumberOfPlayers = playerUids ? playerUids.length : 0;

  const startGame = async () => {
    setIsStartingGame(true);
    const startGame = firebase.functions().httpsCallable('startGame');
    const res = await startGame({ gameId });

    if (!res.data.success) {
      alert(res.data.reason);
      setIsStartingGame(false);
    }
  };

  const canStartGame = totalNumberOfPlayers >= minimumNumberOfPlayers;

  return (
    <Container>
      <Text>Waiting room</Text>
      <GameCode />

      <PlayersContainer>
        {playerUids &&
          playerUids.map((uid) => {
            const isMe = uid === myUid;
            return <Player uid={uid} key={uid} isMe={isMe} />;
          })}{' '}
      </PlayersContainer>
      {type === 'gameCreator' && (
        <>
          <button
            onClick={() => startGame()}
            disabled={!canStartGame || isStartingGame}>
            {isStartingGame ? 'Starting...' : 'Start game'}
          </button>
          {!canStartGame && minimumNumberOfPlayers && (
            <ErrorMessage>{`Need at least ${minimumNumberOfPlayers} players to play the game`}</ErrorMessage>
          )}
        </>
      )}
    </Container>
  );
};

export default WaitingRoom;
