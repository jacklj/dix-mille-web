import React, { useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import GameCode from 'components/GameCode';
import AvatarCarousel from './AvatarCarousel';
import {
  selectGameId,
  selectAllAvatarsWithChosenStatus,
} from 'redux/game/selectors';
import { selectUid } from 'redux/auth/selectors';

const Label = styled.label`
  color: white;
  margin-right: 6px;
`;

const Button = styled.button`
  margin: 20px;
`;

const PlayerSetup = () => {
  const history = useHistory();

  const [name, setName] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState(0);
  const [isSavingPlayerDetails, setIsSavingPlayerDetails] = useState(false);

  const avatars = useSelector(selectAllAvatarsWithChosenStatus);
  const gameId = useSelector(selectGameId);
  const uid = useSelector(selectUid);

  const writePlayerProfileAndGoToWaitingRoom = async (event) => {
    event.preventDefault();
    setIsSavingPlayerDetails(true);

    if (!avatars || avatars.length === 0) {
      alert('Please wait for the avatars to load and then choose one');
      setIsSavingPlayerDetails(false);
      return;
    }

    if (avatars[currentAvatar].alreadyChosen) {
      alert(
        'Someone else has already chosen this avatar - please select another',
      );
      setIsSavingPlayerDetails(false);
      return;
    }

    if (!name) {
      alert('Name must not be empty');
      setIsSavingPlayerDetails(false);
      return;
    }

    await firebase
      .database()
      .ref() // the root reference of the DB
      .update({
        [`users/${uid}/name`]: name,
        [`users/${uid}/avatarId`]: currentAvatar,
        [`games/${gameId}/players/${uid}/name`]: name,
        [`games/${gameId}/players/${uid}/avatarId`]: currentAvatar,
      });

    history.push('/waitingRoom');
  };

  const previousAvatar = (event) => {
    event.preventDefault();
    if (currentAvatar === 0) {
      setCurrentAvatar(avatars.length - 1);
    } else {
      setCurrentAvatar((n) => n - 1);
    }
  };

  const nextAvatar = (event) => {
    event.preventDefault();
    setCurrentAvatar((n) => (n + 1) % avatars.length);
  };

  return (
    <>
      <GameCode />

      <form onSubmit={(event) => writePlayerProfileAndGoToWaitingRoom(event)}>
        <div>
          <Label htmlFor="name">Name</Label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <AvatarCarousel
          avatars={avatars}
          currentAvatar={currentAvatar}
          previousAvatar={previousAvatar}
          nextAvatar={nextAvatar}
        />

        <Button disabled={isSavingPlayerDetails}>
          {isSavingPlayerDetails ? 'Loading...' : 'Next'}
        </Button>
      </form>
    </>
  );
};

export default PlayerSetup;
