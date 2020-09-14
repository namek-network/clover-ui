import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';

import application from './application/reducer';
import settings from './settings/reducer';
import token from './token/reducer';
import swap from './swap/reducer';

const PERSISTED_KEYS: string[] = [];

const store = configureStore({
  reducer: {
    application,
    settings,
    token,
    swap
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
