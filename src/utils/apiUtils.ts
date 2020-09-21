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
    return this.api.rpc.get.currencies()
  }

  getCurrencyPair() {
    return this.api.rpc.currency.pair()
  }

  getBalance(account: string, currencyType?: string) {
    if (_.isEmpty(currencyType)) {
      return this.api.rpc.get.balance(account)
    }

    return this.api.rpc.get.balance(account, currencyType)
  }

  getBalanceSubscribe(account: string, cb: (params: any) => void) {
    return this.api.rpc.get.balance(account, cb)
  }
  
  targetAmountAvailable(source: string, target: string, amount: string) {
    return this.api.rpc.target.amount_available(source, target, amount)
  }

  supplyAmountNeeded(source: string, target: string, amount: string) {
    return this.api.rpc.supply.amount_needed(source, target, amount)
  }

  getLiquidity(addr: string) {
    return this.api.rpc.get.liquidity(addr)
  }
}

export const api = new ApiWrapper()

export const initApi = async (onInited: () => void) => {
  if (!_.isEmpty(api.getApi())) {
    return
  }

  const wsProvider = new WsProvider('wss://api.ownstack.cn');
  const theApi = await ApiPromise.create({ provider: wsProvider, types, rpc: {
      get: {
        currencies: {
          description: 'get currencies',
          params: [
          ],
          type: 'Vec<CurrencyInfo>'
        },
        balance: {
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
        liquidity: {
          description: 'get liquidity',
          params: [
            {
              name: 'account',
              type: 'String'
            }
          ],
          type: 'Vec<(CurrencyTypeEnum, CurrencyTypeEnum, String, String, String, String)>'
        }
      },
      currency: {
        pair: {
          description: 'currency pairs',
          params: [
          ],
          type: 'Vec<(CurrencyTypeEnum, CurrencyTypeEnum)>'
        }
      },
      target: {
        amount_available: {
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
        }
      },
      supply: {
        amount_needed: {
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
        }
      },

    }
  });
  api.setApi(theApi)

  onInited()
}




