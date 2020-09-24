import { createAction } from '@reduxjs/toolkit';
import { PoolPairItem, TransState } from './types'

export const userPoolPairItems = createAction<{pairs: PoolPairItem[]}>('pool/userPoolPairItems')
export const chainPoolPairItems = createAction<{pairs: PoolPairItem[]}>('pool/chainPoolPairItems')
export const transState = createAction<{stat: TransState}>('pool/transState')
