import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import {
  selectPlayersInTurnOrder,
  selectAllTurnScores,
  selectTotalScores,
} from 'redux/game/selectors';

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

  // vertical-align: middle;
`;

const ThInnerContainer = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  padding-bottom: 5px;
`;

const ProfileImage = styled.img`
  height: 30px;
  width: auto;
  display: inline-block;
  margin-right: 6px;
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

// dummy scores data
// const players = [
//   'agora',
//   'mandelbrot',
//   'plaistow',
//   'gammadamma',
//   'sore spot',
//   'gransford plaitlet',
//   'morgon lafayette',
// ];
// const turnScores = [
//   [540, 840, 350, 250, 400, 300, 200],
//   [540, 840, 350, 250, 400, 300, 200],
//   [540, 840, 350, 250, 400, 300, 200],
//   [540, 840, 350, 250, 400, 300, 200],
// ];
// const totalScores = [3908, 4089, 3094, 2234, 4000, 3000, 2000];

const ScoresTable = ({ className }) => {
  const players = useSelector(selectPlayersInTurnOrder);
  const turnScores = useSelector(selectAllTurnScores);
  const totalScores = useSelector(selectTotalScores);

  return (
    <Table className={className}>
      <Caption>Scores</Caption>
      <thead>
        <Tr>
          <Th key="empty"></Th>
          {players &&
            players.map((player) => (
              <Th key={player.uid}>
                <ThInnerContainer>
                  <ProfileImage src={player.avatarUrl} title="User's avatar" />
                  <span>{player.name}</span>
                </ThInnerContainer>
              </Th>
            ))}
        </Tr>
      </thead>
      <tbody>
        {turnScores &&
          turnScores.map((round, r) => (
            <Tr key={`round${r}`}>
              <Td key={`round${r}.title`}>Round {r + 1}</Td>
              {round.map((turnScore, t) => (
                <Td key={`round${r}.turn${t}`}>{turnScore}</Td>
              ))}
            </Tr>
          ))}
        {totalScores && (
          <Tr key="totals">
            <Td key="totals.title">Totals</Td>
            {totalScores.map((totalScore, t) => (
              <Td key={`totals.turn${t}`}>{totalScore}</Td>
            ))}
          </Tr>
        )}
      </tbody>
    </Table>
  );
};

export default ScoresTable;
