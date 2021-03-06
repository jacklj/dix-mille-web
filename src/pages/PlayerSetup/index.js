import React, { useState } from 'react';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import GameCode from 'components/GameCode';
import AvatarCarousel from './AvatarCarousel';
import {
  selectGameId,
  selectAllAvatarsWithChosenStatus,
  selectAllUsedNames,
  selectIsSinglePlayerGame,
} from 'redux/game/selectors';
import { selectUid } from 'redux/auth/selectors';
import { Button, Input, Label, FieldContainer } from 'components/forms';
import SetupScreenContainer from 'components/SetupScreenContainer';
import Link from 'components/Link';

const Form = styled.form`
  align-self: stretch;
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
  const isSinglePlayerGame = useSelector(selectIsSinglePlayerGame);

  const writePlayerProfileAndGoNext = async (event) => {
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

    if (isSinglePlayerGame) {
      try {
        await firebase.functions().httpsCallable('startGame')({ gameId });
      } catch (error) {
        alert(error.message);
        setIsSavingPlayerDetails(false);
        return;
      }
    } else {
      history.push('/waitingRoom');
    }
  };

  const onAvatarSelected = (index) => {
    setCurrentAvatar(index);
  };

  return (
    <SetupScreenContainer>
      {isSinglePlayerGame ? null : <GameCode />}

      <Form onSubmit={(event) => writePlayerProfileAndGoNext(event)}>
        <FieldContainer>
          <Label htmlFor="name">Name:</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FieldContainer>

        <AvatarCarousel avatars={avatars} onAvatarSelected={onAvatarSelected} />

        <Button loading={isSavingPlayerDetails}>
          {isSinglePlayerGame ? 'Start' : 'Next'}
        </Button>
      </Form>
      <Link onClick={() => history.goBack()}>{' < back'}</Link>
    </SetupScreenContainer>
  );
};

export default PlayerSetup;
