import _ from 'lodash';
import { ApiPromise, WsProvider } from '@polkadot/api';

const types = {
  Balance: 'u128',
  CurrencyId: 'u8',
  CurrencyIdOf: 'CurrencyId',
  CurrencyTypeEnum: {
    _enum: ['BXB', 'BUSD', 'DOT', 'BETH']
  },
  CurrencyInfo: {
    id: 'u32',
    name: 'CurrencyTypeEnum'
  },
  SwapResultInfo: {
    balance: 'String',
    routes: 'Vec<CurrencyTypeEnum>'
  },
  PairKey: 'u64',
  Rate: 'u128',
  Ratio: 'u128',
  Price: 'u128',
  Share: 'u128'
}

class ApiWrapper {
  private api: any

  setApi(api: any) {
    this.api = api
  }

  getApi() {
    return this.api
  }

  getTokenTypes() {
    return this.api.rpc.bitdex.get_currencies()
  }

  getCurrencyPair() {
    return this.api.rpc.bitdex.currency_pair()
  }

  getBalance(account: string, currencyType?: string) {
    if (_.isEmpty(currencyType)) {
      return this.api.rpc.bitdex.get_balance(account)
    }

    return this.api.rpc.bitdex.get_balance(account, currencyType)
  }

  getBalanceSubscribe(account: string, cb: (params: any) => void) {
    return this.api.rpc.bitdex.get_balance(account, cb)
  }
  
  targetAmountAvailable(source: string, target: string, amount: string) {
    return this.api.rpc.bitdex.target_amount_available(source, target, amount)
  }

  supplyAmountNeeded(source: string, target: string, amount: string) {
    return this.api.rpc.bitdex.supply_amount_needed(source, target, amount)
  }

  getLiquidity(addr?: string) {
    if (_.isEmpty(addr)) {
      return this.api.rpc.bitdex.get_liquidity()
    }
    return this.api.rpc.bitdex.get_liquidity(addr)
  }

  toAddLiquidity(from: string, to: string, amountFrom: string, amountTo: string) {
    return this.api.rpc.bitdex.to_add_liquidity(from, to, amountFrom, amountTo)
  }
}

export const api = new ApiWrapper()

export const initApi = async (onInited: () => void) => {
  if (!_.isEmpty(api.getApi())) {
    return
  }

  const wsProvider = new WsProvider('wss://api.ownstack.cn');
  const theApi = await ApiPromise.create({ provider: wsProvider, types, rpc: {
    bitdex: {
        get_currencies: {
          description: 'get currencies',
          params: [
          ],
          type: 'Vec<CurrencyInfo>'
        },
        get_balance: {
          description: 'get balance',
          params: [
            {
              name: 'account',
              type: 'String'
            },
            {
              name: 'currencyId',
              type: 'CurrencyTypeEnum',
              isOptional: true
            }
          ],
          type: 'Vec<(CurrencyTypeEnum, String)>'
        },
        get_liquidity: {
          description: 'get liquidity',
          params: [
            {
              name: 'account',
              type: 'String',
              isOptional: true
            }
          ],
          type: 'Vec<(CurrencyTypeEnum, CurrencyTypeEnum, String, String, String, String)>'
        },
        currency_pair: {
          description: 'currency pairs',
          params: [
          ],
          type: 'Vec<(CurrencyTypeEnum, CurrencyTypeEnum)>'
        },
        target_amount_available: {
          description: 'target amount available',
          params: [
            {
              name: 'tokenType',
              type: 'CurrencyTypeEnum'
            },
            {
              name: 'targetTokenType',
              type: 'CurrencyTypeEnum'
            },
            {
              name: 'amount',
              type: 'Balance'
            }
          ],
          type: 'SwapResultInfo'
        },
        supply_amount_needed: {
          description: 'supply amount needed',
          params: [
            {
              name: 'tokenType',
              type: 'CurrencyTypeEnum'
            },
            {
              name: 'targetTokenType',
              type: 'CurrencyTypeEnum'
            },
            {
              name: 'amount',
              type: 'Balance'
            }
          ],
          type: 'SwapResultInfo'
        },
        to_add_liquidity: {
          description: 'to add liquidity',
          params: [
            {
              name: 'fromTokenType',
              type: 'CurrencyTypeEnum'
            },
            {
              name: 'toTokenType',
              type: 'CurrencyTypeEnum'
            },
            {
              name: 'amountFrom',
              type: 'Balance'
            },
            {
              name: 'amountTo',
              type: 'Balance'
            }
          ],
          type: 'Vec<String>'
        }
      }
    }
  });
  api.setApi(theApi)
  theApi.on('connected', () => {
    console.log('connected')
  })
  theApi.on('disconnected', () => {
    console.log('disconnected')
  })
  theApi.on('ready', () => {
    console.log('ready')
  })

  onInited()
}




