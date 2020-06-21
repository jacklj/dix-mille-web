import { createSlice } from '@reduxjs/toolkit';

import {
  loggedInAndCreatedGame,
  loggedInAndJoinedGame,
} from 'redux/auth/slice';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    gameId: undefined,
    gameCode: undefined,
    gameCreator: undefined,
    players: undefined,
    startedAt: undefined,
    currentRound: undefined,
    currentTurn: undefined,
    playerTurnOrder: undefined,
    rounds: undefined,
  },
  reducers: {
    gameUpdated(state, action) {
      const { payload } = action;
      state.gameCode = payload.code;
      state.gameCreator = payload.gameCreator;
      state.players = payload.players;
      state.startedAt = payload.startedAt;
      state.currentRound = payload.currentRound;
      state.currentTurn = payload.currentTurn;
      state.playerTurnOrder = payload.playerTurnOrder;
      state.rounds = payload.rounds;
    },
  },
  extraReducers: {
    [loggedInAndCreatedGame]: (state, action) => {
      const { gameId, gameCode } = action.payload;

      // N.B. seems mutable but isnt, due to immer.js
      state.gameId = gameId;
      state.gameCode = gameCode;
    },
    [loggedInAndJoinedGame]: (state, action) => {
      const { gameId, gameCode } = action.payload;

      // N.B. seems mutable but isnt, due to immer.js
      state.gameId = gameId;
      state.gameCode = gameCode;
    },
  },
});

export const { gameUpdated } = gameSlice.actions;

export default gameSlice.reducer;
