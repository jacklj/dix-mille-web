import React from 'react';
import styled, { css, keyframes } from 'styled-components';

import diceCup from './diceCup.svg';
import diceCupTop from './diceCup-top.svg';

const shake = keyframes`
  0% { 
    transform: rotate(0deg); 
  } 
  
  20% { 
    transform: rotate(20deg); 
  } 

  40% { 
    transform: rotate(-20deg); 
  } 

  80% { 
    transform: rotate(20deg); 
  } 
  
  100% { 
    transform: rotate(0deg); 
  } 
`;

const Container = styled.div`
  position: absolute;
  right: 10px;
  bottom: 0; // becase of rotation, it looks like there's bottom margin anyway
  height: var(--dice-cup-height);
  width: var(--dice-cup-width);

  ${(props) =>
    props.isShaking &&
    css`
      animation: ${shake} 1s linear infinite;
    `}

  user-drag: none;
  webkit-touch-callout: none;
  -webkit-user-select: none;
`;

const Img = styled.img`
  height: var(--dice-cup-height);

  position: absolute;
  top: 0;
  left: 0;

  // N.B. 'filter' and 'transform' css attributes must be used on each image here, rather than on the container,
  // as they both create a new stacking context -> this means that we can't use z-indexes to position
  // the dice between the top and bottom images.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
  ${({ disabled }) => disabled && `filter: grayscale(90%);`};
  transform: rotate(-30deg);

  user-drag: none;
  webkit-touch-callout: none;
  -webkit-user-select: none;
  pointer-events: none;
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
      isShaking={isShaking}>
      <BottomImg src={diceCup} isShaking={isShaking} disabled={disabled} />
      <TopImg src={diceCupTop} isShaking={isShaking} disabled={disabled} />
    </Container>
  );
};

export default DiceCup;
