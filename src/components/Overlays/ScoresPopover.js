import React from 'react';
import styled from 'styled-components';

import Overlay from 'components/Overlay';
import ScoresTable from 'components/ScoresTable';

const TableContainer = styled.div`
  flex: 0;
  align-self: stretch;

  overflow-x: scroll;

  padding-left: 15px;
  padding-right: 15px; // doesnt do anything when overflowing-x (narrow screens)

  margin-bottom: 30px;
`;

const ScoresPopover = ({ hideScores }) => (
  <Overlay closeButton hide={hideScores}>
    <TableContainer>
      <ScoresTable />
    </TableContainer>
  </Overlay>
);

export default ScoresPopover;
