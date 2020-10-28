import { createAction } from '@reduxjs/toolkit';

// userHasLeftGame is defined outside of the game slice, so that both the game slice
// and the auth slice can import it without creating cyclic dependencies
export const userHasLeftGame = createAction('game/userHasLeftGame');
