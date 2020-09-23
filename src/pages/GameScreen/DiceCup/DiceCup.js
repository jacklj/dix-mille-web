import React from 'react';
import styled, { css, keyframes } from 'styled-components';

import diceCup from './diceCup.svg';
import diceCupTop from './diceCup-top.svg';

const Container = styled.div`
  position: absolute;
  right: 10px;
  bottom: 0; // becase of rotation, it looks like there's bottom margin anyway
  height: var(--dice-cup-height);
  width: var(--dice-cup-width);

  ${({ disabled }) =>
    disabled &&
    `
  filter: grayscale(60%);
  opacity: 0.7;`};
`;

const shake = keyframes`
  0% { 
    transform: rotate(-30deg); 
  } 
  
  20% { 
    transform: rotate(-10deg); 
  } 

  40% { 
    transform: rotate(-50deg); 
  } 

  80% { 
    transform: rotate(-10deg); 
  } 
  
  100% { 
    transform: rotate(-30deg); 
  } 
`;

const Img = styled.img`
  transform: rotate(-30deg);
  height: var(--dice-cup-height);

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
  isShaking,
}) => {
  // shaking animation, then quicker release shake animation.
  // then dice fly out!

  return (
    <Container
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      isLoading={loading} // NB if prop name is just `loading`, get a React warning that native
      // html attributes aren't allowed to be boolean
    >
      <BottomImg src={diceCup} isShaking={loading} />
      <TopImg src={diceCupTop} isShaking={loading} />
    </Container>
  );
};

export default DiceCup;
