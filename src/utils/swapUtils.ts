import { BigNumber as BN } from "bignumber.js";
import { SubmittableResult } from '@polkadot/api';
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
  }
  catch (e) {
    console.log("error", e)
    return null
  }
}

export async function swapCurrency(
  accountInfo: AccountInfo,
  supplyCurrencyId: number, supplyAmount: BigNum, targetCurrencyId: number, targetAmount: BigNum,
  routes: number[],
  onStart: () => void, onSuccess: (hash?: string) => void, onFailed: (message?: string) => void) {

  onStart()

  const signer = await getSigner(accountInfo.address)
  if (signer == null) {
    onFailed('no available wallet')
    return
  }

  api.getApi().setSigner(signer)

  // Create a extrinsic
  const swapCurrency = api.getApi().tx.cloverDex.swapCurrency(supplyCurrencyId, supplyAmount.bigNum, targetCurrencyId, targetAmount.bigNum, routes)
  
  // Sign and Send the transaction
  let unsub: any;
  try {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    unsub = await swapCurrency.signAndSend(accountInfo.address, (result: SubmittableResult) => {
      console.log('swapCurrency result: ', result.toHuman(true));

      if (result.status.isFinalized || result.status.isInBlock) {
        let success = true;
        result.events
          .filter(({ event: { section } }) => section === 'system')
          .forEach(({ event: { method } }): void => {
            if (method === 'ExtrinsicFailed') {
              // TODO: get the error emssage and pass to onFailed
              success = false;
            }
            else if (method === 'ExtrinsicSuccess') {

            }
          });
          success ? onSuccess(result.status.isInBlock ? result.status.asInBlock.toHex() : '') : onFailed()
      }
      // isError = status.isDropped || status.isFinalityTimeout || status.isInvalid || status.isUsurped;
      else if (result.isError) {
        onFailed()
      }
  
      // isCompleted = isError || status.isInBlock || status.isFinalized;
      if (result.isCompleted) {
        unsub();
      }
    });
  }
  catch (e) {
    console.log('swapCurrency failed', e);

    onFailed(e.toString())
    
    if (unsub) {
      unsub()
    } 
  }

}

export default {
  calMinReceived,
  calPriceImpact,
  swapCurrency
}

