import _ from 'lodash';
import { BigNumber as BN } from "bignumber.js";

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

export default {
  calMinReceived,
  calPriceImpact
}

