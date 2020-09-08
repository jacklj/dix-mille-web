import styled from 'styled-components';

const ContentContainer = styled.div`
  flex: 19;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  z-index: 0; // establish stacking context for pages (so Overlay is always on top)
`;

export default ContentContainer;
