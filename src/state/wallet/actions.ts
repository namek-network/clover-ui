import { createAction } from '@reduxjs/toolkit'
import { AccountInfo, TokenAmount } from './types';

export const accountInfo = createAction<{accountInfo: AccountInfo}>('wallet/acountInfo')

