import { createReducer } from '@reduxjs/toolkit';
import { recentTransactions } from './actions';
import { TransactionState } from './types';

const initialState: TransactionState = {
  recentTransactions: []
}
  
export default createReducer(initialState, builder =>
  builder
    .addCase(recentTransactions, (state, action) => {
      const { trans } = action.payload
      state.recentTransactions = trans
    })
);

  