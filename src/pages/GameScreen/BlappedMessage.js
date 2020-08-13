import React from 'react';
import styled, { keyframes } from 'styled-components';

const bulge = keyframes`
0% {
  transform: scale(0);
}
50% {
  transform: scale(1.5);
}
100% {
  transform: scale(1);
}
`;

const bounce = keyframes`
  0% {
    top: 0;
  }

  10% {
    top: -20px;
  }

  20% {
    top: 0;
  }

  // delay

  100% {
    top: 0;
  }
`;

const BlapText = styled.div`
  flex: none;

  font-family: Limelight;
  font-size: 80px;
  color: #ff6961;
  letter-spacing: 1px;

  animation: ${bulge} 2s ease-in-out 1;

  span {
    position: relative;
    // top: 20px;
    display: inline-block;

    animation: ${bounce} 4s ease infinite;
    animation-delay: 2s;

    text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
      0 5px 0 #ccc, 0 6px 0 transparent, 0 7px 0 transparent,
      0 8px 0 transparent, 0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.4);
  }

  span:nth-child(2) {
    animation-delay: 2.2s;
  }

  span:nth-child(3) {
    animation-delay: 2.4s;
  }

  span:nth-child(4) {
    animation-delay: 2.6s;
  }

  span:nth-child(5) {
    animation-delay: 2.8s;
  }
`;

const BlappedMessage = () => (
  <BlapText>
    <span>B</span>
    <span>L</span>
    <span>A</span>
    <span>P</span>
    <span>!</span>
  </BlapText>
);

export default BlappedMessage;
