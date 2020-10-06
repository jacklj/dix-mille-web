import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import cardTableSurface from './card-table-surface-1.jpeg';

const Container = styled.div`
  text-align: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  // padding-bottom: 20px;
  // background-color: #076324; // card table green

  background-image: url('${cardTableSurface}');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;

  // background image effectively has a black translucent overlay over it (using
  // background-blend-mode: multiply;). This is removed when you start the proper
  // game, so the table surface is fully unveiled.

  background-color: rgba(0, 0, 0, 0.4); // Tint color
  background-blend-mode: ${(props) =>
    props.route === '/gameScreen' ? 'normal' : 'multiply'};
`;

const TopLevelContainer = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;

  return <Container route={pathname}>{children}</Container>;
};

export default TopLevelContainer;
