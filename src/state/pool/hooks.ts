import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { userPoolPairItems, chainPoolPairItems } from './actions';
import { AppState } from '../index';
import { PoolPairItem } from './types'

export function useUserPoolPairItems(): PoolPairItem[] {
  return useSelector((state: AppState) => state.pool.userPoolPairItems);
}

export function useChainPoolPairItems(): PoolPairItem[] {
  return useSelector((state: AppState) => state.pool.chainPoolPairItems);
}

export function useUserPoolPairItemsUpdate(): (pairs: PoolPairItem[]) => void {
  const dispatch = useDispatch();
  return useCallback((pairs: PoolPairItem[]) => dispatch(userPoolPairItems({pairs})), [dispatch]);
}

export function useChainPairItemsUpdate(): (pairs: PoolPairItem[]) => void {
  const dispatch = useDispatch();
  return useCallback((pairs: PoolPairItem[]) => dispatch(chainPoolPairItems({pairs})), [dispatch]);
}
