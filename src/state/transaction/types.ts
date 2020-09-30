import { defaultTokenType, TokenType } from '../token/types';


export type TransactionRecord = {
  method: string,
  data: string[],
  $blockHash: string
}

export type TransactionState = {
  recentTransactions: TransactionRecord[]
}