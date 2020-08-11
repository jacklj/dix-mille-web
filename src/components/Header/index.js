import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectMyAvatarUrl } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';
import diceIcon from './diceIcon.png';
import ScoresButton from './ScoresButton';

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

  margin-right: auto; // flex alg pushes following items to the right

  font-family: Limelight;
  text-shadow: 2px 4px 4px #000000;
  color: white;
  text-align: left;
`;

const Yellow = styled.span`
  color: #ffbf00;
`;

const ProfileImage = styled.img`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  height: 1.5em;
  width: auto;

  margin-left: 10px; // minimum gap between image and "Dix Mille" title text, on narrow viewports.
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

  font-size: 0.7em;
  font-family: Limelight;
`;

const Header = () => {
  const name = useSelector(selectName);
  const avatarUrl = useSelector(selectMyAvatarUrl);
  // const hasGameStarted

  return (
    <Container>
      <DiceIcon src={diceIcon} />
      <TitleText>
        <Yellow>D</Yellow>ix <Yellow>M</Yellow>ille
      </TitleText>

      <ScoresButton />
      {avatarUrl && <ProfileImage src={avatarUrl} />}
      {name && <UserName>{name}</UserName>}
    </Container>
  );
};

export default Header;
