import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'avatars',
  initialState: {
    scores: [],
  },
  reducers: {
    highScoresUpdated(state, action) {
      const { payload } = action;
      state.scores = payload;
    },
  },
});

export const { highScoresUpdated } = gameSlice.actions;

export default gameSlice.reducer;
