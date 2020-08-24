import React, { useRef, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import Face from './Face';

const Container = styled.div`
  // N.B. CSS variables are passed to children
  --size: ${(props) => (props.isInGroup ? '50px' : '60px')};

  @media (max-width: 768px), (orientation: landscape) {
    --size: ${(props) => (props.isInGroup ? '30px' : '45px')};
  }

  width: calc(var(--size) * 1);
  height: calc(var(--size) * 1);
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  // NB perspective and perspective-origin affects the child components, no the component itself

  // perspective: 100px;
  // perspective-origin: left;

  border-radius: 50%;

  padding: ${(props) => (props.isInGroup ? '0' : 'calc(var(--size) * 0.5)')};
  margin: ${(props) => (props.isInGroup ? '2px' : 'calc(var(--size) * 0.2)')};
  margin-bottom: ${(props) =>
    props.isInGroup ? '5px' : 'calc(var(--size) * 0.4)'};

  &:nth-child(even) {
    position: relative;
    top: ${(props) => (props.isInGroup ? '0' : 'calc(var(--size) * 0.4)')};
  }
`;

const spin = keyframes`
  0% { transform: translateZ(-100px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  16% { transform: translateZ(-100px) rotateX(180deg) rotateY(180deg) rotateZ(0deg); }
  33% { transform: translateZ(-100px) rotateX(360deg) rotateY(90deg) rotateZ(180deg); }
  50% { transform: translateZ(-100px) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
  66% { transform: translateZ(-100px) rotateX(180deg) rotateY(360deg) rotateZ(270deg); }
  83% { transform: translateZ(-100px) rotateX(270deg) rotateY(180deg) rotateZ(180deg); }
  100% { transform: translateZ(-100px) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
`;

const DiceContainer = styled.div`
  position: relative;
  // top: -10px;
  transform-style: preserve-3d; // N.B. affects children not the element itself
  transition: transform 1.8s ease-out;

  transform-origin: calc(var(--size) / 2) calc(var(--size) / 2);

  transform: ${(props) => {
    if (props.even) {
      switch (props.value) {
        case 1:
          return `rotateX(360deg) rotateY(720deg) rotateZ(360deg);`;
        case 2:
          return `rotateX(450deg) rotateY(720deg) rotateZ(360deg);`;
        case 3:
          return `rotateX(360deg) rotateY(630deg) rotateZ(360deg);`;
        case 4:
          return `rotateX(360deg) rotateY(810deg) rotateZ(360deg);`;
        case 5:
          return `rotateX(270deg) rotateY(720deg) rotateZ(360deg);`;
        case 6:
          return `rotateX(360deg) rotateY(900deg) rotateZ(360deg);`;
        default:
          return 'none;';
      }
    } else {
      switch (props.value) {
        case 1:
          return `rotateX(-360deg) rotateY(-720deg) rotateZ(-360deg);`;
        case 2:
          return `rotateX(-270deg) rotateY(-720deg) rotateZ(-360deg);`;
        case 3:
          return `rotateX(-360deg) rotateY(-810deg) rotateZ(-360deg);`;
        case 4:
          return `rotateX(-360deg) rotateY(-630deg) rotateZ(-360deg);`;
        case 5:
          return `rotateX(-450deg) rotateY(-720deg) rotateZ(-360deg);`;
        case 6:
          return `rotateX(-360deg) rotateY(-900deg) rotateZ(-360deg);`;
        default:
          return 'none;';
      }
    }
  }}
    ${(props) =>
      props.rolling &&
      css`
        animation: ${spin} 1s infinite linear;
      `};
`;

const faces = [1, 2, 3, 4, 5, 6];

const Dice = ({
  id,
  value,
  rolling,
  selected,
  onClick,
  isInGroup,
  className,
}) => {
  const previousRolling = useRef(rolling);
  const [even, setEven] = useState(true);
  const [actualValue, setActualValue] = useState(value);

  useEffect(() => {
    // rolling -> not rolling
    if (previousRolling.current && !rolling) {
      setTimeout(() => {
        setActualValue(value);
        setEven((x) => !x);
      }, 20);
    }
    previousRolling.current = rolling;
  }, [rolling, value]);

  return (
    <Container
      key={id}
      onClick={onClick}
      isInGroup={isInGroup}
      className={className}>
      <DiceContainer value={actualValue} rolling={rolling} even={even}>
        {faces.map((f) => (
          <Face key={f} value={f} selected={selected} />
        ))}
      </DiceContainer>
    </Container>
  );
};

export default Dice;
