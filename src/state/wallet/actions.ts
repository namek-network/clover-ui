import { createAction } from '@reduxjs/toolkit'
import { AccountInfo } from './types';

export const accountInfo = createAction<{accountInfo: AccountInfo}>('wallet/acountInfo')

