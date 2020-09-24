import _ from 'lodash';
import { BigNumber as BN } from "bignumber.js";
import { web3FromAddress } from '@polkadot/extension-dapp';
import { AccountInfo } from '../state/wallet/types';
import { api } from './apiUtils'; 
import BigNum from '../types/bigNum';

// slippage should be in [0.1%, 1%]
function normalizeSlippage(slippage: number): number {
  const min = 0.001, max = 0.01;
  return (slippage < min) ? min : (slippage > max ? max : slippage);
}

// minial received = supply / (price * (1 + slippage))
export function calMinReceived(supply: string, price: BN, slippage: number): BN | null {
  const supplyBN = new BN(supply, 10);
  if (supplyBN.isNaN()) {
    return null;
  }

  return supplyBN.div(price.times(1 + normalizeSlippage(slippage)));
}

// price impace = 2 * sqrt (price) / (1 + price) - 1 
export function calPriceImpact(price: BN): BN {
  return price.sqrt().times(2).div(price.plus(1)).minus(1);
}

export async function swapCurrency(accountInfo: AccountInfo, supplyCurrencyId: number, supplyAmount: BigNum, targetCurrencyId: number, targetAmount: BigNum, routes: number[]) {
  const injector = await web3FromAddress(accountInfo.address);

  api.getApi().setSigner(injector.signer);

  console.log('routes', routes);

  try {
    await api.getApi().tx.bithumbDex.swapCurrency(supplyCurrencyId, supplyAmount.bigNum, targetCurrencyId, targetAmount.bigNum, routes)
      .signAndSend(accountInfo.address, (result: any) => {
        // TODO: handle result
        console.log('swapCurrency result', result);
      });
  } catch (e) {
    console.log('swapCurrency failed', e);
  }

}

export default {
  calMinReceived,
  calPriceImpact,
  swapCurrency
}

