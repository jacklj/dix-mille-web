import React from 'react';
import { useSelector } from 'react-redux';

import {
  selectHasSomeoneWon,
  selectIsSinglePlayerGame,
} from 'redux/game/selectors';
import WhoWonTextDumb from './WhoWonTextDumb';

// dummy data
// const hasSomeoneWon = {
//   didIWin: false,
//   winnersName: 'Granchester Mike',
// };
// const isSinglePlayerGame = false;

const WhoWonText = () => {
  const hasSomeoneWon = useSelector(selectHasSomeoneWon);
  const isSinglePlayerGame = useSelector(selectIsSinglePlayerGame);
  const { didIWin } = hasSomeoneWon;

  let message;
  if (isSinglePlayerGame) {
    message = 'The End.';
  } else {
    message = `${didIWin ? 'You' : hasSomeoneWon.winnersName} won!`;
  }

  const didIWinOrSinglePlayer = isSinglePlayerGame || didIWin;

  return <WhoWonTextDumb didIWin={didIWinOrSinglePlayer} message={message} />;
};

export default WhoWonText;
