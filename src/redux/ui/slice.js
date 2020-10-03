import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isShakingCupLocal: false,
    isRollDiceCloudFunctionRunning: false,
  },
  reducers: {
    startedShakingCupLocal(state, action) {
      state.isShakingCupLocal = true;
      state.isRollDiceCloudFunctionRunning = true;
    },
    stoppedShakingCupLocal(state, action) {
      state.isShakingCupLocal = false;
    },
    rollDiceCloudFunctionReturned(state, action) {
      state.isRollDiceCloudFunctionRunning = false;
      // N.B. we have this flag to prevent the race condition where the user starts and stops pressing locally
      // before the frontend receives isRollingCloud: true. In this case, the isRollingOverall selector flag
      // goes from true to false to true to false. i.e.:
      // false --isRollingLocalDown--> true --isRollingLocalUp--> false --isRollingCloudDown--> true --isRollingCloudUp--> false
      // Hopefully, the event "rollDiceCloudFunctionReturned" guarantees that the `isRollingCloud: true`
      // state update will have already been received.
      //
      // If not, will need more stateful logic in this reducer:
      // - the onPressLocal also sends the id of the current roll (when pressed)
      // - the reducer remembers it
      // - the reducer waits for the game update with the new roll (or for the server to return with an error)
      // - then it sets isWaitingForCloudRollFlagToBeReceived to false
      // - this only matters if it's your turn - otherwise the selector ignores this stuff.
    },
  },
});

export const {
  startedShakingCupLocal,
  stoppedShakingCupLocal,
  rollDiceCloudFunctionReturned,
} = uiSlice.actions;

export default uiSlice.reducer;
