import React from 'react';
import styled from 'styled-components';

const SelectionAura = styled.div`
  // N.B. CSS variables are passed to children!
  --size: ${(props) => (props.isInGroup ? '50px' : '60px')};

  @media (max-width: 768px), (orientation: landscape) {
    --size: ${(props) => (props.isInGroup ? '30px' : '45px')};
  }

  background-color: ${(props) =>
    props.selected
      ? 'rgba(100,255,150,0.5)'
      : 'rgba(0,0,0,0)'}; // cant use 'transparent' as it causes the layout to shift

  border-radius: 50%;

  padding: ${(props) => (props.isInGroup ? '0' : 'calc(var(--size) * 0.17)')};
  margin: ${(props) => (props.isInGroup ? '2px' : 'calc(var(--size) * 0.2)')};
  margin-bottom: ${(props) =>
    props.isInGroup ? '5px' : 'calc(var(--size) * 0.4)'};

  &:nth-child(even) {
    position: relative;
    top: ${(props) => (props.isInGroup ? '0' : 'calc(var(--size) * 0.4)')};
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

  box-shadow: inset 0 calc(var(--size) * 0.1) white,
    inset 0 calc(var(--size) * -0.1) #bbb,
    inset calc(var(--size) * 0.1) 0 #d7d7d7,
    inset calc(var(--size) * -0.1) 0 #d7d7d7;

  border-radius: 10%;
  background-color: #e7e7e7;

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

const Die = ({ id, value, selected, onClick, isInGroup, className }) => {
  const arrayWithValueItems = [...Array(value)];
  return (
    <SelectionAura
      selected={selected}
      onClick={onClick}
      isInGroup={isInGroup}
      className={className}>
      <Face isInGroup={isInGroup}>
        {arrayWithValueItems.map((v, k) => (
          <Pip key={k} isInGroup={isInGroup} />
        ))}
      </Face>
    </SelectionAura>
  );
};

export default Die;
