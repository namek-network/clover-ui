import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';

import application from './application/reducer';
import settings from './settings/reducer';
import token from './token/reducer';
import wallet from './wallet/reducer';
import api from './api/reducer'
import swap from './swap/reducer'
import pool from './pool/reducer'

// states that are auto persisted to localstorage and reloade
const PERSISTED_KEYS: string[] = ['application', 'settings'];

const store = configureStore({
  reducer: {
    application,
    settings,
    token,
    wallet,
    api,
    swap,
    pool
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
