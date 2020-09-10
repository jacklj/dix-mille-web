import React, { useRef, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import Face from './Face';

const spin = keyframes`
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  16% { transform: rotateX(180deg) rotateY(180deg) rotateZ(0deg); }
  33% { transform: rotateX(360deg) rotateY(90deg) rotateZ(180deg); }
  50% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
  66% { transform: rotateX(180deg) rotateY(360deg) rotateZ(270deg); }
  83% { transform: rotateX(270deg) rotateY(180deg) rotateZ(180deg); }
  100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
`;

const Dice = styled.div`
  // N.B. CSS variables are passed to children
  --size: ${(props) => (props.isInBankedSection ? '50px' : '60px')};

  @media (max-width: 768px), (orientation: landscape) {
    --size: ${(props) => (props.isInBankedSection ? '30px' : '45px')};
  }

  width: calc(var(--size) * 1);
  height: calc(var(--size) * 1);
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  margin: ${(props) =>
    props.isInBankedSection ? '2px' : 'calc(var(--size) * 0.7)'};
  margin-bottom: ${(props) =>
    props.isInBankedSection ? '5px' : 'calc(var(--size) * 0.6)'};

  &:nth-child(even) {
    top: ${(props) =>
      props.isInBankedSection ? '0' : 'calc(var(--size) * 0.5)'};
  }

  position: relative;

  transform-style: preserve-3d; // N.B. affects children not the element itself
  transition: transform 1s ease-out;

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
        animation: ${spin} 1.3s infinite linear;
      `};

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: -0.1s;
  }
  &:nth-child(3) {
    animation-delay: -0.2s;
  }
  &:nth-child(4) {
    animation-delay: -0.3s;
  }
  &:nth-child(5) {
    animation-delay: -0.4s;
  }
  &:nth-child(6) {
    animation-delay: -0.5s;
  }
`;

const faces = [1, 2, 3, 4, 5, 6];

const Dice3d = ({
  id,
  value,
  rolling,
  onClick,
  isInBankedSection,
  className,
  banked,
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
      }, 0);
    }
    previousRolling.current = rolling;
  }, [rolling, value]);

  return (
    <Dice
      key={id}
      isInBankedSection={isInBankedSection}
      className={className}
      value={actualValue}
      rolling={rolling}
      even={even}
      onClick={onClick}>
      {faces.map((f) => (
        <Face key={f} value={f} banked={banked} faceShown={actualValue} />
      ))}
    </Dice>
  );
};

export default Dice3d;
