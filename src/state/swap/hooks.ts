import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setFromToken, setFromTokenAmount, setToToken, setToTokenAmount, switchFromToTokens } from './actions';
import { Token } from '../token/types';

import { AppState } from '../index';

export function useFromToken(): Token | undefined {
  return useSelector((state: AppState) => state.swap.fromToken);
}

export function useFromTokenAmount(): number | undefined {
  return useSelector((state: AppState) => state.swap.fromTokenAmount);
}

export function useToToken(): Token | undefined {
  return useSelector((state: AppState) => state.swap.toToken);
}

export function useToTokenAmount(): number | undefined {
  return useSelector((state: AppState) => state.swap.toTokenAmount);
}

export function useSetFromToken(): (token: Token) => void {
  const dispatch = useDispatch();
  return useCallback((token: Token) => dispatch(setFromToken({token})), [dispatch]);
}

export function useSetToToken(): (token: Token) => void {
  const dispatch = useDispatch();
  return useCallback((token: Token) => dispatch(setToToken({token})), [dispatch]);
}

export function useSwitchFromToTokens(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(switchFromToTokens()), [dispatch]);
}
