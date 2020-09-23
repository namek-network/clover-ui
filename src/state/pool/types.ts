import { defaultTokenType, TokenType } from '../token/types';

export type PoolState = {
  userPoolPairItems: PoolPairItem[],
  chainPoolPairItems: PoolPairItem[]
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