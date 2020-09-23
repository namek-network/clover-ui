import _ from 'lodash'
import { PoolPairItem as PoolPairItemType } from '../../state/pool/types'
import { TokenType } from '../../state/token/types';

export const findPairItem = (poolItems: PoolPairItemType[], fromT: TokenType | undefined, toT: TokenType | undefined) => {
  return _.find(poolItems, (item: PoolPairItemType) => {
    const {fromToken, toToken} = item
    return (fromToken.name === fromT?.name && toToken.name === toT?.name) || (toToken.name === fromT?.name && fromToken.name === toT?.name)
  })
}

export const selectedPairExists = (poolItems: PoolPairItemType[], fromT: TokenType | undefined, toT: TokenType | undefined) => {
  if (_.isEmpty(fromT) || _.isEmpty(toT) || _.isEmpty(poolItems)) {
    return false
  }

  return !_.isEmpty(findPairItem(poolItems, fromT, toT))
}

