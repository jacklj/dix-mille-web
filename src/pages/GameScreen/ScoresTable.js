import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import {
  selectPlayerNamesInTurnOrder,
  selectAllTurnScores,
  selectTotalScores,
} from 'redux/game/selectors';

const Table = styled.table`
  color: white;
  border: 1px solid white;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;

const Th = styled.th`
  border: 1px solid white;
`;

const Td = styled.td`
  border: 1px solid white;
`;

const ScoresTable = () => {
  const players = useSelector(selectPlayerNamesInTurnOrder);
  const turnScores = useSelector(selectAllTurnScores);
  const totalScores = useSelector(selectTotalScores);

  return (
    <Table>
      <caption>Scores</caption>
      <thead>
        <tr>
          <Th key="empty"></Th>
          {players && players.map((name) => <Th key={name}>{name}</Th>)}
        </tr>
      </thead>
      <tbody>
        {turnScores &&
          turnScores.map((round, r) => (
            <tr key={`round${r}`}>
              <Td key={`round${r}.title`}>Round {r + 1}</Td>
              {round.map((turnScore, t) => (
                <Td key={`round${r}.turn${t}`}>{turnScore}</Td>
              ))}
            </tr>
          ))}
        {totalScores && (
          <tr key="totals">
            <Td key="totals.title">Totals</Td>
            {totalScores.map((totalScore, t) => (
              <Td key={`totals.turn${t}`}>{totalScore}</Td>
            ))}
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ScoresTable;
