import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    isSoundOn: true,
  },
  reducers: {
    soundOn(state, action) {
      state.isSoundOn = true;
    },
    soundOff(state, action) {
      state.isSoundOn = false;
    },
  },
});

export const { soundOn, soundOff } = settingsSlice.actions;

export default settingsSlice.reducer;
