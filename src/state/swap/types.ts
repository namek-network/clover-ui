import { TokenType } from '../token/types';
import { SerializableBigNum } from '../../types/bigNum';

export type SwapState = {
  fromToken?: TokenType,
  fromTokenAmount: SerializableBigNum,

  toToken?: TokenType,
  toTokenAmount: SerializableBigNum
}
