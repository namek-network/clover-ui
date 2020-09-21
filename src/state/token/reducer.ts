import { createReducer } from '@reduxjs/toolkit';
import { tokenTypes, clearTokenTypes } from './actions';
import { TokenState } from './types';
import BuiltInTokens from './tokens';

const initialState: TokenState = {
  tokenTypes: BuiltInTokens
}
  
export default createReducer(initialState, builder =>
  builder
    .addCase(tokenTypes, (state, action) => {
      const {types} = action.payload;
      state.tokenTypes = types || [];
    })
    .addCase(clearTokenTypes, (state, action) => {
      state.tokenTypes = [];
    })
);
  