import { TokenType } from '../token/types'
import BigNum from '../../types/bigNum'

export type TokenAmount = {
  tokenType: TokenType,
  amount: string, // TODO: remove this and use amountBN instead
  amountBN: BigNum
}

export type AccountInfo = {
  address: string,
  name: string,
  walletName: string,
  tokenAmounts: TokenAmount[]
}