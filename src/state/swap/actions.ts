import { createAction } from '@reduxjs/toolkit';
import { Token } from '../token/types';

export const setFromToken = createAction<{token: Token}>('swap/setFromToken');
export const setFromTokenAmount = createAction<{amount: number}>('swap/setFromTokenAmount');

export const setToToken = createAction<{token: Token}>('swap/setToToken');
export const setToTokenAmount = createAction<{amount: number}>('swap/setToTokenAmount');

export const switchFromToTokens = createAction<void>('swap/switchFromToTokens');
