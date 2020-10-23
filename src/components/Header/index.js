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
import MenuIcon from './MenuIcon';
import SoundOnOffButton from './SoundOnOffButton';
import MenuPopover from './MenuPopover';

const Container = styled.header`
  flex: 0 1 auto; // so it doesn't look too bad on safari

  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  background-color: rgba(10, 10, 10, 0.5);
  align-items: center;
  font-size: 1.7em;
  color: white;
  padding: 10px;

  @media (max-height: 500px) {
    padding: 3px;
  }

  // so content doesn't go under the notch on notched phones
  padding-left: max(env(safe-area-inset-left), 10px);
  padding-right: max(env(safe-area-inset-right), 10px);
`;

const DiceIcon = styled.img`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  height: 1em;
  width: auto;
  margin-right: 6px;
`;

const TitleText = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  padding-right: 10px; // minimum gap between title text and buttons or avatar
  margin-right: auto; // flex alg pushes following items to the right

  font-family: Limelight;
  text-shadow: 2px 4px 4px #000000;
  color: white;
  text-align: left;

  @media (max-width: 400px) {
    font-size: 22px;
  }
`;

const Yellow = styled.span`
  color: #ffbf00;
`;

const ProfileImage = styled.img`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  height: 7vh;
  min-height: 26px;
  max-height: 50px;
  width: auto;

  @media (max-width: 470px) {
    // dont display user avatar or name when narrow viewport
    display: none;
  }
`;

const UserName = styled.div`
  flex-grow: 0;
  flex-basis: auto;
  flex-shrink: 1;

  overflow: hidden;

  margin-left: 7px; // put left padding on UserName, rather than right padding on ProfileImage, in case
  // ProfileImage isn't rendered for some reason - then there will still be a margin between UserName
  // and the "Dix Mille" title text

  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 0.6em;
  font-family: Limelight;

  @media (max-width: 470px) {
    // dont display user avatar or name when narrow viewport
    display: none;
  }
`;

const Header = () => {
  const name = useSelector(selectName);
  const avatarUrl = useSelector(selectMyAvatarUrl);
  const hasGameStarted = useSelector(selectHasGameStarted);

  const [isShowingScores, setIsShowingScores] = useState(false);
  const showScores = () => setIsShowingScores(true);
  const hideScores = () => setIsShowingScores(false);

  const [isShowingRules, setIsShowingRules] = useState(false);
  const showRules = () => setIsShowingRules(true);
  const hideRules = () => setIsShowingRules(false);

  const [isShowingMenu, setIsShowingMenu] = useState(false);
  const showMenu = () => setIsShowingMenu(true);
  const hideMenu = () => setIsShowingMenu(false);

  return (
    <>
      <Container>
        <DiceIcon src={diceIcon} />
        <TitleText>
          <Yellow>D</Yellow>ix <Yellow>M</Yellow>ille
        </TitleText>

        <SoundOnOffButton />
        {hasGameStarted ? (
          <HeaderButton onClick={showScores} Icon={TrophyIcon}>
            Scores
          </HeaderButton>
        ) : null}
        <HeaderButton onClick={showRules} Icon={ScrollIcon}>
          Rules
        </HeaderButton>
        <HeaderButton onClick={showMenu} Icon={MenuIcon}>
          Menu
        </HeaderButton>
        {avatarUrl && <ProfileImage src={avatarUrl} />}
        {name && <UserName>{name}</UserName>}
      </Container>
      {isShowingScores ? <ScoresPopover hideScores={hideScores} /> : null}
      {isShowingRules ? <RulesPopover hideRules={hideRules} /> : null}
      {isShowingMenu ? <MenuPopover hideMenu={hideMenu} /> : null}
    </>
  );
};

export default Header;
