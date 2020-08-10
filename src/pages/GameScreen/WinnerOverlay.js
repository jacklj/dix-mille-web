import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectHasSomeoneWon } from 'redux/game/selectors';
import ScoresTable from './ScoresTable';
import { Button } from 'components/forms';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  background-color: rgba(10, 10, 10, 0.7);
  overflow-y: scroll;
`;

const ScrollContainer = styled.div`
  position: static;

  display: flex;
  flex-direction: column;
  padding-top: 100px;
  padding-bottom: 50px;
  align-items: center;
`;

const WinnerText = styled.div`
  color: #77dd77;
  font-size: 3em;
  margin-bottom: 40px;
`;

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
        <ScrollContainer>
          <WinnerText>{`${
            hasSomeoneWon.didIWin ? 'You' : hasSomeoneWon.winnersName
          } won!`}</WinnerText>
          <ScoresTable />
          <Button onClick={goBackToHomePage}>Play again</Button>
        </ScrollContainer>
      </Container>
    );
  }
};

export default WinnerOverlay;
