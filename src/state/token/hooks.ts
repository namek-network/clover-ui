import { useSelector } from 'react-redux';
import { Token } from './types';
import { AppState } from '../index';

export function useTokens(): Token[] {
  return useSelector((state: AppState) => state.token.tokens)
}

export function useTokenBySymbols(): {[symbol: string]: Token} {
  return useSelector((state: AppState) => state.token.tokenBySymbols)
}
