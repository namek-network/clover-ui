import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setFromToken, setFromTokenAmount, setToToken, setToTokenAmount, switchFromToTokens } from './actions';
import { TokenType } from '../token/types';
import BigNum, { SerializableBigNum } from '../../types/bigNum';
import { AppState } from '../index';

export function useFromToken(): TokenType | undefined {
  return useSelector((state: AppState) => state.swap.fromToken);
}

export function useFromTokenAmount(): BigNum {
  return useSelector((state: AppState) => _.isEmpty(state.swap.fromTokenAmount) ? BigNum.Zero : BigNum.fromSerizableBigNum(state.swap.fromTokenAmount));
}

export function useToToken(): TokenType | undefined {
  return useSelector((state: AppState) => state.swap.toToken);
}

export function useToTokenAmount(): BigNum {
  return useSelector((state: AppState) => _.isEmpty(state.swap.toTokenAmount) ? BigNum.Zero : BigNum.fromSerizableBigNum(state.swap.toTokenAmount));
}

export function useSetFromToken(): (token: TokenType) => void {
  const dispatch = useDispatch();
  return useCallback((token: TokenType) => dispatch(setFromToken({token})), [dispatch]);
}

export function useSetFromTokenAmount(): (amount: SerializableBigNum) => void {
  const dispatch = useDispatch();
  return useCallback((amount: SerializableBigNum) => dispatch(setFromTokenAmount({amount})), [dispatch]);
}

export function useSetToToken(): (token: TokenType) => void {
  const dispatch = useDispatch();
  return useCallback((token: TokenType) => dispatch(setToToken({token})), [dispatch]);
}

export function useSetToTokenAmount(): (amount: SerializableBigNum) => void {
  const dispatch = useDispatch();
  return useCallback((amount: SerializableBigNum) => dispatch(setToTokenAmount({amount})), [dispatch]);
}

export function useSwitchFromToTokens(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(switchFromToTokens()), [dispatch]);
}
