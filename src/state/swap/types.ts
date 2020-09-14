import { Token } from '../token/types';

export type SwapState = {
  fromToken?: Token,
  fromTokenAmount?: number,

  toToken?: Token,
  toTokenAmount?: number
}
