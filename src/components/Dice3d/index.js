import React, { useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import Face from './Face';

const getDice3dRotationCss = ({ even, value }) => {
  // rotate (with animation) the 3D dice so that the correct side is face up.
  // N.B. `even` is a binary flag that flips on each dice roll (this is why we aren't using
  // the `rolling` variable, instead we use `even` as a stateful proxy), ensuring that
  // even if two consecutive rolls give the same value on a dice, it still
  // rotates (in 3D)
  let rotationCss;
  if (even) {
    switch (value) {
      case 1:
        rotationCss = `rotateX(360deg) rotateY(720deg) rotateZ(360deg)`;
        break;
      case 2:
        rotationCss = `rotateX(450deg) rotateY(720deg) rotateZ(360deg)`;
        break;
      case 3:
        rotationCss = `rotateX(360deg) rotateY(630deg) rotateZ(360deg)`;
        break;
      case 4:
        rotationCss = `rotateX(360deg) rotateY(810deg) rotateZ(360deg)`;
        break;
      case 5:
        rotationCss = `rotateX(270deg) rotateY(720deg) rotateZ(360deg)`;
        break;
      case 6:
        rotationCss = `rotateX(360deg) rotateY(900deg) rotateZ(360deg)`;
        break;
      default:
        rotationCss = '';
    }
  } else {
    switch (value) {
      case 1:
        rotationCss = `rotateX(-360deg) rotateY(-720deg) rotateZ(-360deg)`;
        break;
      case 2:
        rotationCss = `rotateX(-270deg) rotateY(-720deg) rotateZ(-360deg)`;
        break;
      case 3:
        rotationCss = `rotateX(-360deg) rotateY(-810deg) rotateZ(-360deg)`;
        break;
      case 4:
        rotationCss = `rotateX(-360deg) rotateY(-630deg) rotateZ(-360deg)`;
        break;
      case 5:
        rotationCss = `rotateX(-450deg) rotateY(-720deg) rotateZ(-360deg)`;
        break;
      case 6:
        rotationCss = `rotateX(-360deg) rotateY(-900deg) rotateZ(-360deg)`;
        break;
      default:
        rotationCss = '';
    }
  }
  return rotationCss;
};

const Container = styled.div`
  z-index: 1;

  width: var(--rolled-dice-size);
  height: var(--rolled-dice-size);

  position: absolute;

  // original position is inside the DiceCup, 2/3rds of the way up (we want the dice to appear
  // to come from its opening)
  --dice-position-inside-cup-x: calc(
    var(--game-container-width) - var(--rolled-dice-size) / 4 -
      var(--dice-cup-width) * 0.66 - 10px
  );
  --dice-position-inside-cup-y: calc(
    var(--game-container-height) - var(--rolled-dice-size) / 4 -
      var(--dice-cup-height) * 0.77
  );

  // use transform, rather than changing top and left, for positioning the dice - it makes the
  // animations much more performant (otherwise it's really janky on mobile)
  top: 0;
  left: 0;

  transform: translate(
      var(--dice-position-inside-cup-x),
      var(--dice-position-inside-cup-y)
    )
    scale3d(0.5, 0.5, 0.5);

  transition: none; // only animate when going from rolling -> not rolling, don't want to animate
  // not rolling -> rolling

  // invisible when inside the DiceCup
  opacity: 0;

  // when inside DiceCup, shouldn't accept any pointer events - they should go straight through to the
  // dice cup. This prevents dice being banked while rolling, and also prevents the diceCup shaking from
  // stopping on force touch events. Also, if the dicecup gets jammed on shaking, the user can click
  // on the dice cup to reliably stop it shaking.
  pointer-events: none;

  ${(props) =>
    !props.rolling &&
    css`
      // dice y position is calculated the same way, whether portait or landscape orientation.
      --dice-final-position-y: calc(
        // give little bit of margin to account for dice rotation. Ideally would calculate the
        // length of the dice's diagonal with pythagoras, but can't do square root in css maths.
        var(--rolled-dice-size) * 0.5 + (${(props) => props.positionY} / 100) *
          (var(--rolled-dice-area-height) - var(--rolled-dice-size) * 2)
          // Why rolled-dice-size * 2? Account for initial offset (*0.5), then also ensure
        // that the dice don't overflow bottom of container, even when rotated - approximation
        // of dice-size + diagonal/2 = dice-size*1.5
      );

      // dice x position needs to be calculated differently in portrait or landscape orientation,
      // as in landscape we need to offset it by the --scoring-groups-area-width.
      --dice-x-position-within-rolling-area: calc(
        // We need some margin to account for the maximum possible dice rotation (ie half the diagonal length) .
        // sqrt(0.5^2 + 0.5^2) = 0.707. So it's rolled-dice-size * 0.71.
        var(--rolled-dice-size) * 0.71 + (${(props) => props.positionX} / 100) *
          (var(--rolled-dice-area-width) - var(--rolled-dice-size) * 2.42)
          // 2.42 = dice width (1) + 2 * half diagonal (2 * 0.71 = 1.42)
      );

      @media (orientation: portrait) {
        --dice-final-position-x: var(--dice-x-position-within-rolling-area);
      }

      @media (orientation: landscape) {
        --dice-final-position-x: calc(
          var(--scoring-groups-area-width) +
            var(--dice-x-position-within-rolling-area)
        );
      }

      --dice-transform-x: var(--dice-final-position-x);

      --dice-transform-y: var(--dice-final-position-y);

      // also put the (non-animated) overall rotation in here, so that when the dice is rolling,
      // the rotation is 0, and so the bunch of dice "inside" the dicecup take up less space and
      // are less likely to poke out from underneath it
      // N.B. transforms are performed in right-to-left order.
      transform: translate(var(--dice-transform-x), var(--dice-transform-y))
        scale3d(1, 1, 1) rotate(${(props) => props.rotation}deg);

      transition: transform 1s ease-out; // dice casting position animation

      // make visible again
      opacity: 1;

      // re-enable pointer events
      pointer-events: auto;
    `}
`;

const Dice = styled.div`
  width: var(--rolled-dice-size);
  height: var(--rolled-dice-size);

  transform-style: preserve-3d; // N.B. affects children not the element itself

  transition: transform 1s ease-out; // dice casting 3D rotation animation

  transform-origin: calc(var(--rolled-dice-size) / 2)
    calc(var(--rolled-dice-size) / 2);

  transform: ${(props) => getDice3dRotationCss(props)};

  -webkit-tap-highlight-color: transparent; // remove grey box that appears onTap on iOS
`;

// const DebugText = styled.div`
//   position: absolute;
//   top: 20px;
//   left: 10px;
//   color: red;
//   transform: rotate(-${(props) => props.rotation}deg);
//   background-color: rgba(0, 0, 0, 0.3);
//   width: 5em;
// `;

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
