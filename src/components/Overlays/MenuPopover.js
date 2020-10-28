import React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { selectGameId, selectMyAvatarUrl } from 'redux/game/selectors';
import { userHasLeftGame } from 'redux/game/moreActions';
import { selectName } from 'redux/auth/selectors';
import { showOverlay } from 'redux/ui/slice';
import CONSTANTS from 'services/constants';
import HeaderButton from 'components/Header/HeaderButton';
import TrophyIcon from 'components/Header/TrophyIcon';
import ScrollIcon from 'components/Header/ScrollIcon';
import QuitIcon from 'components/Header/QuitIcon';
import SoundOnOffButton from 'components/Header/SoundOnOffButton';

import Overlay from 'components/Overlay';

const ProfileImage = styled.img`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  height: 20vh;
  min-height: 50px;
  max-height: 200px;
  width: auto;
`;

const UserName = styled.div`
  flex-grow: 0;
  flex-basis: auto;
  flex-shrink: 1;

  overflow: hidden;

  margin-bottom: 6vh;

  font-size: 2em;
  font-family: Limelight;

  color: #fff;
`;

const MenuPopover = ({ hideMenu }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const name = useSelector(selectName);
  const gameId = useSelector(selectGameId);
  const avatarUrl = useSelector(selectMyAvatarUrl);

  const showScores = () => dispatch(showOverlay(CONSTANTS.OVERLAYS.SCORES));

  const showRules = () => dispatch(showOverlay(CONSTANTS.OVERLAYS.RULES));

  const quitGame = async () => {
    await firebase.functions().httpsCallable('leaveGame')({
      gameId,
    });
    history.push('/');
    dispatch(userHasLeftGame());
    hideMenu();
    // todo unsubscribe from game subscriptions, clear store, do db changes (cloud function?)
  };

  return (
    <Overlay closeButton hide={hideMenu}>
      {avatarUrl && <ProfileImage src={avatarUrl} />}
      {name && <UserName>{name}</UserName>}
      <HeaderButton onClick={showScores} Icon={TrophyIcon} large>
        Scores
      </HeaderButton>
      <HeaderButton onClick={showRules} Icon={ScrollIcon} large>
        Rules
      </HeaderButton>
      <SoundOnOffButton large />
      <HeaderButton onClick={quitGame} Icon={QuitIcon} large>
        Quit Game
      </HeaderButton>
    </Overlay>
  );
};

export default MenuPopover;
