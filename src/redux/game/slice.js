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
    users: undefined,
    startedAt: undefined,

    scores: undefined,
  },
  reducers: {
    gameUpdated(state, action) {
      const { payload } = action;
      state.gameCode = payload.code;
      state.gameCreator = payload.gameCreator;
      state.users = payload.users;
      state.startedAt = payload.startedAt;

      state.scores = payload.scores;
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
