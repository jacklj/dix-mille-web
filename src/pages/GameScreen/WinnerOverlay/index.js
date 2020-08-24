import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';

import ScoresTable from 'components/ScoresTable';
import { Button } from 'components/forms';
import Overlay from 'components/Overlay';
import { selectHasSomeoneWon } from 'redux/game/selectors';
import WinnerText from './WinnerText';
import { selectIsSoundOn } from 'redux/settings/selectors';
import winMusic from 'media/sounds/winMusic.mp3';
import loseMusic from 'media/sounds/loseMusic.mp3';

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

  const isSoundOn = useSelector(selectIsSoundOn);

  const [playWinMusic] = useSound(winMusic, {
    soundEnabled: isSoundOn,
  });
  const [playLoseMusic] = useSound(loseMusic, {
    soundEnabled: isSoundOn,
  });

  const previousHasSomeoneWon = useRef(hasSomeoneWon);
  useEffect(() => {
    if (!previousHasSomeoneWon.current && hasSomeoneWon) {
      if (hasSomeoneWon.didIWin) {
        playWinMusic();
      } else {
        playLoseMusic();
      }
    }
    previousHasSomeoneWon.current = hasSomeoneWon;
  }, [hasSomeoneWon, playLoseMusic, playWinMusic]);

  if (!hasSomeoneWon) {
    return null;
  } else {
    return (
      <Overlay>
        <WinnerText />
        <TableContainer>
          <ScoresTable />
        </TableContainer>
        <Button onClick={goBackToHomePage}>Play again</Button>
      </Overlay>
    );
  }
};

export default WinnerOverlay;
