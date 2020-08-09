import React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useSelector } from 'react-redux';

import {
  isItMyTurn,
  selectGameId,
  selectCurrentRoll,
  selectSelectedDice,
  selectCurrentTurnId,
  selectCurrentRoundId,
  selectCurrentRollNumber,
  selectCurrentRollMinusScoringGroups,
  selectIsBlapped,
  selectCurrentTurnPlayerName,
} from 'redux/game/selectors';
import Die from 'components/Die';
import PreviousTurnOutcome from './PreviousTurnOutcome';

const Container = styled.div`
  flex-shrink: 0;
  min-height: 50px; // so when you've banked all dice, the banked dice don't go all the way
  // to the top of the page - there's still the suggestion of a dice rolling area.

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10px;
  max-width: 700px;
`;

const Text = styled.div`
  flex: none;

  font-family: Limelight;
  font-size: 2em;
  color: white;
`;

const BlapText = styled.div`
  flex: none;

  font-family: Limelight;
  font-size: 3em;
  color: #ff6961;
`;

const makePossessive = (word) => {
  if (!word) {
    return word;
  }

  const lastLetter = word[word.length - 1];

  if (lastLetter.toLowerCase() === 's') {
    return word + "'";
  } else {
    return word + "'s";
  }
};

const RolledDice = () => {
  const isMyTurn = useSelector(isItMyTurn);
  const currentTurnPlayersName = useSelector(selectCurrentTurnPlayerName);
  const gameId = useSelector(selectGameId);
  const currentRoundId = useSelector(selectCurrentRoundId);
  const currentTurnId = useSelector(selectCurrentTurnId);
  const currentRoll = useSelector(selectCurrentRoll);
  const currentRollNumber = useSelector(selectCurrentRollNumber);
  const selectedDice = useSelector(selectSelectedDice);
  const currentDiceRollMinusScoringGroups = useSelector(
    selectCurrentRollMinusScoringGroups,
  );
  const isBlapped = useSelector(selectIsBlapped);

  const hasRolled = !!currentRoll;

  const selectOrUnselectDie = async (diceId) => {
    console.log(`Clicked on dice '${diceId}'`);
    if (!isMyTurn) {
      console.warn("Can't select dice when it's not your turn");
      return;
    }

    // toggle die selected state
    const path = `games/${gameId}/rounds/${currentRoundId}/turns/${currentTurnId}/rolls/${currentRollNumber}/selectedDice`;
    await firebase
      .database()
      .ref(path)
      .update({
        [diceId]: !selectedDice?.[diceId],
      });
  };

  const turnMessage = `It's ${
    isMyTurn ? 'your' : makePossessive(currentTurnPlayersName)
  } turn!`;

  return (
    <>
      <Container>
        {currentDiceRollMinusScoringGroups &&
          Object.keys(currentDiceRollMinusScoringGroups).map((id) => (
            <Die
              id={id}
              key={id}
              value={currentRoll[id]}
              selected={selectedDice && selectedDice[id]}
              onClick={() => selectOrUnselectDie(id)}
            />
          ))}
      </Container>
      {!hasRolled ? (
        <>
          <PreviousTurnOutcome />
          <Text>{turnMessage}</Text>
        </>
      ) : null}
      {isBlapped ? <BlapText>BLAP!</BlapText> : null}
    </>
  );
};

export default RolledDice;
