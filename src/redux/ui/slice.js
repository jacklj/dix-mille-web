import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isShakingCupLocal: false,
  },
  reducers: {
    startedShakingCupLocal(state, action) {
      state.isShakingCupLocal = true;
    },
    stoppedShakingCupLocal(state, action) {
      state.isShakingCupLocal = false;
    },
  },
});

export const {
  startedShakingCupLocal,
  stoppedShakingCupLocal,
} = uiSlice.actions;

export default uiSlice.reducer;
