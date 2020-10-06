import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { windowResized } from 'redux/ui/slice';
import cardTableSurface from './card-table-surface-1.jpeg';
import { selectWindowInnerHeight } from 'redux/ui/selectors';

const Container = styled.div`
  text-align: center;
  height: ${(props) => props.innerHeight}px;
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
  const dispatch = useDispatch();
  const innerHeight = useSelector(selectWindowInnerHeight);

  useEffect(() => {
    // initial
    dispatch(
      windowResized({
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
      }),
    );

    document
      .getElementsByTagName('body')[0]
      .style.setProperty('height', window.innerHeight);

    window.addEventListener('resize', function () {
      console.log('window resized!');
      const { innerHeight, innerWidth } = window;
      dispatch(windowResized({ innerHeight, innerWidth }));
      document
        .getElementsByTagName('body')[0]
        .style.setProperty('height', innerHeight);
    });
    return () => window.removeEventListener('resize');
  }, [dispatch]);

  return (
    <Container innerHeight={innerHeight} route={pathname}>
      {children}
    </Container>
  );
};

export default TopLevelContainer;
