import React from 'react';
import styled from 'styled-components';

import LoadingSpinner from './LoadingSpinner';

const BasicButton = styled.button`
  padding: 10px;

  ${(props) =>
    !props.isLoading &&
    `
    padding-left: 15px;
    padding-right: 15px;
    font-size: 1.7em;
  `}

  background-color: transparent;
  border: 6px double rgb(180, 176, 85);
  border-radius: 50px;

  color: rgb(180, 176, 85);
  font-family: 'Playfair Display', serif;
  letter-spacing: 0.5px;
  font-weight: 700;
  text-transform: uppercase;

  &:hover {
    border: 6px double #ffcf40;
    color: #ffcf40;
  }
  &:active {
    border: 6px double #ffbf00;
    color: #ffbf00;
  }
`;

const Button = ({ loading, children, className, onClick, disabled }) => {
  return (
    <BasicButton
      className={className}
      disabled={disabled || loading}
      isLoading={loading}
      isDisabled={disabled} // the `disabled` prop is to disable the button element, when loading or disabled. `isDisabled` is for conditional styling
      onClick={onClick}>
      {loading ? <LoadingSpinner /> : children}
    </BasicButton>
  );
};

export default Button;
