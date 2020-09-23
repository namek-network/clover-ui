import { createAction } from '@reduxjs/toolkit';
import { PoolPairItem } from './types'

export const userPoolPairItems = createAction<{pairs: PoolPairItem[]}>('pool/userPoolPairItems')
export const chainPoolPairItems = createAction<{pairs: PoolPairItem[]}>('pool/chainPoolPairItems')
