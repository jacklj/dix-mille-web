import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectHasSomeoneWon } from 'redux/game/selectors';
import ScoresTable from './ScoresTable';

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

  display: flex;
  flex-direction: column;
`;

const InnerContainer = styled.div`
  margin: auto; // use flex auto margins, to center without risking content overflow

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WinnerText = styled.div`
  color: white;
  font-size: 3em;
  margin-bottom: 40px;
`;

const Green = styled.span`
  color: #77dd77;
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
    const person = hasSomeoneWon.didIWin ? 'You' : hasSomeoneWon.winnersName;

    return (
      <Container>
        <InnerContainer>
          <WinnerText>
            {person} <Green>won!</Green>
          </WinnerText>
          <ScoresTable />
          <button onClick={goBackToHomePage}>Start again</button>
        </InnerContainer>
      </Container>
    );
  }
};

export default WinnerOverlay;
