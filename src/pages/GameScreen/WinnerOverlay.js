import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ScoresTable from 'components/ScoresTable';
import { Button } from 'components/forms';
import Overlay from 'components/Overlay';
import { selectHasSomeoneWon } from 'redux/game/selectors';

const WinnerText = styled.div`
  color: #77dd77;
  font-size: 3em;
  margin-bottom: 40px;
`;

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

  useEffect(() => {
    if (hasSomeoneWon) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [hasSomeoneWon]);

  const goBackToHomePage = () => {
    history.push('/');
    // todo unsubscribe from game subscriptions, clear store
  };

  if (!hasSomeoneWon) {
    return null;
  } else {
    return (
      <Overlay>
        <WinnerText>{`${
          hasSomeoneWon.didIWin ? 'You' : hasSomeoneWon.winnersName
        } won!`}</WinnerText>
        <TableContainer>
          <ScoresTable />
        </TableContainer>
        <Button onClick={goBackToHomePage}>Play again</Button>
      </Overlay>
    );
  }
};

export default WinnerOverlay;
