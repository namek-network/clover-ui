import {TokenType} from '../token/types'

export type TokenAmount = {
  tokenType: TokenType,
  amount: string
}

export type AccountInfo = {
  address: string,
  name: string,
  walletName: string,
  tokenAmounts: TokenAmount[]
}