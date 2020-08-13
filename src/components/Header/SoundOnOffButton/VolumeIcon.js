import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg`
  fill: var(--color);
  height: 100%;
  width: 50%;
  line-height: 100%;

  display: block;

  position: relative;
  margin-left: 3px;

  enable-background: new 0 0 448.046 448.046;
`;

const VolumeIcon = () => (
  <Svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 448.046 448.046"
    fill="#fff">
    <path
      d="M358.967,1.614c-5.6-2.72-12.128-1.952-16.928,1.92L186.391,128.046h-74.368c-17.664,0-32,14.336-32,32v128
	c0,17.664,14.336,32,32,32h74.368l155.616,124.512c2.912,2.304,6.464,3.488,10.016,3.488c2.336,0,4.704-0.544,6.944-1.6
	c5.536-2.656,9.056-8.256,9.056-14.4v-416C368.023,9.902,364.503,4.302,358.967,1.614z"
    />
  </Svg>
);

export default VolumeIcon;
