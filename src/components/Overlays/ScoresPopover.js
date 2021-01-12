import React, { useEffect } from 'react';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/analytics';

import Overlay from 'components/Overlay';
import ScoresTable from 'components/ScoresTable';

const TableContainer = styled.div`
  flex: 0;
  align-self: stretch;

  overflow-x: auto;

  padding-left: 15px;
  padding-right: 15px; // doesnt do anything when overflowing-x (narrow screens)

  margin-bottom: 30px;
`;

const ScoresPopover = ({ hideScores }) => {
  useEffect(() => {
    firebase.analytics().logEvent('opened_scores'); // TODO should be page tracking instead
  }, []);

  return (
    <Overlay closeButton hide={hideScores}>
      <TableContainer>
        <ScoresTable />
      </TableContainer>
    </Overlay>
  );
};

export default ScoresPopover;
