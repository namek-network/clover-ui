import { createReducer } from '@reduxjs/toolkit';
import { createAccountInfo } from '../../components/WalletComp/utils';
import { accountInfo } from './actions';
import { AccountInfo } from './types';


export interface WalletState {
  accountInfo: AccountInfo
}

const initialState: WalletState = {
  accountInfo: createAccountInfo('', '', '', [])
}

export default createReducer(initialState, builder =>
  builder
    .addCase(accountInfo, (state, action) => {
      const {accountInfo} = action.payload
      state.accountInfo = accountInfo
    })
);
