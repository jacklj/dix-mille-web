import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import 'firebase/functions';

import Logo from './Logo';
import { Button } from 'components/forms';
import SetupScreenContainer from 'components/SetupScreenContainer';
import WhoWonText from '../GameScreen/GameFinishedOverlay/WhoWonText/WhoWonTextDumb';
const IntroText = styled.div`
  margin-top: 40px;
  margin-bottom: 80px;

  color: #ffdc73;
  font-size: 1.5em;

  text-shadow: 0 8px 8px rgba(0, 0, 0, 0.5);
`;

const CustomButton = styled(Button)`
  margin-bottom: 40px;
`;

// const handleScroll = () => {
//   lastScrollY = window.scrollY;

//   if (!ticking) {
//     window.requestAnimationFrame(() => {
//       this.nav.current.style.top = `${lastScrollY}px`;
//       ticking = false;
//     });

//     ticking = true;
//   }
// };

const Start = () => {
  const history = useHistory();
  const scrollContainer = useRef(null);
  const [debug, setDebug] = useState(null);

  useEffect(() => {
    console.log(scrollContainer);
    if (scrollContainer.current) {
      const el = scrollContainer.current;

      el.addEventListener('scroll', () => {
        const top = el.scrollTop;
        const totalScroll = el.scrollHeight;
        const bottom = top + el.offsetHeight;

        setDebug((x) => `${x}, ${top}`);

        //If we're at the top or the bottom of the containers
        //scroll, push up or down one pixel.
        //
        //this prevents the scroll from "passing through" to
        //the body.
        if (top <= 0) {
          el.scrollTop = 0;
        } else if (bottom >= totalScroll) {
          el.scrollTop = top - 1;
        }
      });
    }

    // const listener = scrollContainer.current.addEventListener('scroll', function(e) {
    //   last_known_scroll_position = window.scrollY;

    //   if (!ticking) {
    //     window.requestAnimationFrame(function() {
    //       doSomething(last_known_scroll_position);
    //       ticking = false;
    //     });

    //     ticking = true;
    //   }
    // });

    // return () => scrollContainer.removeEventListener('scroll', listener);
  }, []);

  // N.B. <div>s around buttons are to fix a bug in mobile Safari where the flex container
  // forces the buttons to be really short (ie squished vertically)

  return (
    <SetupScreenContainer ref={scrollContainer}>
      <WhoWonText message="Hello there, boys." />
      <Logo />

      {/* <IntroText>{debug}</IntroText> */}
      <div>
        <CustomButton onClick={() => history.push('/singlePlayerStart')}>
          Single player
        </CustomButton>
      </div>
      <div>
        <CustomButton onClick={() => history.push('/multiplayerStart')}>
          Multiplayer
        </CustomButton>
      </div>
    </SetupScreenContainer>
  );
};

export default Start;
