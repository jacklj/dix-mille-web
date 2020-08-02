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
  selectAllUsedNames,
} from 'redux/game/selectors';
import { selectUid } from 'redux/auth/selectors';
import Button from 'components/ArtDecoButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-right: 8px;
  font-size: 1.2em;
`;

const Input = styled.input`
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 2px solid rgb(180, 176, 85);
  color: #ffbf00;
  font-size: 1.1em;
  font-family: 'Playfair Display', serif;

  &::placeholder {
    font-size: 1.1em;
    color: rgba(180, 176, 85, 0.5);
  }
`;

const PlayerSetup = () => {
  const history = useHistory();

  const [name, setName] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState(0);
  const [isSavingPlayerDetails, setIsSavingPlayerDetails] = useState(false);

  const avatars = useSelector(selectAllAvatarsWithChosenStatus);
  const gameId = useSelector(selectGameId);
  const uid = useSelector(selectUid);
  const usedNames = useSelector(selectAllUsedNames);

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

    const isThisNameAlreadyUsed = usedNames.some(
      (usedName) => usedName === name,
    );
    if (isThisNameAlreadyUsed) {
      alert(`Name '${name}' has already been taken - please choose another.`);
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
    <Container>
      <GameCode />

      <form onSubmit={(event) => writePlayerProfileAndGoToWaitingRoom(event)}>
        <div>
          <Label htmlFor="name">Name:</Label>
          <Input
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
    </Container>
  );
};

export default PlayerSetup;
