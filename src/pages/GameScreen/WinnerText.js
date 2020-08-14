import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ScoresTable from 'components/ScoresTable';
import { Button } from 'components/forms';
import Overlay from 'components/Overlay';
import { selectHasSomeoneWon } from 'redux/game/selectors';

const bounce = keyframes`
100% {
  top: -10px;
  text-shadow: 0 1px 0 #155415, 0 2px 0 #155415, 0 3px 0 #155415, 0 4px 0 #155415,
    0 5px 0 #155415, 0 6px 0 #155415, 0 7px 0 #155415, 0 8px 0 #155415, 0 9px 0 #155415,
    0 50px 25px rgba(170, 169, 173, 0.5);
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

  font-size: 80px;
  font-family: Limelight;
  color: #77dd77;

  @media (max-width: 480px) {
    font-size: 55px;
  }

  // animations
  span {
    position: relative;
    top: 10px;
    display: inline-block;

    animation: ${bounce} 0.3s ease infinite alternate;

    text-shadow: 0 1px 0 #155415, 0 2px 0 #155415, 0 3px 0 #155415,
      0 4px 0 #155415, 0 5px 0 #155415, 0 6px 0 transparent, 0 7px 0 transparent,
      0 8px 0 transparent, 0 9px 0 transparent,
      0 10px 10px rgba(170, 169, 173, 0.7);
  }

  ${nthChildCss}  
}
`;

// dummy data
const hasSomeoneWon = {
  didIWin: true,
};

const WinnerText = () => {
  // const hasSomeoneWon = useSelector(selectHasSomeoneWon);

  const message = `${
    hasSomeoneWon.didIWin ? 'You' : hasSomeoneWon.winnersName
  } won!`;

  // wrap every character (except space) in a span
  const jsx = (
    <>{message.split('').map((x) => (x === ' ' ? x : <span>{x}</span>))}</>
  );

  return <Container>{jsx}</Container>;
};

export default WinnerText;
