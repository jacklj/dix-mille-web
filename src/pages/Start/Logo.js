import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import useSound from 'use-sound';
import { useSelector } from 'react-redux';

import { selectIsSoundOn } from 'redux/settings/selectors';
import blapSprites from 'media/sounds/blapSprites.mp3';
import spriteMap from 'media/sounds/spriteMap';

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

  cursor: pointer;

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
  const isSoundOn = useSelector(selectIsSoundOn);

  const [playBlapSound, { stop, isPlaying }] = useSound(blapSprites, {
    sprite: spriteMap,
    interrupt: false, // if a sound is already playing, overlap it (rather than stopping it when starting a new one)
    soundEnabled: isSoundOn, // not reactive...
    // loop: true, // can't `stop()` looped sounds after the first loop...
  });

  useEffect(() => {
    // N.B. if multiple sounds are playing concurrently, not all of them will be stopped by calling `stop()`...
    console.log('effect', { isPlaying, isSoundOn });
    if (isPlaying && !isSoundOn) {
      stop();
    }
  }, [isPlaying, isSoundOn, stop]);

  const onClick = () => {
    setPlayingAnimation(true);

    const blapNames = Object.keys(spriteMap);
    const randomIndex = Math.floor(Math.random() * blapNames.length);
    const randomSpriteName = blapNames[randomIndex];

    console.log(`play '${randomSpriteName}'`);
    playBlapSound({ id: randomSpriteName });
  };

  return (
    <Container
      playingAnimation={playingAnimation}
      onClick={onClick}
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
