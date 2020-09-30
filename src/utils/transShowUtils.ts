import _ from 'lodash';
import { TokenType } from '../state/token/types';
import {TransactionRecord} from '../state/transaction/types'
import BigNum from '../types/bigNum'

function getText(fromTokenId: string, fromAmount: string, toTokenId: string, toAmount: string, method: string, tokenTypes: TokenType[]) {
  let msg = ''

  const tokenTypeFrom = _.find(tokenTypes, (t) => t.id === _.parseInt(fromTokenId))
  const tokenTypeTo = _.find(tokenTypes, (t) => t.id === _.parseInt(toTokenId))

  if (!_.isEmpty(tokenTypeFrom) && !_.isEmpty(tokenTypeTo)) {
    if (method === 'Swap') {
      msg = `${method} ${BigNum.fromBigNum(toAmount).realNum} ${tokenTypeTo?.name ?? ''} for ${BigNum.fromBigNum(fromAmount).realNum} ${tokenTypeFrom?.name ?? ''}`
    } else if (method === 'AddLiquidity') {
      msg = `Add ${BigNum.fromBigNum(fromAmount).realNum} ${tokenTypeFrom?.name ?? ''} and ${BigNum.fromBigNum(toAmount).realNum} ${tokenTypeTo?.name ?? ''}`
    } else if (method === 'WithdrawLiquidity') {
      msg = `Withdraw ${BigNum.fromBigNum(fromAmount).realNum} ${tokenTypeFrom?.name ?? ''} and ${BigNum.fromBigNum(toAmount).realNum} ${tokenTypeTo?.name ?? ''}`
    }
  }

  return msg
}

export function transShowTextFromTransRecord(record: TransactionRecord, tokenTypes: TokenType[]) {
  let fromTokenId = '', fromAmount = '', toTokenId = '', toAmount = ''
  if (record.method === 'Swap') {
    [, fromTokenId, fromAmount, toTokenId, toAmount] = record.data
  } else if (record.method === 'AddLiquidity') {
    [, fromTokenId, toTokenId, fromAmount, toAmount, ] = record.data
  } else if (record.method === 'WithdrawLiquidity') {
    [, fromTokenId, toTokenId, fromAmount, toAmount, ] = record.data
  }

  return getText(fromTokenId, fromAmount, toTokenId, toAmount, record.method, tokenTypes)
}
