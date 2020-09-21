import { createAction } from '@reduxjs/toolkit';
import { TokenType } from '../token/types';
import BigNum from '../../types/bigNum';

export const setFromToken = createAction<{token: TokenType}>('swap/setFromToken');
export const setFromTokenAmount = createAction<{amount: BigNum}>('swap/setFromTokenAmount');

export const setToToken = createAction<{token: TokenType}>('swap/setToToken');
export const setToTokenAmount = createAction<{amount: BigNum}>('swap/setToTokenAmount');

export const switchFromToTokens = createAction<void>('swap/switchFromToTokens');
