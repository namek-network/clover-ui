import { createAction } from '@reduxjs/toolkit';
import { TokenType } from './types';

export const tokenTypes = createAction<{types: TokenType[]}>('token/tokenTypes');

export const clearTokenTypes = createAction<void>('token/clearTokenTypes');
