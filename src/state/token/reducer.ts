import { createReducer } from '@reduxjs/toolkit';
import { tokenTypes, clearTokenTypes, currencyPairs } from './actions';
import { TokenState } from './types';

const initialState: TokenState = {
  tokenTypes: [],
  currencyPairs: []
}
  
export default createReducer(initialState, builder =>
  builder
    .addCase(tokenTypes, (state, action) => {
      const {types} = action.payload;
      state.tokenTypes = types || [];
    })
    .addCase(clearTokenTypes, (state) => {
      state.tokenTypes = [];
    })
    .addCase(currencyPairs, (state, action) => {
      const { pairs} = action.payload
      state.currencyPairs = pairs;
    })
);
  