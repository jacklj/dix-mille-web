import React from 'react';
import styled from 'styled-components';

const SelectionAura = styled.div`
  background-color: ${(props) =>
    props.selected ? 'rgba(0,240,0,0.5)' : 'rgba(0,240,0,0)'};
  border-radius: 50%;

  padding: ${(props) => (props.isInGroup ? '0' : '15px')};

  margin: 0px;
  margin-bottom: ${(props) => (props.isInGroup ? '5px' : '30px')};

  &:nth-child(even) {
    position: relative;
    top: ${(props) => (props.isInGroup ? '0' : '30px')};
  }

  @media (max-width: 768px) {
    padding: ${(props) => (props.isInGroup ? '0' : '9px')};
    margin-bottom: ${(props) => (props.isInGroup ? '5px' : '15px')};

    &:nth-child(even) {
      position: relative;
      top: ${(props) => (props.isInGroup ? '0' : '15px')};
    }
  }
`;

const Face = styled.div`
  flex: 0 0 auto;
  margin: ${(props) => (props.isInGroup ? '5px' : '16px')};
  padding: 10px;

  width: ${(props) => (props.isInGroup ? '60px' : '90px')};
  height: ${(props) => (props.isInGroup ? '60px' : '90px')};

  @media (max-width: 768px) {
    width: ${(props) => (props.isInGroup ? '35px' : '50px')};
    height: ${(props) => (props.isInGroup ? '35px' : '50px')};

    margin: ${(props) => (props.isInGroup ? '3px' : '8px')};
  }

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

  width: ${(props) => (props.isInGroup ? '18px' : '22px')};
  height: ${(props) => (props.isInGroup ? '18px' : '22px')};

  @media (max-width: 768px) {
    width: ${(props) => (props.isInGroup ? '8px' : '12px')};
    height: ${(props) => (props.isInGroup ? '8px' : '12px')};
  }

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

const Die = ({ id, value, selected, onClick, isInGroup }) => {
  const arrayWithValueItems = [...Array(value)];
  return (
    <SelectionAura selected={selected} onClick={onClick} isInGroup={isInGroup}>
      <Face isInGroup={isInGroup}>
        {arrayWithValueItems.map((v, k) => (
          <Pip key={k} isInGroup={isInGroup} />
        ))}
      </Face>
    </SelectionAura>
  );
};

export default Die;
