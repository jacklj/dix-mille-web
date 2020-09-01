import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import diceCup from './diceCup.svg';

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

  ${(props) =>
    props.isShaking &&
    css`
      animation: ${shake} 1s linear infinite;
    `}
`;

// TODO make a separate svg for the 'inside' of the cup, so the dice can come from in between them!!!

const DiceCup = () => {
  // shaking animation, then quicker release shake animation.
  // then dice fly out!
  const [isShaking, setIsShaking] = useState(false);
  // do we need js, or can we do with css only?

  return (
    <Img
      src={diceCup}
      isShaking={isShaking}
      onClick={() => setIsShaking((x) => !x)}
    />
  );
};

export default DiceCup;
