import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 200px;
  position: relative;
  display: inline-block;
`;

const Avatar = styled.img`
  height: 200px;
  width: auto;
`;

const AlreadyChosenOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const AvatarSlide = ({ url, alreadyChosen }) => {
  return (
    <Container>
      <Avatar src={url} />
      {alreadyChosen && <AlreadyChosenOverlay>x</AlreadyChosenOverlay>}
    </Container>
  );
};

export default AvatarSlide;
