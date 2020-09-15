import { createReducer } from '@reduxjs/toolkit';
import { accountInfo } from './actions';
import { AccountInfo, TokenAmount } from './types';


export interface WalletState {
  accountInfo: AccountInfo
}

const initialState: WalletState = {
  accountInfo: {
    address: '',
    walletName: '',
    tokenAmounts: []
  }
}

export default createReducer(initialState, builder =>
  builder
    .addCase(accountInfo, (state, action) => {
      const {accountInfo} = action.payload
      state.accountInfo = accountInfo
    })
);
