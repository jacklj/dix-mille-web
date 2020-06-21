import React, { useState } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loggedInAndJoinedGame } from 'redux/auth/slice';

const Text = styled.div`
  color: white;
`;

const Button = styled.button`
  margin: 20px;
`;

const GameScreen = () => {
  const rollDie = (event) => {
    event.preventDefault();
    alert('rolling');
  };

  return (
    <form onSubmit={(event) => rollDie(event)}>
      <Text>Game page!</Text>

      <Button>Roll</Button>
    </form>
  );
};

export default GameScreen;
