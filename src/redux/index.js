import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import storage from 'redux-persist/lib/storage/session'; // session storage - each open tab is a separate session https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage

import authReducer from './auth/slice';
import gameReducer from './game/slice';
import avatarsReducer from './avatars/slice';
import settingsReducer from './settings/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
  avatars: avatarsReducer,
  settings: settingsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
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
