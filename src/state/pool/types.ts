import { defaultTokenType, TokenType } from '../token/types';

export type TransState = {
  stateText: string,
  amountText: string,
  status: string  //available value: start, end, rejected, error
}

export type PoolState = {
  userPoolPairItems: PoolPairItem[],
  chainPoolPairItems: PoolPairItem[],
  transState: TransState
}

export type PoolPairItem = {
  fromToken: TokenType,
  toToken: TokenType,
  fromAmount: string,
  toAmount: string,
  userShare: string,
  totalShare: string
}

export const defaultPoolPairItem = {
  fromToken: defaultTokenType,
  toToken: defaultTokenType,
  fromAmount: '',
  toAmount: '',
  userShare: '',
  totalShare: ''
}