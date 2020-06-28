import React, { useState } from 'react';
import 'firebase/functions';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as firebase from 'firebase/app';
import 'firebase/functions';

import {
  selectGameId,
  selectOtherUsersWithFilledOutProfiles,
} from 'redux/game/selectors';
import { selectLoggedInUsersDetails } from 'redux/auth/selectors';
// import { selectMinNumberOfPlayers } from 'redux/definitions/selectors';
import Player from './Player';
import GameCode from 'components/GameCode';

const Text = styled.div`
  color: white;
`;

const ThisUser = styled.div`
  color: white;
  margin: 20px;
  font-size: 3em;
`;

const OtherUsers = styled.div``;

const ErrorMessage = styled.div`
  color: white;
  margin: 5px;
`;

const WaitingRoom = () => {
  const gameId = useSelector(selectGameId);
  const otherPlayerUids = useSelector(selectOtherUsersWithFilledOutProfiles);
  const myDetails = useSelector(selectLoggedInUsersDetails);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const minimumNumberOfPlayers = 2;

  const { name, type } = myDetails;

  const totalNumberOfPlayers = otherPlayerUids ? otherPlayerUids.length + 1 : 1;

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
    <>
      <Text>Waiting room</Text>
      <GameCode />

      <ThisUser>{name}</ThisUser>
      <OtherUsers>
        {otherPlayerUids &&
          otherPlayerUids.map((uid) => <Player uid={uid} key={uid} />)}
      </OtherUsers>
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
    </>
  );
};

export default WaitingRoom;
