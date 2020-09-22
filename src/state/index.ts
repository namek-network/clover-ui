import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';

import application from './application/reducer';
import settings from './settings/reducer';
import token from './token/reducer';
import wallet from './wallet/reducer';
import api from './api/reducer'

const PERSISTED_KEYS: string[] = [];

const store = configureStore({
  reducer: {
    application,
    settings,
    token,
    wallet,
    api
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })]
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
