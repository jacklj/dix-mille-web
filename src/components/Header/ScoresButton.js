import React from 'react';
import styled from 'styled-components';

import trophy from './trophy.png';

const Colours = {
  disabled: 'rgb(180, 176, 85)',
  normal: '#ffdc73',
  hover: '#ffcf40',
  active: '#ffbf00',
};

const Container = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  display: flex;
  flex-direction: row;
  align-items: center;

  color: white;
  font-size: 0.7em;
  font-family: Limelight;

  &:hover {
    color: ${Colours.hover};
  }

  &:active {
    color: ${Colours.active};
  }
`;

const Icon = styled.img`
  height: 1em;
  width: auto;
  margin-right: 4px;
  margin-top: -2px; // center it relative to text
`;

const ScoresButton = () => {
  const showScores = () => alert('Scores!');

  return (
    <Container onClick={showScores}>
      <Icon src={trophy} />
      Scores
    </Container>
  );
};

export default ScoresButton;
