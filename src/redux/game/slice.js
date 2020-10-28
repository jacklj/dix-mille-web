import { createSlice } from '@reduxjs/toolkit';

import {
  loggedInAndCreatedGame,
  loggedInAndJoinedGame,
} from 'redux/auth/slice';

import { userHasLeftGame } from './moreActions';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    gameId: undefined,
    gameType: undefined,
    gameCode: undefined,
    gameCreator: undefined,
    players: undefined,
    startedAt: undefined,
    currentRound: undefined,
    currentTurn: undefined,
    currentRoll: undefined,
    playerTurnOrder: undefined,
    rounds: undefined,
    winner: undefined,
  },
  reducers: {
    gameUpdated(state, action) {
      const { payload } = action;
      state.gameType = payload.gameType;
      state.gameCode = payload.code;
      state.gameCreator = payload.gameCreator;
      state.players = payload.players;
      state.startedAt = payload.startedAt;
      state.currentRound = payload.currentRound;
      state.currentTurn = payload.currentTurn;
      state.currentRoll = payload.currentRoll;
      state.playerTurnOrder = payload.playerTurnOrder;
      state.rounds = payload.rounds;
      state.winner = payload.winner;
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
    [userHasLeftGame]: (state) => {
      state.gameId = undefined;
      state.gameType = undefined;
      state.gameCode = undefined;
      state.gameCreator = undefined;
      state.players = undefined;
      state.startedAt = undefined;
      state.currentRound = undefined;
      state.currentTurn = undefined;
      state.currentRoll = undefined;
      state.playerTurnOrder = undefined;
      state.rounds = undefined;
      state.winner = undefined;
    },
  },
});

export const { gameUpdated } = gameSlice.actions;

export default gameSlice.reducer;
