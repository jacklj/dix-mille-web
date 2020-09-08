import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import diceCup from './diceCup.svg';
import diceCupTop from './diceCup-top.svg';

const Container = styled.div`
  position: relative;
  height: 160px;
  width: 116px;
`;

const shake = keyframes`
  0% { 
    transform: rotate(-40deg); 
  } 
  
  20% { 
    transform: rotate(-20deg); 
  } 

  40% { 
    transform: rotate(-60deg); 
  } 

  80% { 
    transform: rotate(-20deg); 
  } 
  
  100% { 
    transform: rotate(-40deg); 
  } 
`;

const Img = styled.img`
  transform: rotate(-40deg);
  height: 160px;

  position: absolute;
  top: 0;
  left: 0;

  ${(props) =>
    props.isShaking &&
    css`
      animation: ${shake} 1s linear infinite;
    `}
`;

const BottomImg = styled(Img)`
  z-index: 0;
  user-drag: none;
`;

const TopImg = styled(Img)`
  z-index: 2;
  user-drag: none;
`;

const DiceCup = () => {
  // shaking animation, then quicker release shake animation.
  // then dice fly out!
  const [isShaking, setIsShaking] = useState(false);
  // do we need js, or can we do with css only?

  return (
    <Container>
      <BottomImg
        src={diceCup}
        isShaking={isShaking}
        onClick={() => setIsShaking((x) => !x)}
      />
      <TopImg
        src={diceCupTop}
        isShaking={isShaking}
        onClick={() => setIsShaking((x) => !x)}
      />
    </Container>
  );
};

export default DiceCup;
