import React from 'react';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';

import { selectMyAvatarUrl, selectHasGameStarted } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';
import { showOverlay, hideOverlay } from 'redux/ui/slice';
import CONSTANTS from 'services/constants';

import HeaderButton from './HeaderButton';
import TrophyIcon from './TrophyIcon';
import ScrollIcon from './ScrollIcon';
import QuitIcon from './QuitIcon';
import SoundOnOffButton from './SoundOnOffButton';

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

  const name = useSelector(selectName);
  const avatarUrl = useSelector(selectMyAvatarUrl);
  const hasGameStarted = useSelector(selectHasGameStarted);

  const showScores = () => dispatch(showOverlay(CONSTANTS.OVERLAYS.SCORES));

  const showRules = () => dispatch(showOverlay(CONSTANTS.OVERLAYS.RULES));

  const quitGame = () => alert('quitting game');

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
        Leave Game
      </HeaderButton>
    </Overlay>
  );
};

export default MenuPopover;
