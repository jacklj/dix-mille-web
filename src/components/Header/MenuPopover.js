import React from 'react';
import styled from 'styled-components';

import Overlay from 'components/Overlay';

const H2 = styled.h2`
  font-family: Limelight;
  font-size: 3em;
  text-transform: uppercase;

  margin-bottom: 20px;
  color: rgb(180, 176, 85);

  &:first-child {
    margin-top: 0;
  }
`;

const P = styled.p`
  color: white;
  max-width: 700px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: Palatino;
  font-size: 1.1em;
`;

const MenuPopover = ({ hideMenu }) => {
  return (
    <Overlay closeButton hide={hideMenu}>
      <H2>hello</H2>
    </Overlay>
  );
};

export default MenuPopover;
