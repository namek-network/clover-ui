import { createAction } from '@reduxjs/toolkit';
import { TransactionRecord } from './types'

export const recentTransactions = createAction<{trans: TransactionRecord[]}>('transaction/recentTransactions')

