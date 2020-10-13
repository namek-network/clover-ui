import _ from 'lodash'
import tokens from '../state/token/tokens'
import { CurrencyPair, TokenType, StakePoolItem } from '../state/token/types'
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

export async function loadAllPools(onUpdate: (items: StakePoolItem[]) => void): Promise<void> {
  const ret = await api.getAllPools()
  const items = _.map(ret, ([fromName, toName, totalAmount, totalIncentive]) => {
    const fromToken = _.find(tokens, (token: TokenType) => token.name === fromName.toString())
    const toToken = _.find(tokens, (token: TokenType) => token.name === toName.toString())
    return {
      fromTokenType: fromToken ?? {id: -1, name: ''},
      toTokenType: toToken ?? {id: -1, name: ''},
      totalAmount: totalAmount.toString(), 
      totalIncentive: totalIncentive.toString()
    }
  })

  onUpdate(items)
}

export async function subscribeToEvents(udateStakePoolItems: (items: StakePoolItem[]) => void) {
  return api.getApi().query.system.events((events: any) => {
    let updateStakePool = false
    events.forEach((record: any) => {
      const { event, } = record;
      if (event.section.toString() === 'bithumbDex' && (_.includes(['StakeShare', 'UnStakeShare', 'RewardsClaimed'], event.method.toString()))) {
        updateStakePool = true
      }
    })

    if (updateStakePool) {
      loadAllPools(udateStakePoolItems)
    }
    // console.log(`\nReceived ${events.length} events:`);

    // // Loop through the Vec<EventRecord>
    // events.forEach((record: any) => {
    //   // Extract the phase, event and the event types
    //   const { event, phase } = record;
    //   const types = event.typeDef;

    //   // Show what we are busy with
    //   console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
    //   console.log(`\t\t${event.meta.documentation.toString()}`);

    //   // Loop through each of the parameters, displaying the type and data
    //   event.data.forEach((data: any, index: any) => {
    //     console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
    //   });
    // });
  });
}