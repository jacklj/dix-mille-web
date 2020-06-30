import React from 'react';
import styled from 'styled-components';

const SelectionAura = styled.div`
  background-color: ${(props) =>
    props.selected ? 'rgba(0,240,0,0.5)' : 'rgba(0,240,0,0)'};
  border-radius: 50%;
  padding: 20px;
  margin: 16px;
`;

const Face = styled.div`
  flex: 0 0 auto;
  margin: 16px;
  padding: 10px;
  width: 104px;
  height: 104px;

  background-color: #e7e7e7;
  box-shadow: inset 0 5px white, inset 0 -5px #bbb, inset 5px 0 #d7d7d7,
    inset -5px 0 #d7d7d7;
  border-radius: 10%;

  display: grid;
  grid-template-areas:
    'a . c'
    'e g f'
    'd . b';
`;

const Pip = styled.span`
  display: block;
  align-self: center;
  justify-self: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #333;
  box-shadow: inset 0 3px #111, inset 0 -3px #555;

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

const Die = ({ id, value, selected, onClick }) => {
  const arrayWithValueItems = [...Array(value)];
  return (
    <SelectionAura selected={selected} onClick={onClick}>
      <Face>
        {arrayWithValueItems.map((v, k) => (
          <Pip key={k} />
        ))}
      </Face>
    </SelectionAura>
  );
};

export default Die;
