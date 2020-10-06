import React from 'react';
import styled from 'styled-components';

const Face = styled.div`
  margin: 1px;

  &:nth-child(even) {
    position: relative;
    top: 0;
  }

  transform: rotate(
    -0.0000000001deg
  ); // fix Chrome bug with sub pixel rendering

  flex: 0 0 auto;

  width: var(--banked-dice-size);
  height: var(--banked-dice-size);

  padding: calc(var(--banked-dice-size) * 0.17);

  background-color: #e7e7e7;
  box-shadow: inset 0 calc(var(--banked-dice-size) * 0.1) white,
    inset 0 calc(var(--banked-dice-size) * -0.1) #bbb,
    inset calc(var(--banked-dice-size) * 0.1) 0 #d7d7d7,
    inset calc(var(--banked-dice-size) * -0.1) 0 #d7d7d7;

  ${(props) =>
    !props.isInGroup &&
    `
      background-color: #ee1a11;
      box-shadow: inset 0 calc(var(--banked-dice-size) * 0.1) #f3544e,
        inset 0 calc(var(--banked-dice-size) * -0.1) #ab120c,
        inset calc(var(--banked-dice-size) * 0.1) 0 #d0160f,
        inset calc(var(--banked-dice-size) * -0.1) 0 #d0160f;
  
    `}

  border-radius: 10%;

  display: grid;
  grid-template-areas:
    'a . c'
    'e g f'
    'd . b';

  z-index: 3; // so that the banked dice are clickable above the DiceCup container div
`;

const Pip = styled.span`
  display: block;
  align-self: center;
  justify-self: center;

  width: calc(var(--banked-dice-size) * 0.25);
  height: calc(var(--banked-dice-size) * 0.25);

  border-radius: 50%;
  background-color: #333;
  box-shadow: inset 0 calc(var(--banked-dice-size) * 0.094) #111,
    inset 0 calc(var(--banked-dice-size) * -0.094) #555;

  transform: rotate(
    -0.0000000001deg
  ); // fix Chrome bug with sub pixel rendering

  &:nth-child(2) {
    grid-area: b;
  }
  &:nth-child(3) {
    grid-area: c;
  }
  &:nth-child(4) {
    grid-area: d;
  }
  &:nth-child(5) {
    grid-area: e;
  }
  &:nth-child(6) {
    grid-area: f;
  }

  &:nth-child(odd):last-child {
    grid-area: g;
  }
`;

const Die = ({ id, value, onClick, className, isInGroup }) => {
  const arrayWithValueItems = [...Array(value)];
  return (
    <Face onClick={onClick} className={className} isInGroup={isInGroup}>
      {arrayWithValueItems.map((v, k) => (
        <Pip key={k} />
      ))}
    </Face>
  );
};

export default Die;
