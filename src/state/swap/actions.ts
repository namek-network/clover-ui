import { createAction } from '@reduxjs/toolkit';
import { SwapTransState } from './types'

export const transState = createAction<{stat: SwapTransState}>('swap/transState')
