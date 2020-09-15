import { TokenType } from '../token/types';

export type SwapState = {
  fromToken?: TokenType,
  fromTokenAmount?: number,

  toToken?: TokenType,
  toTokenAmount?: number
}
