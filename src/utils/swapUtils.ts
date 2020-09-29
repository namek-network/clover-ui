import _ from 'lodash';
import { BigNumber as BN } from "bignumber.js";
import { web3FromAddress } from '@polkadot/extension-dapp';
import { AccountInfo } from '../state/wallet/types';
import { api } from './apiUtils'; 
import BigNum from '../types/bigNum';

// slippage should be in [0.1%, 1%]
function normalizeSlippage(slippage: number): number {
  const min = 0.001, max = 0.5;
  return (slippage < min) ? min : (slippage > max ? max : slippage);
}

// minimal received = supply * price / 1 + slippage
export function calMinReceived(supply: string, price: BN, slippage: number): BN | null {
  const supplyBN = new BN(supply, 10);
  if (supplyBN.isNaN()) {
    return null;
  }

  return supplyBN.times(price).div(1 + normalizeSlippage(slippage));
}

// price impace = 2 * sqrt (price) / (1 + price) - 1 
export function calPriceImpact(price: BN): BN {
  return price.sqrt().times(2).div(price.plus(1)).minus(1);
}

async function getSigner(addr: string) {
  try {
    const injected = await web3FromAddress(addr)
    return injected.signer || null
  } catch (e) {
    console.log("error"+e)
    return null
  }
}

export async function swapCurrency(
  accountInfo: AccountInfo,
  supplyCurrencyId: number, supplyAmount: BigNum, targetCurrencyId: number, targetAmount: BigNum,
  routes: number[],
  onError: (msg: string) => void, onStart: () => void, onEnd: (state: string, hash?: string) => void) {

  onStart()

  const signer = await getSigner(accountInfo.address)
  if (signer == null) {
    onError('no available wallet')
    return
  }

  api.getApi().setSigner(signer)

  console.log(supplyCurrencyId, supplyAmount.bigNum, targetCurrencyId, targetAmount.bigNum, routes);

  let unsub: any;

  try {
    unsub = await api.getApi().tx.bithumbDex.swapCurrency(supplyCurrencyId, supplyAmount.bigNum, targetCurrencyId, targetAmount.bigNum, routes)
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
    console.log('swapCurrency failed', e);
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

export default {
  calMinReceived,
  calPriceImpact,
  swapCurrency
}

