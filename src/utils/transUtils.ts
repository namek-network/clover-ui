import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import {getTokenAmount} from './httpServices'
import { TokenType } from '../state/token/types'
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { AccountInfo, TokenAmount } from '../state/wallet/types';
import BigNum from '../types/bigNum'
import { api } from './apiUtils'
import { originName } from '../constants'
import _ from 'lodash'

async function getSigner(addr: string) {
  try {
    const injected = await web3FromAddress(addr)
    return injected.signer || null
  } catch (e) {
    console.log("error"+e)
    return null
  }
}

export async function doAddLiqudityTrans(fromToken: TokenType, 
  toToken: TokenType, fromAmount: BigNum, 
  toAmount: BigNum, accountInfo: AccountInfo, 
  onError: (msg: string) => void, onStart: () => void, onEnd: (state: string) => void) {

  onStart()

  const signer = await getSigner(accountInfo.address)
  if (signer == null) {
    onError('no available wallet')
    return
  }

  api.getApi().setSigner(signer)

  let unsub: any;

  try {
    unsub = await api.getApi().tx.bithumbDex.addLiquidity(fromToken.id, toToken.id, fromAmount.bigNum, toAmount.bigNum)
    .signAndSend(accountInfo.address, (params: any) => {
      console.log('Transaction status:', params.status.type);
  
      if (params.status.isInBlock) {
        console.log('Completed at block hash', params.status.asInBlock.toHex());
        console.log('Events:');
  
        params.events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
          console.log(`${event.phase.toString()}, ${event.event.methohd}, ${event.event.section},${event.event.data.toString()}` );
        });
        onEnd('complete')
        unsub()
      }
    });
  } catch (e) {
    if (e.type === 'signature_rejected') {
      onEnd('rejected')
    } else {
      onEnd('error')
    }
    
    if (!_.isEmpty(unsub)) {
      unsub()
    } 
  }
}

export async function doRemoveLiqudityTrans(fromToken: TokenType, 
  toToken: TokenType, shareAmount: BigNum,  accountInfo: AccountInfo, 
  onError: (msg: string) => void, onStart: () => void, onEnd: (state: string) => void) {

  onStart()

  const signer = await getSigner(accountInfo.address)
  if (signer == null) {
    onError('no available wallet')
    return
  }

  api.getApi().setSigner(signer)

  let unsub: any;

  try {
    unsub = await api.getApi().tx.bithumbDex.withdrawLiquidity(fromToken.id, toToken.id, shareAmount.bigNum)
    .signAndSend(accountInfo.address, (params: any) => {
      console.log('Transaction status:', params.status.type);
  
      if (params.status.isInBlock) {
        console.log('Completed at block hash', params.status.asInBlock.toHex());
        console.log('Events:');
  
        params.events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
          console.log(`${event.phase.toString()}, ${event.event.methohd}, ${event.event.section},${event.event.data.toString()}` );
        });
        onEnd('complete')
        unsub()
      }
    });
  } catch (e) {
    if (e.type === 'signature_rejected') {
      onEnd('rejected')
    } else {
      onEnd('error')
    }
    
    if (!_.isEmpty(unsub)) {
      unsub()
    } 
  }
}