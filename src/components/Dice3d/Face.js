import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 0 0 auto;

  width: var(--rolled-dice-size);
  height: var(--rolled-dice-size);

  padding: calc(var(--rolled-dice-size) * 0.17);

  background-color: #e7e7e7;
  box-shadow: inset 0 calc(var(--rolled-dice-size) * 0.1) white,
    inset 0 calc(var(--rolled-dice-size) * -0.1) #bbb,
    inset calc(var(--rolled-dice-size) * 0.1) 0 #d7d7d7,
    inset calc(var(--rolled-dice-size) * -0.1) 0 #d7d7d7;

  border-radius: 10%;

  // if the dice is banked, make it translucent.
  // when we do this, we see the bottom face of the dice underneath, which is confusing. So when the
  // dice is banked, make all faces but the top face completely transparent
  opacity: ${(props) =>
    props.banked ? (props.value === props.faceShown ? '0.3' : '0') : '1'};

  display: grid;
  grid-template-areas:
    'a . c'
    'e g f'
    'd . b';

  // transform: rotate(
  //   -0.0000000001deg
  // ); // fix Chrome bug with sub pixel rendering

  // 3d stuff
  position: absolute;

  ${(props) =>
    props.value === 1 &&
    `transform: rotate3d(0, 0, 0, 90deg) translateZ(calc(var(--rolled-dice-size) * 0.7));`}
  ${(props) =>
    props.value === 2 &&
    `transform: rotate3d(-1, 0, 0, 90deg) translateZ(calc(var(--rolled-dice-size) * 0.7));`}
  ${(
    props,
  ) =>
    props.value === 3 &&
    `transform: rotate3d(0, 1, 0, 90deg) translateZ(calc(var(--rolled-dice-size) * 0.7));`}
  ${(
    props,
  ) =>
    props.value === 4 &&
    `transform: rotate3d(0, -1, 0, 90deg) translateZ(calc(var(--rolled-dice-size) * 0.7));`}
  ${(
    props,
  ) =>
    props.value === 5 &&
    `transform: rotate3d(1, 0, 0, 90deg) translateZ(calc(var(--rolled-dice-size) * 0.7));`}
  ${(
    props,
  ) =>
    props.value === 6 &&
    `transform: rotate3d(1, 0, 0, 180deg) translateZ(calc(var(--rolled-dice-size) * 0.7));`}
`;

const Pip = styled.span`
  display: block;
  align-self: center;
  justify-self: center;

  width: calc(var(--rolled-dice-size) * 0.25);
  height: calc(var(--rolled-dice-size) * 0.25);

  border-radius: 50%;

  background-color: #333;
  box-shadow: inset 0 calc(var(--rolled-dice-size) * 0.094) #111,
    inset 0 calc(var(--rolled-dice-size) * -0.094) #555;

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

const Face = ({ value, banked, faceShown }) => {
  const arrayWithValueItems = [...Array(value)];

  return (
    <Container value={value} banked={banked} faceShown={faceShown}>
      {arrayWithValueItems.map((v, k) => (
        <Pip key={k} />
      ))}
    </Container>
  );
};

export default Face;
