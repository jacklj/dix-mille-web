import { combineReducers } from 'redux';
import authReducer from './auth/slice';
import gameReducer from './game/slice';

export default combineReducers({
  auth: authReducer,
  game: gameReducer,
});
