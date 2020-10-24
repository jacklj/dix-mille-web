import React, { useState } from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectMyAvatarUrl, selectHasGameStarted } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';
import diceIcon from './diceIcon.png';
import HeaderButton from './HeaderButton';
import ScoresPopover from './ScoresPopover';
import RulesPopover from './RulesPopover';
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
  const name = useSelector(selectName);
  const avatarUrl = useSelector(selectMyAvatarUrl);
  const hasGameStarted = useSelector(selectHasGameStarted);

  const [isShowingScores, setIsShowingScores] = useState(false);
  const showScores = () => setIsShowingScores(true);
  const hideScores = () => setIsShowingScores(false);

  const [isShowingRules, setIsShowingRules] = useState(false);
  const showRules = () => setIsShowingRules(true);
  const hideRules = () => setIsShowingRules(false);

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
