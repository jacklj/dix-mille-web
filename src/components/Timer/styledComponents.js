import React from 'react';
import styled, { css, keyframes } from 'styled-components';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPause } from '@fortawesome/free-solid-svg-icons';

const opacityPulseAnimation = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

export const TimerStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  margin: 5px;
  color: white;
  font-size: 2em;
  line-height: 1em;

  animation: ${(props) =>
    props.isPaused
      ? css`
          ${opacityPulseAnimation} 1.5s ease-in-out 0s infinite
        `
      : css`none`};
`;

export const TimeText = styled.div`
  font-family: 'Electrolize', sans-serif;
  flex: 1;
`;

const Icon = styled.div`
  height: 0.9em;
  width: relative;
  margin-right: 10px;
  flex: 0;
`;

export const PauseIcon = <Icon>paused</Icon>;
