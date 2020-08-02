import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectMyAvatarUrl } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';
import diceIcon from './diceIcon.png';

const Container = styled.header`
  height: 10vh;
  background-color: rgba(10, 10, 10, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 10px;
`;

const Title = styled.div`
  display: flex;
  margin-left: 10px;
`;

const TitleText = styled.div`
  font-size: 2em;
  font-family: Limelight;
  text-shadow: 2px 4px 4px #000000;
  color: white;
  text-align: left;

  // so it looks good when "Dix Mille" title text goes onto two lines
  line-height: 1em;
`;

const Yellow = styled.span`
  color: #ffbf00;
`;

const DiceIcon = styled.img`
  height: 2em;
  width: auto;
  margin-right: 6px;

  // so it looks good when "Dix Mille" title text goes onto two lines
  margin-top: -4px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled.img`
  height: 50px;
  width: auto;
  margin: 7px;
  margin-left: 3px; // for small phones, give as much room as possible for the "Dix Mille" title text
`;

const Header = () => {
  const name = useSelector(selectName);
  const avatarUrl = useSelector(selectMyAvatarUrl);

  return (
    <Container>
      <Title>
        <DiceIcon src={diceIcon} />
        <TitleText>
          <Yellow>D</Yellow>ix <Yellow>M</Yellow>ille
        </TitleText>
      </Title>
      <ProfileContainer>
        {avatarUrl && <ProfileImage src={avatarUrl} />}

        {name && <div>{name}</div>}
      </ProfileContainer>
    </Container>
  );
};

export default Header;
