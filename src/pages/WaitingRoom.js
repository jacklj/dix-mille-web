import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/analytics';

import {
  selectGameId,
  selectAllUserIdsWithFilledOutProfiles,
} from 'redux/game/selectors';
import { selectLoggedInUsersDetails } from 'redux/auth/selectors';
import GameCode from 'components/GameCode';
import PlayerProfile from 'components/PlayerProfile';
import { Button } from 'components/forms';
import SetupScreenContainer from 'components/SetupScreenContainer';

const Title = styled.h2`
  font-family: Limelight;
  color: white;
  font-size: 2.2em;
  font-weight: normal;
  margin: 0;
  margin-bottom: 20px;

  flex-shrink: 0; // required to prevent Safari freaking out
`;

const PlayersContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-self: stretch;

  flex-shrink: 0; // required to prevent Safari freaking out
`;

const CustomButton = styled(Button)`
  margin-bottom: 0;

  flex-shrink: 0; // required to prevent Safari freaking out
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
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
      firebase.analytics().logEvent('start_game', {
        game_type: 'multiplayer',
        number_of_players: totalNumberOfPlayers,
      });
    } catch (error) {
      alert(error.message);
      setIsStartingGame(false);
    }
  };

  const canStartGame = totalNumberOfPlayers >= minimumNumberOfPlayers;

  return (
    <SetupScreenContainer>
      <GameCode />
      <Title>Waiting Room</Title>

      <PlayersContainer>
        {playerUids &&
          playerUids.map((uid) => {
            const isMe = uid === myUid;
            return <PlayerProfile uid={uid} key={uid} isMe={isMe} />;
          })}{' '}
      </PlayersContainer>
      {type === 'gameCreator' && (
        <>
          <CustomButton
            onClick={() => startGame()}
            loading={isStartingGame}
            disabled={!canStartGame}
            loadingMessage="Starting">
            Start game
          </CustomButton>
          {!canStartGame && minimumNumberOfPlayers && (
            <ErrorMessage>{`Need at least ${minimumNumberOfPlayers} players to play the game`}</ErrorMessage>
          )}
        </>
      )}
    </SetupScreenContainer>
  );
};

export default WaitingRoom;
