import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #222;
  color: white;
  font-size: 3em;
`;

const LoadingMessage = styled.div``;

const LoadingScreen = () => (
  <Container>
    <LoadingMessage>Loading...</LoadingMessage>
  </Container>
);

export default LoadingScreen;
