import React, { useEffect } from 'react';
import styled from 'styled-components';
import firebase from 'firebase/app';
import 'firebase/database';
import { useSelector, useDispatch } from 'react-redux';

import { highScoresUpdated } from 'redux/highScores/slice';
import { selectHighScores } from 'redux/highScores/selectors';
import { Text } from 'components/intro';

const Table = styled.table`
  color: white;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Caption = styled.caption`
  font-family: Limelight;
  font-size: 3em;
  text-transform: uppercase;
  margin-bottom: 4px;
  color: rgb(180, 176, 85);
`;

const Th = styled.th`
  font-family: Limelight;

  padding-left: 8px;
  padding-right: 8px;

  border-bottom: 1px solid white;
  border-left: 1px solid white;
  border-right: 1px solid white;

  &:first-child {
    border-left: none;
  }

  &:last-child {
    border-right: none;
  }
`;

const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
`;

const Td = styled.td`
  border: 1px solid white;

  padding-top: 3px;
  padding-bottom: 3px;

  padding-left: 5px; // mainly for round title cells
  padding-right: 5px;

  white-space: nowrap; // prevent round title cells from wrapping

  &:first-child {
    border-left: none;
  }

  &:last-child {
    border-right: none;
  }
`;

// dummy leaderboard data
// const highScores = [
//   { player: 'Gobbort', score: 144550 },
//   { player: 'agora', score: 100000 },
//   { player: 'mandelbrot', score: 90000 },
//   { player: 'plaistow', score: 80000 },
//   { player: 'gammadamma', score: 78050 },
//   { player: 'sore spot', score: 72000 },
//   { player: 'gransford plaitlet', score: 60000 },
//   { player: 'morgon lafayette', score: 50000 },
// ];

const HighScoresTable = ({ className }) => {
  const dispatch = useDispatch();
  const highScores = useSelector(selectHighScores);

  // only subscribe to high scores table updates when the table component is mounted, otherwise
  // store historical data
  useEffect(() => {
    const highScoresRef = firebase.database().ref('highScores');
    // N.B. RealtimeDb can't do reverse order queries.
    highScoresRef
      .orderByValue()
      .limitToLast(20)
      .on('value', (snapshot) => {
        // N.B. can get a map of all values using `snapshot.val()`, but then you lose the ordering -
        // use `snapshot.forEach()` (N.B. always in ascending order - RealtimeDB doesn't support reverse
        // order queries)
        const highScores = [];
        snapshot.forEach((data) => {
          const player = data.key;
          const score = data.val();
          highScores.push({ player, score });
        });
        highScores.reverse();
        dispatch(highScoresUpdated(highScores));
      });

    return () => highScoresRef.off();
  }, [dispatch]);

  if (!highScores || highScores.length === 0) {
    return <Text>High scores loading...</Text>;
  }

  return (
    <Table className={className}>
      <Caption>High scores</Caption>
      <thead>
        <Tr>
          <Th key="Rank">Rank</Th>
          <Th key="Name">Name</Th>
          <Th key="Score">Score</Th>
        </Tr>
      </thead>
      <tbody>
        {highScores &&
          highScores.map((highScore, r) => {
            const { player, score } = highScore;
            const rank = r + 1;
            return (
              <Tr key={`${highScore.player}-${rank}`}>
                <Td key="rank">{rank}</Td>
                <Td key="name">{player}</Td>
                <Td key="score">{score}</Td>
              </Tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default HighScoresTable;
