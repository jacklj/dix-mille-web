import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

import { selectUser, selectAvatarUrl } from 'redux/game/selectors';

const Container = styled.div`
  color: white;
  margin: 15px;
`;

const Name = styled.div`
  // color: white;
  font-size: 2em;
`;

const JoinedAt = styled.div`
  // color: white;
  font-size: 0.8em;
`;

const ProfileImage = styled.img`
  height: 50px;
  width: auto;
  margin: 7px;
`;

const Player = ({ uid }) => {
  const playerObj = useSelector(selectUser(uid));
  const { name, joinedAt, avatarId } = playerObj;

  const avatarUrl = useSelector(selectAvatarUrl(avatarId));

  const prettyJoinedAt = joinedAt && moment(joinedAt).format('hh:mm:ss');

  return (
    <Container>
      {avatarUrl && <ProfileImage src={avatarUrl} />}
      <Name>{name}</Name>
      <JoinedAt>joined: {prettyJoinedAt}</JoinedAt>
    </Container>
  );
};

export default Player;
