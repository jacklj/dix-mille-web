import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: -1; // to ensure it doesn't go over the DiceCup, which would prevent the game from continuing :]
`;

const Text = styled.div`
  font-family: Limelight;
  font-size: 1.3em;
  color: #fff;
  margin-bottom: 10px;

  // in portrait, the "stick" button is 60% down the page, so to make sure they're not too close
  // together, move this text upwards
  @media (orientation: portrait) {
    margin-top: -100px;
  }
`;

const YouHaveToRollAgainMessage = () => (
  <Container>
    <Text>You have to roll again!</Text>
  </Container>
);

export default YouHaveToRollAgainMessage;
