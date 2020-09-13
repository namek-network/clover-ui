import _ from 'lodash';
import { createReducer } from '@reduxjs/toolkit';
import { setTokens, clearTokens } from './actions';
import { Token, TokenState } from './types';

const Dot: Token = { symbol: 'Dot', logo: require('../../assets/images/icon-dot.svg') };
const Beth: Token = { symbol: 'Beth', logo: require('../../assets/images/icon-beth.svg') };
const Busd: Token = { symbol: 'Busd', logo: require('../../assets/images/icon-busd.svg') };
const Bxb: Token = { symbol: 'Bxb', logo: require('../../assets/images/icon-bxb.svg') };

const builtinTokens = [Dot, Beth, Busd, Bxb];

const initialState: TokenState = {
  tokens: builtinTokens,
  tokenBySymbols: _.keyBy(builtinTokens, 'symbol')
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
);
  