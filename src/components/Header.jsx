import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectMyAvatarUrl } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';

const Container = styled.header`
  min-height: 20vh;
  background-color: #565a61;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 10px;
`;

const Title = styled.div`
  font-size: 2em;
  font-style: italic;
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
      <Title>dix mille</Title>
      <ProfileContainer>
        {avatarUrl && <ProfileImage src={avatarUrl} />}

        {name && <div>{name}</div>}
      </ProfileContainer>
    </Container>
  );
};

export default Header;
