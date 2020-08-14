import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ScoresTable from 'components/ScoresTable';
import { Button } from 'components/forms';
import Overlay from 'components/Overlay';
import { selectHasSomeoneWon } from 'redux/game/selectors';
import WinnerText from './WinnerText';

const TableContainer = styled.div`
  flex: 0;
  align-self: stretch;

  overflow-x: scroll;

  padding-left: 15px;
  padding-right: 15px; // doesnt do anything when overflowing-x (narrow screens)

  margin-bottom: 30px;
`;

// dummy data
// const hasSomeoneWon = {
//   didIWin: true,
// };

const WinnerOverlay = () => {
  const history = useHistory();
  const hasSomeoneWon = useSelector(selectHasSomeoneWon);

  const goBackToHomePage = () => {
    history.push('/');
    // todo unsubscribe from game subscriptions, clear store
  };

  if (!hasSomeoneWon) {
    return null;
  } else {
    return (
      <Overlay>
        <WinnerText />
        <Button onClick={goBackToHomePage}>Play again</Button>
      </Overlay>
    );
  }
};

export default WinnerOverlay;
