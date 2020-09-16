import _ from 'lodash';
import { ApiPromise, WsProvider } from '@polkadot/api';

class PApi {
  private api: any = {}

  init(api: any) {
    this.api = api
  }

  inited() {
    return !_.isEmpty(this.api)
  }

  getAccount(addr: string) {
    return this.api.query.system.account(addr).then((data: any)=> {
      return data
    })
  }
}

const pApi = new PApi()

export async function getApi() {
  if (pApi.inited()) {
    return pApi
  }

  const wsProvider = new WsProvider('wss://api.ownstack.cn');
  let api = await ApiPromise.create({ provider: wsProvider, types: {
    Balance: 'u128',
    CurrencyId: 'u8',
    CurrencyIdOf: 'CurrencyId',
    CurrencyTypeEnum: {
      _enum: ['BXB', 'BUSD', 'DOT', 'BETH']
    },
    PairKey: 'u64',
    Rate: 'u128',
    Ratio: 'u128',
    Price: 'u128',
    Share: 'u128'
  }});

  pApi.init(api)

  return pApi
}

