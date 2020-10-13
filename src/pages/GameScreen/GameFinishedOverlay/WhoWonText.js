import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useSelector } from 'react-redux';

import { selectHasSomeoneWon } from 'redux/game/selectors';

const bounceLost = keyframes`
100% {
  transform: translateY(-10px);
  text-shadow: 0 1px 0 #155415, 0 2px 0 #155415, 0 3px 0 #155415, 0 4px 0 #155415,
    0 5px 0 #155415, 0 6px 0 #155415, 0 7px 0 #155415, 0 8px 0 #155415, 0 9px 0 #155415,
    0 50px 25px rgba(170, 169, 173, 0.5);
}
`;

const bounceWon = keyframes`
100% {
  transform: translateY(-10px);
  text-shadow: 0 1px 0 #7F6319, 0 2px 0 #7F6319, 0 3px 0 #7F6319, 0 4px 0 #7F6319,
    0 5px 0 #7F6319, 0 6px 0 #7F6319, 0 7px 0 #7F6319, 0 8px 0 #7F6319, 0 9px 0 #7F6319,
    0 50px 25px rgba(255, 220, 127, 0.5);
}
`;

let nthChildCss = ``;

for (let i = 2; i < 60; i++) {
  nthChildCss =
    nthChildCss +
    `
  span:nth-child(${i}) {
    animation-delay: ${0.1 * (i - 1)}s;
  }

  `;
}

const Container = styled.div`
  margin-bottom: 40px;

  font-size: 70px;
  font-family: Limelight;
  color: ${(props) => (props.didIWin ? '#FFC019' : '#77dd77')};

  @media (max-width: 480px) {
    font-size: 50px;
  }

  // animations
  span {
    position: relative;
    display: inline-block;

    transform: translateY(10px);

    ${(props) =>
      props.didIWin
        ? css`
            animation: ${bounceWon} 0.3s ease infinite alternate;

            text-shadow: 0 1px 0 #7f6319, 0 2px 0 #7f6319, 0 3px 0 #7f6319,
              0 4px 0 #7f6319, 0 5px 0 #7f6319, 0 6px 0 transparent,
              0 7px 0 transparent, 0 8px 0 transparent, 0 9px 0 transparent,
              0 10px 10px rgba(255, 220, 127, 0.7);
          `
        : css`
            animation: ${bounceLost} 0.3s ease infinite alternate;

            text-shadow: 0 1px 0 #155415, 0 2px 0 #155415, 0 3px 0 #155415,
              0 4px 0 #155415, 0 5px 0 #155415, 0 6px 0 transparent,
              0 7px 0 transparent, 0 8px 0 transparent, 0 9px 0 transparent,
              0 10px 10px rgba(170, 169, 173, 0.7);
          `}
  }

  ${nthChildCss}

  ${(props) => !props.didIWin && `filter: url("#flyOn");`}
`;

const Svg = styled.svg`
  // hide it!
  display: absolute;
  top: 0;
  left: 0;
  height: 1px;
  width: 1px;
  z-index: -1;
`;

// dummy data
// const hasSomeoneWon = {
//   didIWin: false,
//   winnersName: 'Granchester Mike',
// };

const WhoWonText = () => {
  const hasSomeoneWon = useSelector(selectHasSomeoneWon);

  const { didIWin } = hasSomeoneWon;

  const message = `${didIWin ? 'You' : hasSomeoneWon.winnersName} won!`;

  // wrap every character (except space) in a span
  const jsx = (
    <>{message.split('').map((x) => (x === ' ' ? x : <span>{x}</span>))}</>
  );

  return (
    <>
      <Container didIWin={didIWin}>{jsx}</Container>
      <Svg>
        <defs>
          <filter id="flyOn">
            <feTurbulence
              id="turbulence"
              baseFrequency="0.02"
              numOctaves="1"
              result="noise"
              seed="3"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
          </filter>
        </defs>
      </Svg>
    </>
  );
};

export default WhoWonText;
