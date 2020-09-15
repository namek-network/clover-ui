import { TokenType } from '../token/types';

export type SwapState = {
  fromToken?: TokenType,
  fromTokenAmount?: string,

  toToken?: TokenType,
  toTokenAmount?: string
}
