import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { default as localStorage } from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { default as sessionStorage } from 'redux-persist/lib/storage/session';

import authReducer from './auth/slice';
import gameReducer from './game/slice';
import avatarsReducer from './avatars/slice';
import highScoresReducer from './highScores/slice';
import settingsReducer from './settings/slice';
import uiReducer from './ui/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
  avatars: avatarsReducer,
  highScores: highScoresReducer,
  settings: settingsReducer,
  ui: uiReducer,
});

// session storage - each open tab is a separate session https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
const persistConfig = {
  key: 'root',
  storage:
    process.env.NODE_ENV === 'development' ? sessionStorage : localStorage,
  blacklist: ['ui', 'highScores'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // silence the non-serializable action warning caused by special redux-persist actions.
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/REHYDRATE', 'persist/PERSIST'],
    },
  }),
});

export const persistor = persistStore(store);
