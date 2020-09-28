import { createReducer } from '@reduxjs/toolkit';
import { transState } from './actions';
import { SwapState } from './types';

const initialState: SwapState = {
  transState: {
    stateText: '',
    amountText: '',
    status: ''
  }
}
  
export default createReducer(initialState, builder =>
  builder
    .addCase(transState, (state, action) => {
      const { stat } = action.payload
      state.transState = stat
    })
);
  