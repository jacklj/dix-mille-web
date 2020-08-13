import React from 'react';
import styled, { keyframes } from 'styled-components';

import { Button } from 'components/forms';

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-color: rgba(10, 10, 10, 0.95);
  overflow-y: scroll;

  z-index: 1; // ensures it goes over the avatar carousel

  animation: ${fadeIn} 0.5s ease-in 1;
`;

// InnerContainer mainly for padding, as bottom padding doesnt work on some browsers when `overflow: scroll`
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 100px;
  padding-bottom: 50px;
  align-items: center;

  // so content doesn't go under the notch on notched phones
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  // N.B. some of the right padding is cut off for some reason. Probably "overscrollback"
  // https://web.archive.org/web/20170707053030/http://www.brunildo.org/test/overscrollback.html)
  // Seems difficult to fix...
`;

const CustomButton = styled(Button)`
  height: 38px;

  padding-left: 10px;
  padding-right: 10px;

  font-size: 15px;

  position: fixed;
  top: 10px;
  right: max(env(safe-area-inset-right), 10px);

  background-color: black;
`;

const Overlay = ({ children, closeButton, hide }) => (
  <Container>
    {closeButton && <CustomButton onClick={hide}>Close</CustomButton>}
    <InnerContainer>{children}</InnerContainer>
  </Container>
);

export default Overlay;
