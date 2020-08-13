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
100% {
  top: -10px;
  text-shadow: 0 1px 0 #4d0400, 0 2px 0 #4d0400, 0 3px 0 #4d0400, 0 4px 0 #4d0400,
    0 5px 0 #4d0400, 0 6px 0 #4d0400, 0 7px 0 #4d0400, 0 8px 0 #4d0400, 0 9px 0 #4d0400,
    0 50px 25px rgba(0, 0, 0, 0.5);
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
    top: 10px;
    display: inline-block;

    animation: ${bounce} 0.3s ease infinite alternate;
    animation-delay: 2s;

    text-shadow: 0 1px 0 #4d0400, 0 2px 0 #4d0400, 0 3px 0 #4d0400,
      0 4px 0 #4d0400, 0 5px 0 #4d0400, 0 6px 0 transparent, 0 7px 0 transparent,
      0 8px 0 transparent, 0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.7);
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
