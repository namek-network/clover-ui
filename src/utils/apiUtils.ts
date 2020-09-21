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
        }
      },
      currency: {
        pair: {
          description: 'currency pairs',
          params: [
          ],
          type: 'Vec<(CurrencyTypeEnum, CurrencyTypeEnum)>'
        }
      }
    }
  });
  api.setApi(theApi)

  onInited()
}




