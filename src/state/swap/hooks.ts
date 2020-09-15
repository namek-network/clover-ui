import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setFromToken, setFromTokenAmount, setToToken, setToTokenAmount, switchFromToTokens } from './actions';
import { TokenType } from '../token/types';

import { AppState } from '../index';

export function useFromToken(): TokenType | undefined {
  return useSelector((state: AppState) => state.swap.fromToken);
}

export function useFromTokenAmount(): number | undefined {
  return useSelector((state: AppState) => state.swap.fromTokenAmount);
}

export function useToToken(): TokenType | undefined {
  return useSelector((state: AppState) => state.swap.toToken);
}

export function useToTokenAmount(): number | undefined {
  return useSelector((state: AppState) => state.swap.toTokenAmount);
}

export function useSetFromToken(): (token: TokenType) => void {
  const dispatch = useDispatch();
  return useCallback((token: TokenType) => dispatch(setFromToken({token})), [dispatch]);
}

export function useSetToToken(): (token: TokenType) => void {
  const dispatch = useDispatch();
  return useCallback((token: TokenType) => dispatch(setToToken({token})), [dispatch]);
}

export function useSwitchFromToTokens(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(switchFromToTokens()), [dispatch]);
}
