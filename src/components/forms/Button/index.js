import React from 'react';
import styled from 'styled-components';

import LoadingSpinner from './LoadingSpinner';

const Colours = {
  disabled: 'rgb(180, 176, 85)',
  normal: '#ffdc73',
  hover: '#ffcf40',
  active: '#ffbf00',
};

const BasicButton = styled.button`
  height: 58px;

  // padding: 10px;
  padding-left: 15px;
  padding-right: 15px;

  font-size: 27px;

  // display: flex;
  // justify-content: center;
  // align-items: center;

  background-color: transparent;
  border-width: 6px;
  border-style: double;
  border-radius: 50px;

  font-family: 'Playfair Display', serif;
  letter-spacing: 0.5px;
  font-weight: 700;
  text-transform: uppercase;

  color: ${Colours.normal};
  border-color: ${Colours.normal};
  text-shadow: 2px 2px 8px #000000;

  cursor: pointer;

  ${({ isDisabled }) =>
    isDisabled &&
    `
    color: ${Colours.disabled};
    border-color: ${Colours.disabled};
    text-shadow: none;
    text-decoration: line-through;
    text-decoration-thickness: 3px; // mainly for firefox, otherwise strikethrough line looks too small (1px thick)
  `}

  &:hover {
    border-color: ${Colours.hover};
    color: ${Colours.hover};

    ${({ isDisabled }) =>
      isDisabled &&
      `
    color: ${Colours.disabled};
    border-color: ${Colours.disabled};
    `}
  }

  &:active {
    border-color: ${Colours.active};
    color: ${Colours.active};

    text-shadow: 2px 2px 20px #000000;

    ${({ isDisabled }) =>
      isDisabled &&
      `
    color: ${Colours.disabled};
    border-color: ${Colours.disabled};
    text-shadow: none;
    `}
  }
`;

const LoadingMessage = styled.span`
  margin-left: 6px;
`;

// wrap button content in a span, because not all browsers support button elements being flex containers.
const FlexSpan = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = ({
  loading,
  loadingMessage = null,
  children,
  className,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  disabled,
}) => {
  return (
    <BasicButton
      className={className}
      // N.B. when a native html <button> element has the `disabled` attribute, it no longer fires mouse events
      // like onMouseUp and onMouseLeave. So if we disable the button when it's in the loading state, then
      // these don't work. Solution: if any such events have handlers defined, don't disable the button - the
      // event handlers will have to perform validity checks themselves.
      // The button will still look disabled as the props are passed through to the styled component.
      disabled={disabled || (loading && !(onMouseUp || onMouseLeave))} // native <button /> 'disabled' attribute
      isDisabled={disabled} // for conditional styling
      isLoading={loading}
      onClick={onClick ? onClick : undefined}
      onMouseDown={onMouseDown ? onMouseDown : undefined}
      onMouseUp={onMouseUp ? onMouseUp : undefined}
      onMouseLeave={onMouseLeave ? onMouseLeave : undefined}
      // N.B. touchStart and touchEnd events aren't prevented from firing when the button is disabled,
      // because they're not native button events (https://stackoverflow.com/a/57427363/3351215)
      // So, need to manually prevent the handlers from being fired.
      onTouchStart={
        disabled ? undefined : onTouchStart ? onTouchStart : undefined
      }
      onTouchEnd={disabled ? undefined : onTouchEnd ? onTouchEnd : undefined}>
      <FlexSpan>
        {loading ? (
          <>
            <LoadingSpinner />
            {loadingMessage && (
              <LoadingMessage>{loadingMessage}</LoadingMessage>
            )}
          </>
        ) : (
          children
        )}
      </FlexSpan>
    </BasicButton>
  );
};

export default Button;
