import React, { useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
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

  // margin-bottom: 30px;

  font-family: Limelight;
  font-size: 80px;
  color: #ff6961;
  letter-spacing: 1px;

  animation: ${bulge} 1s ease-in-out 1;

  span {
    position: relative;
    top: 10px;
    display: inline-block;

    animation: ${bounce} 0.3s ease infinite alternate;
    animation-delay: 1s;

    text-shadow: 0 1px 0 #4d0400, 0 2px 0 #4d0400, 0 3px 0 #4d0400,
      0 4px 0 #4d0400, 0 5px 0 #4d0400, 0 6px 0 transparent, 0 7px 0 transparent,
      0 8px 0 transparent, 0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.7);
  }

  span:nth-child(2) {
    animation-delay: 1.1s;
  }

  span:nth-child(3) {
    animation-delay: 1.2s;
  }

  span:nth-child(4) {
    animation-delay: 1.3s;
  }

  span:nth-child(5) {
    animation-delay: 1.4s;
  }
`;

const useSoundOptions = {
  sprite: spriteMap,
};

const BlappedMessage = () => {
  const isSoundOn = useSelector(selectIsSoundOn);
  const [playBlapSound] = useSound(blapSprites, useSoundOptions);

  // use `useCallback` so we have the latest value of `isSoundOn` without it being in the useEffect
  // dependency list, as in that case, every time the user switches the sound on, this component would
  // play a sound effect.
  const onMount = useCallback(() => {
    // on mount, play it
    if (!isSoundOn) {
      return;
    }

    // dont just play it when sound is turned on!
    const blapNames = Object.keys(spriteMap);
    const randomIndex = Math.floor(Math.random() * blapNames.length);
    const randomSpriteName = blapNames[randomIndex];

    console.log(`play '${randomSpriteName}'`);

    playBlapSound({ id: randomSpriteName });
  }, [isSoundOn, playBlapSound]);

  useEffect(onMount, [playBlapSound]); // N.B. must have playBlapSound in the dep list, or doesn't work

  return (
    <>
      <BlapText>
        <span>B</span>
        <span>L</span>
        <span>A</span>
        <span>P</span>
        <span>!</span>
      </BlapText>
    </>
  );
};

export default BlappedMessage;
