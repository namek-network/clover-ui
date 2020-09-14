import { createReducer } from '@reduxjs/toolkit';
import { slippageTol, transDeadline } from './actions';

export interface SettingState {
  slippageTol: number,
  transDeadline: number
}

const initialState: SettingState = {
  slippageTol: 0,
  transDeadline: 0
}

export default createReducer(initialState, builder =>
  builder
    .addCase(slippageTol, (state, action: any) => {
      state.slippageTol = action.payload
    })
    .addCase(transDeadline, (state, action: any) => {
      state.transDeadline = action.payload
    })
);
