import { createReducer } from '@reduxjs/toolkit';
import { toggleSettingsMenu, balance, address } from './actions';


export interface AllToken {
  bxb: string,
  busd: string,
  beth: string,
  dot: string,
}
export interface ApplicationState {
  settingsMenuOpen: boolean,
  address: string,
  balance: AllToken
}

const initialState: ApplicationState = {
  settingsMenuOpen: false,
  address: '',
  balance: {
    bxb: '0',
    busd: '0',
    beth: '0',
    dot: '0'
  }
}

export default createReducer(initialState, builder =>
  builder
    .addCase(toggleSettingsMenu, state => {
      state.settingsMenuOpen = !state.settingsMenuOpen
    })
    .addCase(balance, (state, action: any) => {
      state.balance = action.payload
    })
    .addCase(address, (state, action: any) => {
      state.address = action.payload
    })
);
