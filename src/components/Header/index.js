import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectMyAvatarUrl } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';
import diceIcon from './diceIcon.png';

const Container = styled.header`
  // flex: 1;
  flex: 0 1 auto; // so it doesn't look too bad on safari

  background-color: rgba(10, 10, 10, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 1.7em;
  color: white;
  padding: 10px;
`;

const Title = styled.div`
  flex-shrink: 0; // ensures the title text is always on one line

  flex-grow: 1; // prevents 'dix mille' text always going onto 2 lines in Safari

  display: flex;
  margin-left: 10px;
`;

const TitleText = styled.div`
  flex-shrink: 0; // prevents 'dix mille' text always going onto 2 lines in Safari

  font-family: Limelight;
  text-shadow: 2px 4px 4px #000000;
  color: white;
  text-align: left;
`;

const Yellow = styled.span`
  color: #ffbf00;
`;

const DiceIcon = styled.img`
  height: 1em;
  width: auto;
  margin-right: 6px;
`;

const ProfileContainer = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;

  overflow: hidden;
`;

const ProfileImage = styled.img`
  height: 1.5em;
  width: auto;
  margin-right: 7px;
`;

const UserName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 0.7em;
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

        {name && <UserName>{name}</UserName>}
      </ProfileContainer>
    </Container>
  );
};

export default Header;
