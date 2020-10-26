import React from 'react';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';

import { selectHasGameStarted } from 'redux/game/selectors';
import { showOverlay } from 'redux/ui/slice';

import CONSTANTS from 'services/constants';

import diceIcon from './diceIcon.png';
import HeaderButton from './HeaderButton';

import TrophyIcon from './TrophyIcon';
import ScrollIcon from './ScrollIcon';
import MenuIcon from './MenuIcon';
import SoundOnOffButton from './SoundOnOffButton';

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

const Header = () => {
  const dispatch = useDispatch();
  const hasGameStarted = useSelector(selectHasGameStarted);

  const showScores = () => dispatch(showOverlay(CONSTANTS.OVERLAYS.SCORES));

  const showRules = () => dispatch(showOverlay(CONSTANTS.OVERLAYS.RULES));

  const showMenu = () => dispatch(showOverlay(CONSTANTS.OVERLAYS.MENU));

  return (
    <Container>
      <DiceIcon src={diceIcon} />
      <TitleText>
        <Yellow>D</Yellow>ix <Yellow>M</Yellow>ille
      </TitleText>

      {!hasGameStarted && <SoundOnOffButton />}
      {hasGameStarted ? (
        <HeaderButton onClick={showScores} Icon={TrophyIcon}>
          Scores
        </HeaderButton>
      ) : null}
      {!hasGameStarted && (
        <HeaderButton onClick={showRules} Icon={ScrollIcon}>
          Rules
        </HeaderButton>
      )}
      {hasGameStarted && (
        <HeaderButton onClick={showMenu} Icon={MenuIcon} hideTextNotIcon>
          Menu
        </HeaderButton>
      )}
      {/* {avatarUrl && <ProfileImage src={avatarUrl} />}
      {name && <UserName>{name}</UserName>} */}
    </Container>
  );
};

export default Header;
