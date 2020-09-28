import { createReducer } from '@reduxjs/toolkit';
import { userPoolPairItems, chainPoolPairItems, transState } from './actions';
import { PoolState } from './types';

const initialState: PoolState = {
  userPoolPairItems: [],
  chainPoolPairItems: [],
  transState: {
    stateText: '',
    amountText: '',
    status: ''
  }
}
  
export default createReducer(initialState, builder =>
  builder
    .addCase(userPoolPairItems, (state, action) => {
      const { pairs } = action.payload
      state.userPoolPairItems = pairs
    })
    .addCase(chainPoolPairItems, (state, action) => {
      const { pairs } = action.payload
      state.chainPoolPairItems = pairs
    })
    .addCase(transState, (state, action) => {
      const { stat } = action.payload
      state.transState = stat
    })
);
  