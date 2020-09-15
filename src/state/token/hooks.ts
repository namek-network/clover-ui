import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react'
import { Token, TokenType } from './types';
import { AppState } from '../index';
import { tokenTypes } from './actions';

export function useTokens(): Token[] {
  return useSelector((state: AppState) => state.token.tokens)
}

export function useTokenBySymbols(): {[symbol: string]: Token} {
  return useSelector((state: AppState) => state.token.tokenBySymbols)
}

export function useTokenTypes(): TokenType[] {
  return useSelector((state: AppState) => state.token.tokenTypes)
}

export function useTokenTypesUpdate(): (types: TokenType[]) => void {
  const dispatch = useDispatch()
  return useCallback((types: TokenType[]) => dispatch(tokenTypes({types})), [dispatch])
}