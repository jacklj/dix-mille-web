import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';

import { selectMyAvatarUrl } from 'redux/game/selectors';
import { selectName } from 'redux/auth/selectors';

import { Button } from 'components/forms';

import ScoresTable from 'components/ScoresTable';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-color: rgba(10, 10, 10, 0.8);
  overflow: scroll-y; // scroll in both x and y directions if necessary
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
  right: 10px;

  background-color: black;
`;

const ScoresPopover = ({ hideScores }) => {

  return (
    <Container>
      <CustomButton onClick={hideScores}>Close</CustomButton>
      <InnerContainer>
        <TableContainer>
          <ScoresTable />
        </TableContainer>
      </InnerContainer>
    </Container>
  );
};

export default ScoresPopover;
