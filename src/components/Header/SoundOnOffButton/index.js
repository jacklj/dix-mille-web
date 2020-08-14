import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import useSound from 'use-sound';

import VolumeIcon from './VolumeIcon';
import { selectIsSoundOn } from 'redux/settings/selectors';
import { soundOn, soundOff } from 'redux/settings/slice';
import switchOff from './switchOff.mp3';
import switchOn from './switchOn.mp3';

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
  const isOn = useSelector(selectIsSoundOn);
  const dispatch = useDispatch();
  const [playSwitchOn] = useSound(switchOn, { volume: 0.4 });
  const [playSwitchOff] = useSound(switchOff);

  const toggleSound = () => {
    if (isOn) {
      playSwitchOff();
      dispatch(soundOff());
    } else {
      playSwitchOn();
      dispatch(soundOn());
    }
  };

  return (
    <Container isOn={isOn} onClick={toggleSound}>
      <VolumeIcon />
      <SoundWave isOn={isOn} />
      <SoundWave isOn={isOn} />
    </Container>
  );
};

export default SoundOnOffButton;
