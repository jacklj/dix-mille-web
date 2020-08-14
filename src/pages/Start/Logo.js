import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

const bulge = keyframes`
0% {
  transform: scale(0);
}
80% {
  transform: scale(1.1);
}
100% {
  transform: scale(1);
}
`;

const bounceWhite = keyframes`
100% {
  top: -10px;

  text-shadow: 0 1px 0 #bbb, 0 2px 0 #bbb, 0 3px 0 #bbb, 0 4px 0 #bbb,
    0 5px 0 #bbb, 0 6px 0 #bbb, 0 7px 0 #bbb, 0 8px 0 #bbb, 0 9px 0 #bbb,
    0 50px 25px rgba(0, 0, 0, 0.5);
}
`;

const bounceYellow = keyframes`
100% {
  top: -10px;

  text-shadow: 0 1px 0 #b38600, 0 2px 0 #b38600, 0 3px 0 #b38600, 0 4px 0 #b38600,
    0 5px 0 #b38600, 0 6px 0 #b38600, 0 7px 0 #b38600, 0 8px 0 #b38600, 0 9px 0 #b38600,
    0 50px 25px rgba(0, 0, 0, 0.5);
}
`;

const Container = styled.div`
  margin-top: 30px;

  font-size: 80px;
  font-family: Limelight;
  color: white;

  text-shadow: 0 1px 0 #bbb, 0 2px 0 #bbb, 0 3px 0 #bbb, 0 4px 0 #bbb,
    0 5px 0 #bbb, 0 6px 0 transparent, 0 7px 0 transparent, 0 8px 0 transparent,
    0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.7);

  @media (max-width: 480px) {
    font-size: 55px;
  }

  animation: ${bulge} 1s ease-in-out 1;

  span {
    position: relative;
    top: 10px;
  }

  ${(props) =>
    props.playingAnimation &&
    css`
      & span {
        animation: ${bounceWhite} 0.3s ease 2 alternate;
      }
    `}
`;

const Yellow = styled.span`
  color: #ffbf00;

  text-shadow: 0 1px 0 #b38600, 0 2px 0 #b38600, 0 3px 0 #b38600,
    0 4px 0 #b38600, 0 5px 0 #b38600, 0 6px 0 transparent, 0 7px 0 transparent,
    0 8px 0 transparent, 0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.7);

  ${Container} & {
    ${(props) =>
      props.playingAnimation &&
      css`
        animation: ${bounceYellow} 0.3s ease 2 alternate;
      `}
  }
`;

const Logo = () => {
  const [playingAnimation, setPlayingAnimation] = useState(false);

  return (
    <Container
      playingAnimation={playingAnimation}
      onClick={() => setPlayingAnimation(true)}
      onAnimationEnd={() => setPlayingAnimation(false)}>
      <Yellow playingAnimation={playingAnimation}>D</Yellow>
      <span>i</span>
      <span>x</span> <Yellow playingAnimation={playingAnimation}>M</Yellow>
      <span>i</span>
      <span>l</span>
      <span>l</span>
      <span playingAnimation={playingAnimation}>e</span>
    </Container>
  );
};

export default Logo;
