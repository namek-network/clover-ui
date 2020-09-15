import { createAction } from '@reduxjs/toolkit';
import { TokenType } from '../token/types';

export const setFromToken = createAction<{token: TokenType}>('swap/setFromToken');
export const setFromTokenAmount = createAction<{amount: number}>('swap/setFromTokenAmount');

export const setToToken = createAction<{token: TokenType}>('swap/setToToken');
export const setToTokenAmount = createAction<{amount: number}>('swap/setToTokenAmount');

export const switchFromToTokens = createAction<void>('swap/switchFromToTokens');
