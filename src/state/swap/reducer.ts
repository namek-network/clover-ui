import _ from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import { setFromToken, setFromTokenAmount, setToToken, setToTokenAmount, switchFromToTokens } from './actions';
import { SwapState } from './types';
import BuiltInTokens from '../token/tokens';
import BigNum from '../../types/bigNum';

const initialState: SwapState = {
  fromToken: BuiltInTokens[0],
  toToken: BuiltInTokens[1],
  
  fromTokenAmount: BigNum.SerizableZero,
  toTokenAmount: BigNum.SerizableZero
}
  
export default createReducer(initialState, builder =>
  builder
    .addCase(setFromToken, (state, action) => {
      const { token } = action.payload;
      state.fromToken = token;
    })
    .addCase(setFromTokenAmount, (state, action) => {
      const { amount } = action.payload;
      state.fromTokenAmount = (amount == null) ? BigNum.SerizableZero : amount.toSerizableBigNum();
    })
    .addCase(setToToken, (state, action) => {
      const { token } = action.payload;
      state.toToken = token;
    })
    .addCase(setToTokenAmount, (state, action) => {
      const { amount } = action.payload;
      state.toTokenAmount = (amount == null) ? BigNum.SerizableZero : amount.toSerizableBigNum();
    }).addCase(switchFromToTokens, (state, action) => {
      const { fromToken, fromTokenAmount } = state;
      state.fromToken = state.toToken;
      state.fromTokenAmount = state.toTokenAmount;
      state.toToken = fromToken;
      state.toTokenAmount = fromTokenAmount;
    })
);
  