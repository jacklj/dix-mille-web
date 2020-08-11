import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import ScoresTable from 'components/ScoresTable';
import { Button } from 'components/forms';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-color: rgba(10, 10, 10, 0.9);
  overflow-y: scroll;
`;

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
      <Container>
        <InnerContainer>
          <WinnerText>{`${
            hasSomeoneWon.didIWin ? 'You' : hasSomeoneWon.winnersName
          } won!`}</WinnerText>
          <TableContainer>
            <ScoresTable />
          </TableContainer>
          <Button onClick={goBackToHomePage}>Play again</Button>
        </InnerContainer>
      </Container>
    );
  }
};

export default WinnerOverlay;
