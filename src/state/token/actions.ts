import { createAction } from '@reduxjs/toolkit';
import { Token, TokenType } from './types';

// directly set supported token list
export const setTokens = createAction<{tokens: Token[]}>('token/setTokens');

// clear supported token list
export const clearTokens = createAction<void>('token/clearTokens');

export const tokenTypes = createAction<{types: TokenType[]}>('token/tokenTypes');
