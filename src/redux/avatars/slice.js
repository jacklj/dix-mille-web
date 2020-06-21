import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'avatars',
  initialState: {
    avatars: [],
  },
  reducers: {
    avatarsUpdated(state, action) {
      const { payload } = action;
      state.avatars = payload;
    },
  },
});

export const { avatarsUpdated } = gameSlice.actions;

export default gameSlice.reducer;
