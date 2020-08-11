import React from 'react';
import styled from 'styled-components';

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

  margin-right: 2vw;

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

const HeaderButton = ({ icon, onClick, children }) => {
  return (
    <Container onClick={onClick}>
      <Icon src={icon} />
      {children}
    </Container>
  );
};

export default HeaderButton;
