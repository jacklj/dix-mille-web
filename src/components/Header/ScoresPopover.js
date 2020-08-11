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
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;

  background-color: rgba(10, 10, 10, 0.8);
  overflow: scroll; // scroll in both x and y directions if necessary
`;

// InnerContainer mainly for padding, as bottom padding doesnt work on some browsers when `overflow: scroll`
const InnerContainer = styled.div`
  margin-left: auto;
  margin-right: auto;

  padding-top: 40px;
  padding-bottom: 40px;

  // so content doesn't go under the notch on notched phones
  padding-left: max(env(safe-area-inset-left), 20px);
  padding-right: max(
    env(safe-area-inset-right),
    30px
  ); // some of the padding is cut off for some reason. Probably this:
  // When overflowing on x axis, some right padding is cut off ("overscrollback")
  // https://web.archive.org/web/20170707053030/http://www.brunildo.org/test/overscrollback.html)
  // ~~Need to set margins on children instead~~ doesn't stop the problem

  display: table; // stops the table overflowing from this container (don't know why it's doing this)
`;

const CustomScoresTable = styled(ScoresTable)`
  margin-left: auto;
  margin-right: auto;
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
        <CustomScoresTable />
      </InnerContainer>
    </Container>
  );
};

export default ScoresPopover;
