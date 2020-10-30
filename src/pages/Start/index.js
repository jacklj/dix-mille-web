import React from 'react';
import styled from 'styled-components';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import 'firebase/functions';
import { useDispatch } from 'react-redux';

import Logo from './Logo';
import { Button } from 'components/forms';
import SetupScreenContainer from 'components/SetupScreenContainer';
import CONSTANTS from 'services/constants';
import { showOverlay } from 'redux/ui/slice';

const IntroText = styled.div`
  margin-top: 40px;
  margin-bottom: 80px;

  color: #ffdc73;
  font-size: 1.5em;

  text-shadow: 0 8px 8px rgba(0, 0, 0, 0.5);

  &:last-child {
    margin-bottom: 0;
  }
`;

const CustomButton = styled(Button)`
  margin-bottom: 40px;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;

  color: #ffdc73;
  font-size: 1em;
  font-family: 'Playfair Display', serif;
`;

const Start = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const showRules = () => dispatch(showOverlay(CONSTANTS.OVERLAYS.RULES));

  // N.B. <div>s around buttons are to fix a bug in mobile Safari where the flex container
  // forces the buttons to be really short (ie squished vertically)

  return (
    <SetupScreenContainer>
      <Logo />

      <IntroText>
        <p>An ancient dice game of many names.</p>
        <p>Ten thousand - Farkle - Crap Out - Zilch - Greed - Hot Dice</p>
      </IntroText>
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
      <IntroText>
        <p>
          Click <LinkButton onClick={showRules}>here</LinkButton> to read the
          rules.
        </p>
      </IntroText>
    </SetupScreenContainer>
  );
};

export default Start;
