import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { selectPlayer, selectAvatarUrl } from 'redux/game/selectors';

const Container = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 150px;
`;

const ProfileImage = styled.img`
  height: 160px;
  width: auto;
  max-width: 150px;
  margin-bottom: 7px;
`;

const Name = styled.div`
  color: white;
  font-size: 1em;
`;

const Player = ({ uid }) => {
  const playerObj = useSelector(selectPlayer(uid));
  const { name, avatarId } = playerObj;

  const avatarUrl = useSelector(selectAvatarUrl(avatarId));

  return (
    <Container>
      {avatarUrl && <ProfileImage src={avatarUrl} title="User's avatar" />}
      <Name>{name}</Name>
    </Container>
  );
};

export default Player;
