import React from 'react';
import styled from 'styled-components';

import close from './close.png';

const Button = styled.button`
  display: flex;
  align-items: center;

  border-radius: 100px;
  border: 2px solid white;
  color: white;
  background-color: transparent;

  margin-left: 8px;
  padding: 3px;
  padding-right: 0;

  transition: padding-right 0.5s linear;
  outline: none;

  &:hover {
    padding-right: 5px;
  }

  &:active {
    color: #ffbf00;
    border-color: #ffbf00;
    outline: none;
  }

  & div {
    display: inline-block;
    max-width: 0;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: top;

    margin-left: 3px;

    transition: max-width 1s;
  }

  &:hover div {
    max-width: 20rem;
  }
`;

const CloseIcon = styled.img`
  height: 1.5em;
  width: 1.5em;
`;

const Text = styled.div`
  font-size: 1.2em;

  text-transform: uppercase;
`;

const PutBackButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <CloseIcon src={close} />
      <Text>Put back</Text>
    </Button>
  );
};

export default PutBackButton;
