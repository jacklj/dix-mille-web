import React from 'react';
import styled from 'styled-components';

const SelectionAura = styled.div`
  // N.B. CSS variables are passed to children!
  --size: 50px;

  @media (max-width: 768px), (orientation: landscape) {
    --size: 30px;
  }

  background-color: ${(props) =>
    props.selected
      ? 'rgba(100,255,150,0.5)'
      : 'rgba(0,0,0,0)'}; // cant use 'transparent' as it causes the layout to shift

  border-radius: 50%;

  padding: 0;
  margin: 2px;
  margin-bottom: 5px;

  &:nth-child(even) {
    position: relative;
    top: 0;
  }

  transform: rotate(
    -0.0000000001deg
  ); // fix Chrome bug with sub pixel rendering
`;

const Face = styled.div`
  flex: 0 0 auto;

  width: var(--size);
  height: var(--size);

  padding: calc(var(--size) * 0.17);

  background-color: #e7e7e7;
  box-shadow: inset 0 calc(var(--size) * 0.1) white,
    inset 0 calc(var(--size) * -0.1) #bbb,
    inset calc(var(--size) * 0.1) 0 #d7d7d7,
    inset calc(var(--size) * -0.1) 0 #d7d7d7;

  ${(props) =>
    !props.isInGroup &&
    `
      background-color: #ee1a11;
      box-shadow: inset 0 calc(var(--size) * 0.1) #f3544e,
        inset 0 calc(var(--size) * -0.1) #ab120c,
        inset calc(var(--size) * 0.1) 0 #d0160f,
        inset calc(var(--size) * -0.1) 0 #d0160f;
  
    `}

  border-radius: 10%;

  display: grid;
  grid-template-areas:
    'a . c'
    'e g f'
    'd . b';

  transform: rotate(
    -0.0000000001deg
  ); // fix Chrome bug with sub pixel rendering
`;

const Pip = styled.span`
  display: block;
  align-self: center;
  justify-self: center;

  width: calc(var(--size) * 0.25);
  height: calc(var(--size) * 0.25);

  border-radius: 50%;
  background-color: #333;
  box-shadow: inset 0 calc(var(--size) * 0.094) #111,
    inset 0 calc(var(--size) * -0.094) #555;

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

const Die = ({ id, value, selected, onClick, className, isInGroup }) => {
  const arrayWithValueItems = [...Array(value)];
  return (
    <SelectionAura
      selected={selected}
      onClick={onClick}
      className={className}
      isInGroup={isInGroup}>
      <Face isInGroup={isInGroup}>
        {arrayWithValueItems.map((v, k) => (
          <Pip key={k} />
        ))}
      </Face>
    </SelectionAura>
  );
};

export default Die;
