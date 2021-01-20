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

const TdInnerContainer = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;

  padding-top: 5px;
  padding-bottom: 5px;
`;

const ProfileImage = styled.img`
  height: 30px;
  width: auto;
  display: inline-block;
  margin-right: 6px;
`;

const HighScoresTable = ({ className }) => {
  const dispatch = useDispatch();
  const highScores = useSelector(selectHighScores);

  // only subscribe to high scores table updates when the table component is mounted, otherwise
  // store historical data
  useEffect(() => {
    const highScoresRef = firebase.database().ref('highScores');
    // N.B. RealtimeDb can't do reverse order queries.
    highScoresRef
      .orderByChild('score')
      .limitToLast(20)
      .on('value', (snapshot) => {
        // N.B. can get a map of all values using `snapshot.val()`, but then you lose the ordering -
        // use `snapshot.forEach()` (N.B. always in ascending order - RealtimeDB doesn't support reverse
        // order queries)
        const highScores = [];

        snapshot.forEach((data) => {
          const scoreObj = data.val();
          const { username, score, avatarId, date } = scoreObj;
          highScores.push({ username, score, avatarId, date });
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
          <Th key="Player">Player</Th>
          <Th key="Score">Score</Th>
        </Tr>
      </thead>
      <tbody>
        {highScores &&
          highScores.map((highScore, r) => {
            const { username, score, avatarUrl } = highScore;
            const rank = r + 1;
            return (
              <Tr key={`${highScore.username}-${rank}`}>
                <Td key="rank">{rank}</Td>
                <Td key="name">
                  <TdInnerContainer>
                    <ProfileImage src={avatarUrl} title="User's avatar" />
                    {username}
                  </TdInnerContainer>
                </Td>
                <Td key="score">{score}</Td>
              </Tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default HighScoresTable;
