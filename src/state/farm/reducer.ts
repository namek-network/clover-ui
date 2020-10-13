import { createReducer } from '@reduxjs/toolkit';
import { stakePoolItems } from './actions';
import { StakePoolItem } from '../token/types'

export interface FarmState {
  stakePoolItems: StakePoolItem[] | undefined
}

const initialState: FarmState = {
  stakePoolItems: undefined
}

export default createReducer(initialState, builder =>
  builder
    .addCase(stakePoolItems, (state, action) => {
      const { items } = action.payload
      state.stakePoolItems = items
    })
);
