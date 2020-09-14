import { createAction } from '@reduxjs/toolkit'

export const slippageTol = createAction<number>('setting/slippageTol');
export const transDeadline = createAction<number>('setting/transDeadline');

