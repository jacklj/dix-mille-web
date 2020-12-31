import React from 'react';
import styled from 'styled-components';

import LoadingSpinner from 'components/LoadingSpinner';

const Container = styled.div`
  flex: 1;
  z-index: 0; // establish stacking context for pages (so Overlay is always on top)

  display: flex;
`;

const StyledLoadingSpinner = styled(LoadingSpinner)`
  margin-right: 10px;
`;

const LoadingMessage = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 40%;

  color: #ffcf40;
  font-family: 'Playfair Display', serif;
  letter-spacing: 0.5px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 27px;
`;
const Loading = ({ className }) => (
  <Container>
    <LoadingMessage>
      <StyledLoadingSpinner /> Loading
    </LoadingMessage>
  </Container>
);

export default Loading;
