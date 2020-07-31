import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectMyAvatarUrl } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';
import woodBackground from './woodBackground.jpg';

const Container = styled.header`
  height: 10vh;
  background-color: #565a61;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 10px;

  background-image: url("${woodBackground}");

`;

const Title = styled.div`
  font-size: 2em;
  font-family: Limelight;
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
`;

const Header = () => {
  const name = useSelector(selectName);
  const avatarUrl = useSelector(selectMyAvatarUrl);

  return (
    <Container>
      <Title>Dix Mille</Title>
      <ProfileContainer>
        {avatarUrl && <ProfileImage src={avatarUrl} />}

        {name && <div>{name}</div>}
      </ProfileContainer>
    </Container>
  );
};

export default Header;
