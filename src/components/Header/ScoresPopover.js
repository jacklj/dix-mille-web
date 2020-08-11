import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectName, selectUid } from 'redux/auth/selectors';

import Overlay from 'components/Overlay';
import ScoresTable from 'components/ScoresTable';
import PlayerProfile from 'components/PlayerProfile';

const TableContainer = styled.div`
  flex: 0;
  align-self: stretch;

  overflow-x: scroll;

  padding-left: 15px;
  padding-right: 15px; // doesnt do anything when overflowing-x (narrow screens)

  margin-bottom: 30px;
`;

const H2 = styled.h2`
  font-family: Limelight;
  font-size: 3em;
  text-transform: uppercase;
  margin-bottom: 4px;
  color: rgb(180, 176, 85);
`;

const ScoresPopover = ({ hideScores }) => {
  const name = useSelector(selectName);
  const uid = useSelector(selectUid);

  return (
    <Overlay closeButton hide={hideScores}>
      <TableContainer>
        <ScoresTable />
      </TableContainer>
      {name && (
        <>
          <H2>Me</H2>
          <PlayerProfile uid={uid} />
        </>
      )}
    </Overlay>
  );
};

export default ScoresPopover;
