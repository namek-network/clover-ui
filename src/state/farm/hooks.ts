import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { stakePoolItems } from './actions';
import { AppState } from '../index';
import { StakePoolItem } from '../token/types'

export function useStakePoolItems(): StakePoolItem[]|undefined {
  return useSelector((state: AppState) => state.farm.stakePoolItems);
}

export function useStakePoolItemsUpdate(): (items: StakePoolItem[]) => void {
  const dispatch = useDispatch();
  return useCallback((items: StakePoolItem[]) => dispatch(stakePoolItems({items})), [dispatch]);
}
