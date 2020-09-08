import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import diceCup from './diceCup.svg';
import diceCupTop from './diceCup-top.svg';

const Container = styled.div`
  position: absolute;
  right: 50px;
  bottom: 70px;

  height: 179px;
  width: 130px;

  ${({ disabled }) =>
    disabled &&
    `
  filter: grayscale(60%);
  opacity: 0.7;`};
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
  height: 179px;

  position: absolute;
  top: 0;
  left: 0;

  user-drag: none;

  ${(props) =>
    props.isShaking &&
    css`
      animation: ${shake} 1s linear infinite;
    `}
`;

const BottomImg = styled(Img)`
  z-index: 0;
`;

const TopImg = styled(Img)`
  z-index: 2;
`;

const DiceCup = ({
  onMouseDown,
  onTouchStart,
  onMouseUp,
  onTouchEnd,
  onMouseLeave,
  disabled,
  loading,
}) => {
  // shaking animation, then quicker release shake animation.
  // then dice fly out!
  const [isShaking, setIsShaking] = useState(false);
  // do we need js, or can we do with css only?

  return (
    <Container
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      loading={loading}>
      <BottomImg
        src={diceCup}
        isShaking={loading}
        onClick={() => setIsShaking((x) => !x)}
      />
      <TopImg
        src={diceCupTop}
        isShaking={loading}
        onClick={() => setIsShaking((x) => !x)}
      />
    </Container>
  );
};

export default DiceCup;
