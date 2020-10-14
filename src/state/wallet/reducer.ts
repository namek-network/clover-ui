import { createReducer } from '@reduxjs/toolkit';
import { createAccountInfo } from '../../components/WalletComp/utils';
import { accountInfo, wrongNetwork } from './actions';
import { AccountInfo } from './types';


export interface WalletState {
  accountInfo: AccountInfo,
  wrongNetwork: boolean
}

const initialState: WalletState = {
  accountInfo: createAccountInfo('', '', '', []),
  wrongNetwork: false
}

export default createReducer(initialState, builder =>
  builder
    .addCase(accountInfo, (state, action) => {
      const {accountInfo} = action.payload
      state.accountInfo = accountInfo
    })
    .addCase(wrongNetwork, (state, action) => {
      const {wrongNetwork} = action.payload
      state.wrongNetwork = wrongNetwork
    })
);
