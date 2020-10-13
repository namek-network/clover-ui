import { createAction } from '@reduxjs/toolkit'
import { StakePoolItem } from '../token/types'

export const stakePoolItems = createAction<{items: StakePoolItem[]}>('app/stakePoolItems');

