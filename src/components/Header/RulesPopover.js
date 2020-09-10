import React from 'react';
import styled from 'styled-components';

import Overlay from 'components/Overlay';
import Die from 'components/BankedDie';

const H2 = styled.h2`
  font-family: Limelight;
  font-size: 3em;
  text-transform: uppercase;

  margin-bottom: 20px;
  color: rgb(180, 176, 85);

  &:first-child {
    margin-top: 0;
  }
`;

const P = styled.p`
  color: white;
  max-width: 700px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: Palatino;
  font-size: 1.1em;
`;

const ScoreDemo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 30px;

  padding-left: 10px;
  padding-right: 10px;

  color: #fff;

  font-family: Palatino;
  font-size: 1.1em;
`;

const Dice = styled.div`
  display: grid;
  grid-template-areas:
    'a b c'
    'd e f';
`;

const CustomDie = styled(Die)`
  // if one die, put it in middle of grid row
  &:nth-child(1):last-child {
    grid-area: b;
    background-color: red;
  }
`;

const RulesPopover = ({ hideRules }) => {
  return (
    <Overlay closeButton hide={hideRules}>
      <H2>Rules</H2>
      <P>A game for 2 or more players, using 6 dice.</P>
      <P>Object is to score exactly 10,000.</P>
      <P>
        When it is your turn, throw the dice and bank at least one scoring die.
        Either stick with the score, or throw the remaining unbanked dice again.
      </P>
      <P>
        If your throw contains no scoring dice, you have "blapped" - your turn
        immediately ends with a score of 0.
      </P>
      <P>If you've banked all six dice, you can rethrow them all again.</P>
      <P>
        If you've banked 5 dice, you may throw the 6th die twice, aiming to roll
        a scoring value (1 or 5). If you succeed, add its score (100 or 50) to
        your turn score so far, and then double the total. If you don't score
        having thrown once, you must throw a second time - you can't at that
        point choose to stick.
      </P>
      <P>
        If you overshoot 10,000, you return to your previous score (before that
        turn started).
      </P>

      <H2>Scoring Dice</H2>
      <P>
        (N.B. a scoring group must be made up of dice from one throw: dice from
        separate throws can't be grouped together)
      </P>
      <ScoreDemo>
        <Dice>
          <CustomDie id={5} key={5} value={5} />
        </Dice>
        50
      </ScoreDemo>
      <ScoreDemo>
        <Dice>
          <CustomDie id={1} key={1} value={1} />
        </Dice>
        100
      </ScoreDemo>
      <ScoreDemo>
        <Dice>
          <CustomDie id={1} key={1} value={2} />
          <CustomDie id={2} key={2} value={2} />
          <CustomDie id={3} key={3} value={2} />
        </Dice>
        Three of a kind = that number in 100s, e.g. three 2s = 200. Except three
        1s is 1000.
      </ScoreDemo>
      <ScoreDemo>
        <Dice>
          <CustomDie id={1} key={1} value={2} />
          <CustomDie id={4} key={4} value={4} />
          <CustomDie id={5} key={5} value={5} />
          <CustomDie id={2} key={2} value={2} />
          <CustomDie id={3} key={3} value={4} />
          <CustomDie id={6} key={6} value={5} />
        </Dice>
        Three pairs = 1000
      </ScoreDemo>
      <ScoreDemo>
        <Dice>
          <CustomDie id={1} key={1} value={1} />
          <CustomDie id={2} key={2} value={2} />
          <CustomDie id={3} key={3} value={3} />
          <CustomDie id={4} key={4} value={4} />
          <CustomDie id={5} key={5} value={5} />
          <CustomDie id={6} key={6} value={6} />
        </Dice>
        Sequence of 1 to 6 = 1500
      </ScoreDemo>
      <ScoreDemo>
        <Dice>
          <CustomDie id={1} key={1} value={4} />
          <CustomDie id={2} key={2} value={4} />
          <CustomDie id={3} key={3} value={4} />
          <CustomDie id={4} key={4} value={4} />
          <CustomDie id={5} key={5} value={4} />
          <CustomDie id={6} key={6} value={4} />
        </Dice>
        Six of any number - you win the game!
      </ScoreDemo>
    </Overlay>
  );
};

export default RulesPopover;
