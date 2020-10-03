import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { selectHasSomeoneWon } from 'redux/game/selectors';

const Container = styled.div`
  margin-bottom: 40px;

  font-size: 70px;
  font-family: Limelight;
  color: ${(props) => (props.didIWin ? '#FFC019' : '#77dd77')};

  @media (max-width: 480px) {
    font-size: 50px;
  }

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

const WinnerText = () => {
  const hasSomeoneWon = useSelector(selectHasSomeoneWon);

  const { didIWin } = hasSomeoneWon;

  const message = `${didIWin ? 'You' : hasSomeoneWon.winnersName} won!`;

  return (
    <>
      <Container didIWin={didIWin}>{message}</Container>
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

export default WinnerText;
