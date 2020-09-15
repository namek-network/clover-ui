import _ from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import { setTokens, clearTokens, tokenTypes } from './actions';
import { TokenState, TokenType } from './types';
import BuiltInTokens from './tokens';

// const Dot: Token = { symbol: 'Dot', logo: require('../../assets/images/icon-dot.svg') };
// const Beth: Token = { symbol: 'Beth', logo: require('../../assets/images/icon-beth.svg') };
// const Busd: Token = { symbol: 'Busd', logo: require('../../assets/images/icon-busd.svg') };
// const Bxb: Token = { symbol: 'Bxb', logo: require('../../assets/images/icon-bxb.svg') };

// const builtinTokens = [Dot, Beth, Busd, Bxb];

const initialState: TokenState = {
  tokens: BuiltInTokens,
  tokenBySymbols: _.keyBy(BuiltInTokens, 'symbol'),
  tokenTypes: []
}
  
export default createReducer(initialState, builder =>
  builder
    .addCase(setTokens, (state, action) => {
      const { tokens } = action.payload;
      state.tokens = tokens || [];
      state.tokenBySymbols = _.keyBy(tokens || [], 'symbol');
    })
    .addCase(clearTokens, (state, action) => {
      state.tokens = [];
      state.tokenBySymbols = {};
    })
    .addCase(tokenTypes, (state, action) => {
      const {types} = action.payload;
      state.tokenTypes = types || [];
    })
);
  