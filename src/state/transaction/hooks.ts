import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { AppState } from '../index';
import { TransactionRecord } from './types'
import { recentTransactions } from './actions'

export function useRecentTransaction(): TransactionRecord[] {
  return useSelector((state: AppState) => state.transaction.recentTransactions);
}

export function useRecentTransactionUpdate(): (trans: TransactionRecord[]) => void {
  const dispatch = useDispatch();
  return useCallback((trans: TransactionRecord[]) => dispatch(recentTransactions({trans})), [dispatch]);
}


