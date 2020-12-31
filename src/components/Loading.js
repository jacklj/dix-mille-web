import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;

  z-index: 0; // establish stacking context for pages (so Overlay is always on top)

  display: flex;
`;

const LoadingMessage = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 30%;
`;
const Loading = ({ className }) => (
  <Container>
    <LoadingMessage>Loading...</LoadingMessage>
  </Container>
);

export default Loading;
