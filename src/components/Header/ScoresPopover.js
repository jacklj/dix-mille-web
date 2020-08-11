import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectMyAvatarUrl } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';

import { Button } from 'components/forms';
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

const ScoresPopover = ({ hideScores }) => {

  return (
    <Overlay>
      <CustomButton onClick={hideScores}>Close</CustomButton>
      <TableContainer>
        <ScoresTable />
      </TableContainer>
    </Overlay>
  );
};

export default ScoresPopover;
