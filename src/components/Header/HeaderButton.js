import React from 'react';
import styled from 'styled-components';

const Colours = {
  disabled: 'rgb(180, 176, 85)',
  normal: '#fff',
  hover: '#ffcf40',
  active: '#ffbf00',
};

const Container = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  ${(props) => (props.large ? 'margin-bottom: 10vh;' : 'margin-right: 2vw;')}

  display: flex;
  flex-direction: row;
  align-items: center;

  color: ${Colours.normal};
  font-size: ${(props) => (props.large ? '3em' : '0.6em')};
  font-family: Limelight;
  text-transform: uppercase;

  cursor: pointer;

  // svg
  & svg {
    height: ${(props) => (props.large ? '0.6em' : '1em')};
    width: auto;
    margin-right: ${(props) => (props.large ? '10px' : '4px')};
    margin-top: -2px; // center it relative to text

    ${(props) =>
      !props.large &&
      `
    @media (max-width: 380px) {
      display: none;
    }
    `}
  }

  &:hover {
    color: ${Colours.hover};

    & svg {
      fill: ${Colours.hover};
    }
  }

  &:active {
    color: ${Colours.active};

    & svg {
      fill: ${Colours.active};
    }
  }

  &:last-child {
    margin-right: 0;
    margin-bottom: 0;
  }
`;

const HeaderButton = ({ Icon, onClick, children, large = false }) => {
  return (
    <Container onClick={onClick} large={large}>
      {Icon && <Icon />}
      {children}
    </Container>
  );
};

export default HeaderButton;
