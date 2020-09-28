import _ from 'lodash'
import tokens from '../state/token/tokens'
import { CurrencyPair, TokenType } from '../state/token/types'
import { api } from './apiUtils'

export async function loadTokenTypes(onUpdate: (typeList: TokenType[]) => void): Promise<void> {
  const ret = await api.getTokenTypes()

  if (_.isEmpty(ret)) {
    return
  }

  const tokenTypeList = _.map(ret, (tokenType: TokenType) => {
    const name = tokenType.name.toString()
    const tk = _.find(tokens, (token: TokenType) => token.name === name)
    return {id: _.parseInt(tokenType.id.toString()), name: name, logo:tk?.logo ?? ''}
  })

  onUpdate(tokenTypeList)
}

export async function loadCurrencyPair(onUpdate: (pairs: CurrencyPair[]) => void): Promise<void> {
  const ret = await api.getCurrencyPair()

  const pairs = _.map(ret, ([a, b]) => {
    return {a: a.toString(), b: b.toString()}
  })

  onUpdate(pairs)
}