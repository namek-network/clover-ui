import { createAction } from '@reduxjs/toolkit';
import { TokenType } from '../token/types';
import { SerializableBigNum } from '../../types/bigNum';

export const setFromToken = createAction<{token: TokenType}>('swap/setFromToken');
export const setFromTokenAmount = createAction<{amount: SerializableBigNum}>('swap/setFromTokenAmount');

export const setToToken = createAction<{token: TokenType}>('swap/setToToken');
export const setToTokenAmount = createAction<{amount: SerializableBigNum}>('swap/setToTokenAmount');

export const switchFromToTokens = createAction<void>('swap/switchFromToTokens');
