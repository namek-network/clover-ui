import { createReducer } from '@reduxjs/toolkit';
import { slippageTol, transDeadline, darkMode } from './actions';

export interface SettingState {
  slippageTol: number,
  transDeadline: number,
  darkMode: boolean
}

const initialState: SettingState = {
  slippageTol: 50, // default to 0.5%
  transDeadline: 0,
  darkMode: false
}

export default createReducer(initialState, builder =>
  builder
    .addCase(slippageTol, (state, action) => {
      state.slippageTol = action.payload
    })
    .addCase(transDeadline, (state, action) => {
      state.transDeadline = action.payload
    })
    .addCase(darkMode, (state, action) => {
      state.darkMode = action.payload
    })
);
