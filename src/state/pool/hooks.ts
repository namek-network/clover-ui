import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { userPoolPairItems, chainPoolPairItems, transState } from './actions';
import { AppState } from '../index';
import { PoolPairItem, TransState } from './types'

export function useUserPoolPairItems(): PoolPairItem[] {
  return useSelector((state: AppState) => state.pool.userPoolPairItems);
}

export function useChainPoolPairItems(): PoolPairItem[] {
  return useSelector((state: AppState) => state.pool.chainPoolPairItems);
}

export function useTransState(): TransState {
  return useSelector((state: AppState) => state.pool.transState);
}

export function useUserPoolPairItemsUpdate(): (pairs: PoolPairItem[]) => void {
  const dispatch = useDispatch();
  return useCallback((pairs: PoolPairItem[]) => dispatch(userPoolPairItems({pairs})), [dispatch]);
}

export function useChainPairItemsUpdate(): (pairs: PoolPairItem[]) => void {
  const dispatch = useDispatch();
  return useCallback((pairs: PoolPairItem[]) => dispatch(chainPoolPairItems({pairs})), [dispatch]);
}

export function useTransStateUpdate(): (stat: TransState) => void {
  const dispatch = useDispatch();
  return useCallback((stat: TransState) => dispatch(transState({stat})), [dispatch]);
}
