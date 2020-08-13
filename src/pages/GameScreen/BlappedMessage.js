import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import useSound from 'use-sound';

import blapSprites from './blapSprites.mp3';

const bulge = keyframes`
0% {
  transform: scale(0);
}
50% {
  transform: scale(1.3);
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

const spriteMap = {
  annaBlap: [73, 1226],
  edBlaaaaap: [1318, 1116],
  edHighBlap: [2498, 918],
  emmaBlap: [3449, 914],
  lewisBlap: [4385, 1332],
  madsBlap1: [5786, 1267],
  madsBlap2: [7164, 1428],
  madsCanYouMakeANoiseLikeThisHoho: [8725, 3770],
  williamCrazyBlap1: [12514, 2925],
  williamCrazyBlap2: [15485, 955],
};

const useSoundOptions = {
  sprite: spriteMap,
};

const BlappedMessage = () => {
  // const [playBlapSound] = useSound(blapSprites, useSoundOptions);

  // useEffect(() => {
  //   // on mount, play it

  //   const blapNames = Object.keys(spriteMap);
  //   const randomIndex = Math.floor(Math.random() * blapNames.length);
  //   const randomSpriteName = blapNames[randomIndex];

  //   console.log(`play ${randomSpriteName}!`);

  //   playBlapSound(randomSpriteName);
  // }, [playBlapSound]);

  return (
    <BlapText>
      <span>B</span>
      <span>L</span>
      <span>A</span>
      <span>P</span>
      <span>!</span>
    </BlapText>
  );
};

export default BlappedMessage;
