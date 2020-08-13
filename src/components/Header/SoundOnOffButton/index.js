import React, { useState } from 'react';
import styled from 'styled-components';

import VolumeIcon from './VolumeIcon';

const Container = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  margin-right: 2vw;

  --color: ${(props) => (props.isOn ? '#fff' : '#ccc')};
  --size: 25px;
  --border: calc(var(--size) / 25);

  width: var(--size);
  height: var(--size);

  display: block;
  position: relative;

  &:hover {
    --color: #ffcf40;
  }
`;

const SoundWave = styled.div`
  position: absolute;
  border: var(--border) solid transparent;
  border-right: var(--border) solid var(--color);
  border-radius: 50%;
  transition: opacity 200ms;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  // first line
  &:nth-child(2) {
    width: 45%;
    height: 45%;

    transition-delay: 0;
  }

  // second line
  &:nth-child(3) {
    width: 75%;
    height: 75%;

    transition-delay: 200ms;
  }

  // mute
  ${(props) =>
    !props.isOn &&
    `
    // both
    &:nth-child(2), &:nth-child(3)  {
      opacity: 0;
    }

    &:nth-child(2) {
      transition-delay: 200ms;
    }

    &:nth-child(3) {
      transition-delay: 0;
    }
  `}
`;

const SoundOnOffButton = () => {
  const [isOn, setIsOn] = useState(true);

  return (
    <Container isOn={isOn} onClick={() => setIsOn((x) => !x)}>
      <VolumeIcon />
      <SoundWave isOn={isOn} />
      <SoundWave isOn={isOn} />
    </Container>
  );
};

export default SoundOnOffButton;
