import { combineReducers } from 'redux';
import authReducer from './auth/slice';
import gameReducer from './game/slice';
import avatarsReducer from './avatars/slice';
import settingsReducer from './settings/slice';

export default combineReducers({
  auth: authReducer,
  game: gameReducer,
  avatars: avatarsReducer,
  settings: settingsReducer,
});
