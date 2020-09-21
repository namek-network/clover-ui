import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react'
import { CurrencyPair, TokenType } from './types';
import { AppState } from '../index';
import { currencyPairs, tokenTypes } from './actions';

export function useTokenTypes(): TokenType[] {
  return useSelector((state: AppState) => state.token.tokenTypes)
}

export function useTokenTypesUpdate(): (types: TokenType[]) => void {
  const dispatch = useDispatch()
  return useCallback((types: TokenType[]) => dispatch(tokenTypes({types})), [dispatch])
}

export function useCurrencyPair(): CurrencyPair[] {
  return useSelector((state: AppState) => state.token.currencyPairs)
}

export function useCurrencyPairUpdate(): (pairs: CurrencyPair[]) => void {
  const dispatch = useDispatch()
  return useCallback((pairs: CurrencyPair[]) => dispatch(currencyPairs({pairs})), [dispatch])
}