import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

// we need an inner container to do the padding-bottom, because Firefox and Safari don't support padding-bottom
// on an element with overflow: scroll or auto.
// Firefox bug here: https://bugzilla.mozilla.org/show_bug.cgi?id=748518
const InnerContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 30px;
  padding-bottom: 40px;

  // so content doesn't go under the notch on notched phones
  padding-left: max(env(safe-area-inset-left), 15px);
  padding-right: max(env(safe-area-inset-right), 15px);
  // N.B. max() isn't supported by Firefox for Android https://caniuse.com/#search=max%20function
`;

const SetupScreenContainer = ({ children }) => (
  <Container>
    <InnerContainer>{children}</InnerContainer>
  </Container>
);

export default SetupScreenContainer;
