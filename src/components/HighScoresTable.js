import React from 'react';
import styled from 'styled-components';
// import { useSelector } from 'react-redux';

// import { selectTotalScores } from 'redux/game/selectors';

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
const highScores = [
  { player: 'Gobbort', score: 144550 },
  { player: 'agora', score: 100000 },
  { player: 'mandelbrot', score: 90000 },
  { player: 'plaistow', score: 80000 },
  { player: 'gammadamma', score: 78050 },
  { player: 'sore spot', score: 72000 },
  { player: 'gransford plaitlet', score: 60000 },
  { player: 'morgon lafayette', score: 50000 },
];

const HighScoresTable = ({ className }) => {
  // const highScores = useSelector(selectHighScores);

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
