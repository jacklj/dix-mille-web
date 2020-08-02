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
import Button from 'components/ArtDecoButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-family: Limelight;
  color: white;
  font-size: 2.2em;
  font-weight: normal;
  margin: 0;
  margin-bottom: 20px;
`;

const PlayersContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-self: stretch;
`;

const ErrorMessage = styled.div`
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

    try {
      await firebase.functions().httpsCallable('startGame')({ gameId });
    } catch (error) {
      alert(error.message);
    }
    setIsStartingGame(false);
  };

  const canStartGame = totalNumberOfPlayers >= minimumNumberOfPlayers;

  return (
    <Container>
      <Title>Waiting Room</Title>
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
          <Button
            onClick={() => startGame()}
            disabled={!canStartGame || isStartingGame}>
            {isStartingGame ? 'Starting...' : 'Start game'}
          </Button>
          {!canStartGame && minimumNumberOfPlayers && (
            <ErrorMessage>{`Need at least ${minimumNumberOfPlayers} players to play the game`}</ErrorMessage>
          )}
        </>
      )}
    </Container>
  );
};

export default WaitingRoom;
