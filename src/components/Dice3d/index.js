import React from 'react';
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

const roll = keyframes`
  0% { transform: translate3d(-200px,-50px,-400px) }
  12% { transform: translate3d(0px,0,-100px) }
  25% { transform: translate3d(200px,-50px,-400px) }
  37% { transform: translate3d(0px,-100px,-800px) }
  50% { transform: translate3d(-200px,-50px,-400px) }
  62% { transform: translate3d(0px,0,-100px) }
  75% { transform: translate3d(200px,-50px,-400px) }
  87% { transform: translate3d(0px,-100px,-800px) }
  100% { transform: translate3d(-200px,-50px,-400px) }
`;

//   ${(props) => !props.rolling && `animation-play-state: paused;`}

const Container = styled.div`
  perspective: 600px;
`;

const DiceContainer = styled.div`
  position: relative;
  transform-style: preserve-3d;
  ${(props) =>
    props.even
      ? `transition: transform 2.5s ease-out;`
      : `transition: transform 2.5s ease-out;`}


  
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
      animation: ${spin} 1.6s infinite linear;
    `}
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

const Dice = ({ value, rolling, even }) => {
  return (
    <Container>
      <DiceContainer value={value} rolling={rolling} even={even}>
        {faces.map((f) => (
          <Face value={f} />
        ))}
      </DiceContainer>
    </Container>
  );
};

export default Dice;
