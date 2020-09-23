import _ from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import { userPoolPairItems, chainPoolPairItems } from './actions';
import { PoolState } from './types';

const initialState: PoolState = {
  userPoolPairItems: [],
  chainPoolPairItems: []
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
);
  