import { css } from 'styled-components';

// N.B. copied directly from /components/forms/Button
const Colours = {
  disabled: 'rgb(180, 176, 85)',
  normal: '#ffdc73',
  hover: '#ffcf40',
  active: '#ffbf00',
};

export default css`
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
