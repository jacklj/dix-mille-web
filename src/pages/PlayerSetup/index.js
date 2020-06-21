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
  const [hero, setHero] = useState('');
  const [film, setFilm] = useState('');

  const avatars = useSelector(selectAllAvatarsWithChosenStatus);
  const gameId = useSelector(selectGameId);
  const uid = useSelector(selectUid);

  const writePlayerProfileAndGoToWaitingRoom = async (event) => {
    event.preventDefault();

    if (avatars[currentAvatar].alreadyChosen) {
      alert(
        'Someone else has already chosen this avatar - please select another',
      );
      return;
    }

    if (!name || !hero || !film) {
      alert('Name, hero or film must not be empty');
      return;
    }

    await firebase
      .database()
      .ref() // the root reference of the DB
      .update({
        [`users/${uid}/name`]: name,
        [`users/${uid}/avatarId`]: currentAvatar,
        [`users/${uid}/hero`]: hero,
        [`users/${uid}/film`]: film,
        [`games/${gameId}/users/${uid}/name`]: name,
        [`games/${gameId}/users/${uid}/avatarId`]: currentAvatar,
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

        <div>
          <Label htmlFor="hero">Who's your hero?</Label>
          <input
            id="hero"
            type="text"
            placeholder="Your hero"
            value={hero}
            onChange={(event) => setHero(event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="hero">What is your favourite film?</Label>
          <input
            id="film"
            type="text"
            placeholder="Your favourite film"
            value={film}
            onChange={(event) => setFilm(event.target.value)}
          />
        </div>

        <Button>Next</Button>
      </form>
    </>
  );
};

export default PlayerSetup;
