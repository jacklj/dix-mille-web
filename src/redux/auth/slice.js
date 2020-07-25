import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    uid: undefined,
    name: undefined,
    avatarId: undefined,
    type: undefined, // creator or joiner?
  },
  reducers: {
    userUpdated(state, action) {
      if (!action.payload) {
        throw new Error(
          'Error in auth reducer - user data in DB was probably deleted.',
        );
      }
      const { name, avatarId, type } = action.payload;
      // N.B. createSlice wraps your function with `produce` from the `Immer` library. This means
      // you can write code that "mutates" the state inside the reducer, and Immer will safely
      // return a correct immutably updated result!
      state.name = name;
      state.type = type;
      state.avatarId = avatarId;
    },
    loggedInAndCreatedGame(state, action) {
      const { uid, type } = action.payload;
      state.uid = uid;
      state.type = type;
    },
    loggedInAndJoinedGame(state, action) {
      const { uid, type } = action.payload;
      state.uid = uid;
      state.type = type;
    },
  },
});

export const {
  loggedInAndCreatedGame,
  loggedInAndJoinedGame,
  userUpdated,
} = authSlice.actions;

export default authSlice.reducer;
