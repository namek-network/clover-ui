import { web3FromAddress } from '@polkadot/extension-dapp';
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

function extractAmountPair(event: any, address: string) {
  if (event.event.section === 'cloverDex' && event.event.data.length === 6) {
    //["address",0,1,1000000000000,1000000000000,999999999999]
    const [recieveAddress, token1Id, token2Id, token1Amount, token2Amount, shareAmount] = event.event.data
    if (recieveAddress.toString() === address) {
      return {
        id1: token1Id.toString(),
        id2: token2Id.toString(),
        amount1: BigNum.fromBigNum(token1Amount.toString()),
        amount2: BigNum.fromBigNum(token2Amount.toString()),
        shareAmount: BigNum.fromBigNum(shareAmount.toString())
      }
    }
  }

  return undefined
}

function extractShareAmount(event: any, address: string) {
  if (event.event.section === 'cloverDex' && event.event.data.length === 5) {
    const [recieveAddress, , ,shareAmount, ] = event.event.data
    if (recieveAddress.toString() === address) {
      return BigNum.fromBigNum(shareAmount.toString())
    }
  }

  return undefined
}

function extractClaimAmount(event: any, address: string) {
  if (event.event.section === 'currencies' && event.event.data.length === 4) {
    const [,,recieveAddress, claimAmount] = event.event.data
    if (recieveAddress.toString() === address) {
      return BigNum.fromBigNum(claimAmount.toString())
    }
  }

  return undefined
}

function extractError(event: any) {
  if (event.event.section === 'system' && event.event.data.length === 2) {
    const [info, ] = event.event.data
    const s = info.toHuman()
    if (s.Module.error) {
      throw new Error('transaction failed')
    }
  }
}

function extractPayload(transName: string, events: any, address: string): any {
  let payload: any = {}
  switch(transName) {
    case 'addLiquidity': {
      events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
        if (event.event.section === 'cloverDex' && event.event.data.length === 6) {
          payload.amountPair = extractAmountPair(event, address)
        } else if (event.event.section === 'system' && event.event.data.length === 2) {
          extractError(event)
        }
      })

      break;
    }
    case 'withdrawLiquidity': {
      events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
        if (event.event.section === 'cloverDex' && event.event.data.length === 6) {
          payload.amountPair = extractAmountPair(event, address)
        } else if (event.event.section === 'system' && event.event.data.length === 2) {
          extractError(event)
        }
      })

      break;
    }
    case 'stakePoolShares': {
      events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
        if (event.event.section === 'cloverDex' && event.event.data.length === 5) {
          payload.shareAmount = extractShareAmount(event, address)
        } else if (event.event.section === 'system' && event.event.data.length === 2) {
          extractError(event)
        }
      });

      break;
    }
    case 'unstakePoolShares': {
      events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
        if (event.event.section === 'currencies' && event.event.data.length === 4) {
          payload.claimAmount = extractClaimAmount(event, address)
        }
        else if (event.event.section === 'cloverDex' && event.event.data.length === 5) {
          payload.shareAmount = extractShareAmount(event, address)
        }
        else if (event.event.section === 'system' && event.event.data.length === 2) {
          extractError(event)
        }
      })
      break;
    }

    case 'withdrawRewards': {
      events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
        if (event.event.section === 'currencies' && event.event.data.length === 4) {
          payload.claimAmount = extractClaimAmount(event, address)
        }
        else if (event.event.section === 'system' && event.event.data.length === 2) {
          extractError(event)
        }
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
      console.log('Transaction status:', params.status.type);
  
      if (params.status.isInBlock) {
        console.log('Completed at block hash', params.status.asInBlock.toHex());
        console.log('Events:');
  
        params.events.forEach((event: any/*{ phase, event: { data, method, section } }*/) => {
          console.log(`${event.phase.toString()}, ${event.event.methohd}, ${event.event.section},${event.event.data.toString()}` );
        });
        try {
          const payload = extractPayload(transName, params.events, accountAddr)
          onEnd('complete', `${params.status.asInBlock.toHex()}`, payload)
        } catch (e) {
          console.log(e)
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