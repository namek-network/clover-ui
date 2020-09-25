import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { transState } from './actions';
import { AppState } from '../index';
import { SwapTransState } from './types'

export function useSwapTransState(): SwapTransState {
  return useSelector((state: AppState) => state.swap.transState);
}

export function useSwapTransStateUpdate(): (stat: SwapTransState) => void {
  const dispatch = useDispatch();
  return useCallback((stat: SwapTransState) => dispatch(transState({stat})), [dispatch]);
}
