import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { windowResized } from 'redux/ui/slice';
import cardTableSurface from './card-table-surface-1.jpeg';
import { selectWindowInnerHeight } from 'redux/ui/selectors';

const Container = styled.div`
  --page-height: ${(props) => props.innerHeight}px; // 100vh;

  text-align: center;
  height: var(--page-height);
  display: flex;
  flex-direction: column;

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

  // game CSS variables live here now, so they can get the innerHeight
  --game-container-width: min(100vw, 900px);
  --game-container-height: calc(
    var(--page-height) - var(--header-height-estimate)
  );

  @media (orientation: portrait) {
    --scoring-groups-area-height: min(
      330px,
      var(--game-container-height) * 0.5
    );
    --scoring-groups-area-width: calc(
      100vw - 30px
    ); /* -30px for horizontal margins */

    --rolled-dice-area-height: calc(
      var(--game-container-height) - var(--scoring-groups-area-height)
    );

    --rolled-dice-area-width: var(--game-container-width);

    --banked-dice-size: min(
      var(--max-banked-dice-size),
      max(
        var(--min-banked-dice-size),
        calc(
          min(
              var(--scoring-groups-area-height) - var(--turn-score-height) -
                40px,
              var(--scoring-groups-area-width) - var(--dice-cup-width)
            ) / (6 * 1.1) - 2px
            /* each banked dice has margin: 1px; -2px to account for this */
            /* N.B. dont need to account for DiceCup right margin, because it's 
              less than the horizontal margins of the ScoringGroups container */
            /* N.B. -40px is a magic value :/ */
        )
      )
    );

    --rolled-dice-size: max(
      var(--rolled-dice-area-height) / 8,
      var(--min-rolled-dice-size)
    );
  }

  @media (orientation: landscape) {
    --scoring-groups-area-width: min(380px, 45vw);
    --scoring-groups-area-height: var(--game-container-height);

    /* calc(var(--banked-dice-size) * 1.5 * 6); */

    --rolled-dice-area-height: calc(
      var(--game-container-height) - var(--dice-cup-height)
    );
    --rolled-dice-area-width: calc(
      var(--game-container-width) - var(--scoring-groups-area-width)
    );

    /* --banked-dice-size: min(40px, calc((var(--game-container-width) / 2) / 10)); */

    --banked-dice-size: min(
      var(--max-banked-dice-size),
      min(
          var(--scoring-groups-area-height) - var(--turn-score-height) - 80px,
          var(--scoring-groups-area-width) - 60px
        ) / (6 * 1.1) - 2px
        /* each banked dice has margin: 1px; -2px to account for this */
        /* N.B. -80px and -60px are magic values :/ */
    );

    --rolled-dice-size: max(
      min(var(--rolled-dice-area-height), var(--rolled-dice-area-width)) / 8,
      var(--min-rolled-dice-size)
    );
  }
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

    // document.body.style.height = `${window.innerHeight}px`; // `100vh`;
    function onResize() {
      // console.log('window resized!');
      const innerHeight =
        document.documentElement?.clientHeight || window.innerHeight;
      const innerWidth =
        document.documentElement?.clientWidth || window.innerWidth;

      dispatch(windowResized({ innerHeight, innerWidth }));
      document.body.style.height = `${innerHeight}px`;
    }

    // call it first time too
    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [dispatch]);

  return (
    <Container innerHeight={innerHeight} route={pathname}>
      {children}
    </Container>
  );
};

export default TopLevelContainer;
