import React, { useState } from 'react';
import styled from 'styled-components';

import volume from './volume.svg';

const Container = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;

  margin-right: 2vw;

  --color: #fff;
  --size: 25px;
  --border: calc(var(--size) / 25);

  width: var(--size);
  height: var(--size);

  display: block;
  position: relative;
`;

const VolumeIcon = styled.img`
  color: var(--color);
  height: 100%;
  width: 60%;
  line-height: 100%;

  display: block;

  position: relative;
  margin-left: 3px;
`;

const SoundWave = styled.div`
  position: absolute;
  border: var(--border) solid transparent;
  border-right: var(--border) solid var(--color);
  border-radius: 50%;
  transition: all 200ms;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;



  // first line
  width: 50%;
  height: 50%;

  // second line
  &:last-child {
    width: 75%;
    height: 75%;
  }


  // mute both
  ${(props) =>
    !props.isOn &&
    `
    &, &:last-child {
      border-radius: 0;
      width: 50%;
      height: 50%;
      border-width: 0 var(--border) 0 0;
    }
  `}

  // mute first
  ${(props) =>
    !props.isOn && `transform: rotate(45deg) translate3d(0, -50%, 0);`}

  // mute second
  &:last-child {
    ${(props) =>
      !props.isOn && `transform: rotate(-45deg) translate3d(0, 50%, 0);`}
  }
`;

const SoundOnOffButton = () => {
  const [isOn, setIsOn] = useState(true);

  return (
    <Container onClick={() => setIsOn((x) => !x)}>
      <VolumeIcon src={volume} />
      <SoundWave isOn={isOn} />
      <SoundWave isOn={isOn} />
    </Container>
  );
};

export default SoundOnOffButton;
