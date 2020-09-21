import { createAction } from '@reduxjs/toolkit';
import { CurrencyPair, TokenType } from './types';

export const tokenTypes = createAction<{types: TokenType[]}>('token/tokenTypes');

export const clearTokenTypes = createAction<void>('token/clearTokenTypes');

export const currencyPairs = createAction<{pairs: CurrencyPair[]}>('token/currencyPairs');
