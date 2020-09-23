import React, { useRef, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import Face from './Face';

const Container = styled.div`
  width: calc(var(--rolled-dice-size) * 1);
  height: calc(var(--rolled-dice-size) * 1);

  position: absolute;

  // original position is inside the DiceCup
  top: calc(
    100vh - 60px - var(--rolled-dice-size) / 4 - var(--dice-cup-height) / 2
  );
  left: calc(
    100vw - var(--rolled-dice-size) / 4 - var(--dice-cup-width) / 2 - 10px
  );

  transform: scale3d(0.5, 0.5, 0.5);

  transition: none; // only animate when going from rolling -> not rolling, don't want to animate
  // not rolling -> rolling

  // invisible when inside the DiceCup
  opacity: 0;

  ${(props) =>
    !props.rolling &&
    css`
      transition: top 1s ease-out, left 1s ease-out, transform 1s ease-out; // dice casting position animation

      @media (orientation: portrait) {
        top: calc(
          (((${(props) => props.positionY} / 100) * 0.76) + 0.12) *
            var(--rolled-dice-area-height) - (var(--rolled-dice-size) * 0.5)
        );
        left: calc(
          ${(props) => props.positionX}vw * 0.76 + 12vw -
            (var(--rolled-dice-size) * 0.5)
        );
      }

      @media (orientation: landscape) {
        top: calc(
          (((${(props) => props.positionY} / 100) * 0.76) + 0.12) *
            var(--rolled-dice-area-height) - (var(--rolled-dice-size) * 0.5)
        );
        left: calc(
          var(--scoring-groups-area-width) +
            (
              ((${(props) => props.positionX} * 0.76 + 12) / 100) *
                var(--rolled-dice-area-width)
            ) - (var(--rolled-dice-size) * 0.5)
        );
      }

      // also put the (non-animated) overall rotation in here, so that when the dice is rolling,
      // the rotation is 0, and so the bunch of dice "inside" the dicecup take up less space and
      // are less likely to poke out from underneath it
      transform: rotate(${(props) => props.rotation}deg) scale3d(1, 1, 1);

      opacity: 1;
    `}
`;

const Dice = styled.div`
  width: calc(var(--rolled-dice-size) * 1);
  height: calc(var(--rolled-dice-size) * 1);

  transform-style: preserve-3d; // N.B. affects children not the element itself

  transition: transform 1s ease-out; // dice casting 3D rotation animation

  transform-origin: calc(var(--rolled-dice-size) / 2)
    calc(var(--rolled-dice-size) / 2);

  transform: ${(props) => {
    // rotate (with animation) the 3D dice so that the correct side is face up.
    // N.B. `even` is a binary flag that flips on each dice roll (this is why we aren't using
    // the `rolling` variable, instead we use `even` as a stateful proxy), ensuring that
    // even if two consecutive rolls give the same value on a dice, it still
    // rotates (in 3D)
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
  }};
`;

const DebugText = styled.div`
  position: absolute;
  top: 20px;
  left: 10px;
  color: red;
  transform: rotate(-${(props) => props.rotation}deg);
  background-color: rgba(0, 0, 0, 0.3);
  width: 5em;
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
  rotation,
  positionX,
  positionY,
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
    <Container
      rotation={rotation}
      positionX={positionX}
      positionY={positionY}
      rolling={rolling}>
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
      {/* <DebugText rotation={rotation}>{`${positionX}, ${positionY}`}</DebugText> */}
    </Container>
  );
};

export default Dice3d;
