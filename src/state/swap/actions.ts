import { createAction } from '@reduxjs/toolkit';
import { TokenType } from '../token/types';

export const setFromToken = createAction<{token: TokenType}>('swap/setFromToken');
export const setFromTokenAmount = createAction<{amount: string}>('swap/setFromTokenAmount');

export const setToToken = createAction<{token: TokenType}>('swap/setToToken');
export const setToTokenAmount = createAction<{amount: string}>('swap/setToTokenAmount');

export const switchFromToTokens = createAction<void>('swap/switchFromToTokens');
