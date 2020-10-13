import { web3FromAddress } from '@polkadot/extension-dapp';
import { TokenType } from '../state/token/types'
import { AccountInfo } from '../state/wallet/types';
import BigNum from '../types/bigNum'
import { api } from './apiUtils'
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
  onError: (msg: string) => void, onStart: () => void, onEnd: (state: string, hash?: string) => void): Promise<void> {

  onStart()

  const signer = await getSigner(accountInfo.address)
  if (signer == null) {
    onError('no available wallet')
    return
  }

  api.getApi().setSigner(signer)

  let unsub: ()=>void = () => {''};

  try {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    unsub = await api.getApi().tx.bithumbDex.addLiquidity(fromToken.id, toToken.id, fromAmount.bigNum, toAmount.bigNum)
    .signAndSend(accountInfo.address, (params: any) => {
      console.log('Transaction status:', params.status.type);
  
      if (params.status.isInBlock) {
        console.log('Completed at block hash', params.status.asInBlock.toHex());
        console.log('Events:');
  
        params.events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
          console.log(`${event.phase.toString()}, ${event.event.methohd}, ${event.event.section},${event.event.data.toString()}` );
        });
        onEnd('complete', `${params.status.asInBlock.toHex()}`)
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
  onError: (msg: string) => void, onStart: () => void, onEnd: (state: string, hash?: string) => void): Promise<void> {

  onStart()

  const signer = await getSigner(accountInfo.address)
  if (signer == null) {
    onError('no available wallet')
    return
  }

  api.getApi().setSigner(signer)

  let unsub: () => void = () => {''};

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
        onEnd('complete', `${params.status.asInBlock.toHex()}`)
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

function extractPayload(transName: string, events: any, address: string): any {
  let payload: any = {}
  switch(transName) {
    case 'unstakePoolShares': {
      events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
        if (event.event.section === 'currencies' && event.event.data.length === 4) {
          const [,,recieveAddress, claimAmount] = event.event.data
          if (recieveAddress.toString() === address) {
            payload.claimAmount = BigNum.fromBigNum(claimAmount.toString())
          }
        } else if (event.event.section === 'bithumbDex' && event.event.data.length === 5) {
          const [recieveAddress, , ,shareAmount, ] = event.event.data
          if (recieveAddress.toString() === address) {
            payload.shareAmount = BigNum.fromBigNum(shareAmount.toString())
          }
        } else if (event.event.section === 'system' && event.event.data.length === 2) {
          const [info, ] = event.event.data
          const s = info.toHuman()
          if (s.Module.error === '1') {
            throw new Error('transaction failed')
          }
        }
        console.log(`${event.phase.toString()}, ${event.event.methohd}, ${event.event.section},${event.event.data.toString()}` );
      });
      break;
    }

    case 'withdrawRewards': {
      events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
        if (event.event.section === 'currencies' && event.event.data.length === 4) {
          const [,,recieveAddress, claimAmount] = event.event.data
          if (recieveAddress.toString() === address) {
            payload.claimAmount = BigNum.fromBigNum(claimAmount.toString())
          }
        } else if (event.event.section === 'system' && event.event.data.length === 2) {
          const [info, ] = event.event.data
          const s = info.toHuman()
          if (s.Module.error === '1') {
            throw new Error('transaction failed')
          }
        }
        console.log(`${event.phase.toString()}, ${event.event.methohd}, ${event.event.section},${event.event.data.toString()}` );
      });
      break;
    }
  }
  return payload
}

export async function doTransaction(transName: string, args:any[], accountAddr: string,
  onError: (msg: string) => void, onStart: () => void, onEnd: (state: string, hash?: string, payload?: any) => void): Promise<void> {

  onStart()

  if (!api.getTransFunction(transName)) {
    onError('unsupported transaction')
    return
  }

  const signer = await getSigner(accountAddr)
  if (signer == null) {
    onError('no available wallet')
    return
  }

  api.getApi().setSigner(signer)

  let unsub: () => void = () => {''};

  try {
    unsub = await api.getTransFunction(transName)(...args)
    .signAndSend(accountAddr, (params: any) => {
      // console.log('Transaction status:', params.status.type);
  
      if (params.status.isInBlock) {
        // console.log('Completed at block hash', params.status.asInBlock.toHex());
        // console.log('Events:');
  
        // params.events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
        //   console.log(`${event.phase.toString()}, ${event.event.methohd}, ${event.event.section},${event.event.data.toString()}` );
        // });
        try {
          const payload = extractPayload(transName, params.events, accountAddr)
          onEnd('complete', `${params.status.asInBlock.toHex()}`, payload)
        } catch (e) {
          onEnd('error')
        }
        
        unsub()
      }
    });
  } catch (e) {
    console.log(`error: ${e}`)
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