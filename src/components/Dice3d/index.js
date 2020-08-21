import React, { useRef, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import Face from './Face';

const spin = keyframes`
  0% { transform: translateZ(-100px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  16% { transform: translateZ(-100px) rotateX(180deg) rotateY(180deg) rotateZ(0deg); }
  33% { transform: translateZ(-100px) rotateX(360deg) rotateY(90deg) rotateZ(180deg); }
  50% { transform: translateZ(-100px) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
  66% { transform: translateZ(-100px) rotateX(180deg) rotateY(360deg) rotateZ(270deg); }
  83% { transform: translateZ(-100px) rotateX(270deg) rotateY(180deg) rotateZ(180deg); }
  100% { transform: translateZ(-100px) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
`;

const Container = styled.div`
  // perspective: 600px;
`;

const DiceContainer = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1.8s ease-out;

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

// ${(props) =>
//   props.rolling
//     ? css`
//         animation: ${spin} 1.6s infinite linear;
//       `
//     : css`
// ${(props) =>
//   props.value === 1 &&
//   (props.even
//     ? `transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg);`
//     : `transform: rotateX(-360deg) rotateY(-720deg) rotateZ(-360deg);`)}
// ${(props) =>
//   props.value === 2 &&
//   (props.even
//     ? `transform: rotateX(450deg) rotateY(720deg) rotateZ(360deg);`
//     : `transform: rotateX(-270deg) rotateY(-720deg) rotateZ(-360deg);`)}
// ${(props) =>
//   props.value === 3 &&
//   (props.even
//     ? `transform: rotateX(360deg) rotateY(630deg) rotateZ(360deg);`
//     : `transform: rotateX(-360deg) rotateY(-810deg) rotateZ(-360deg);`)}
// ${(props) =>
//   props.value === 4 &&
//   (props.even
//     ? `transform: rotateX(360deg) rotateY(810deg) rotateZ(360deg);`
//     : `transform: rotateX(-360deg) rotateY(-630deg) rotateZ(-360deg);`)}
// ${(props) =>
//   props.value === 5 &&
//   (props.even
//     ? `transform: rotateX(270deg) rotateY(720deg) rotateZ(360deg);`
//     : `transform: rotateX(-450deg) rotateY(-720deg) rotateZ(-360deg);`)}
// ${(props) =>
//   props.value === 6 &&
//   (props.even
//     ? `transform: rotateX(360deg) rotateY(900deg) rotateZ(360deg);`
//     : `transform: rotateX(-360deg) rotateY(-900deg) rotateZ(-360deg);`)}
// `}

const faces = [1, 2, 3, 4, 5, 6];

const Dice = ({ value, rolling }) => {
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
    <Container>
      <DiceContainer value={actualValue} rolling={rolling} even={even}>
        {faces.map((f) => (
          <Face value={f} />
        ))}
      </DiceContainer>
    </Container>
  );
};

export default Dice;
