import _ from 'lodash';
import { ApiPromise, WsProvider } from '@polkadot/api';

const types = {
  Balance: 'u128',
  CurrencyId: 'u8',
  CurrencyIdOf: 'CurrencyId',
  CurrencyTypeEnum: {
    _enum: ['CLV', 'CUSDT', 'DOT', 'CETH']
  },
  CurrencyInfo: {
    id: 'u32',
    name: 'CurrencyTypeEnum'
  },
  SwapResultInfo: {
    balance: 'String',
    routes: 'Vec<CurrencyTypeEnum>'
  },
  PoolId: {
    _enum: {
      Swap: 'u64'
    }
  },
  PairKey: 'u64',
  Rate: 'u128',
  Ratio: 'u128',
  Price: 'u128',
  Share: 'u128',
  OracleKey: 'u8',
  Amount: 'i128'
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
class ApiWrapper {
  private api: any

  setApi(api: any) {
    this.api = api
  }

  getApi() {
    return this.api
  }

  getTransFunction(transName: string) {
    switch(transName) {
      case 'unstakePoolShares': return this.api.tx.cloverDex.unstakePoolShares
      case 'stakePoolShares': return this.api.tx.cloverDex.stakePoolShares
      case 'withdrawRewards': return this.api.tx.cloverDex.withdrawRewards
      case 'addLiquidity': return this.api.tx.cloverDex.addLiquidity
      case 'withdrawLiquidity': return this.api.tx.cloverDex.withdrawLiquidity
    }
    return null
  }

  getTokenTypes() {
    return this.api.rpc.clover.getCurrencies()
  }

  getCurrencyPair() {
    return this.api.rpc.clover.currencyPair()
  }

  getBalance(account: string, currencyType?: string) {
    if (_.isEmpty(currencyType)) {
      return this.api.rpc.clover.getBalance(account)
    }

    return this.api.rpc.clover.getBalance(account, currencyType)
  }

  getBalanceSubscribe(account: string, cb: (params: any) => void) {
    return this.api.rpc.clover.getBalance(account, cb)
  }

  targetAmountAvailable(source: string, target: string, amount: string) {
    return this.api.rpc.clover.targetAmountAvailable(source, target, amount)
  }

  supplyAmountNeeded(source: string, target: string, amount: string) {
    return this.api.rpc.clover.supplyAmountNeeded(source, target, amount)
  }

  getLiquidity(addr?: string) {
    if (_.isEmpty(addr)) {
      return this.api.rpc.clover.getLiquidity()
    }
    return this.api.rpc.clover.getLiquidity(addr)
  }

  toAddLiquidity(from: string, to: string, amountFrom: string, amountTo: string) {
    return this.api.rpc.clover.toAddLiquidity(from, to, amountFrom, amountTo)
  }

  getAccountStakingInfo(account: string, token1: string, token2: string) {
    return this.api.rpc.clover.getAccountStakingInfo(account, token1, token2)
  }

  getAllPools() {
    return this.api.rpc.incentive.getAllPools()
  }
}

export const api = new ApiWrapper()

export const initApi = async (onInited: () => void, onConnected: () => void, onDisConnected: () => void): Promise<void> => {
  if (!_.isEmpty(api.getApi())) {
    return
  }

  const wsProvider = new WsProvider('ws://localhost:9944');
  const theApi = await ApiPromise.create({ provider: wsProvider, types, rpc: {
    incentive: {
      getAllPools: {
        description: 'get all pools',
          params: [
          ],
          type: 'Vec<(CurrencyTypeEnum, CurrencyTypeEnum, String, String)>'
      }

    },
    clover: {
        getCurrencies: {
          description: 'get currencies',
          params: [
          ],
          type: 'Vec<(CurrencyInfo)>'
        },
        getBalance: {
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
        getLiquidity: {
          description: 'get liquidity',
          params: [
            {
              name: 'account',
              type: 'String',
              isOptional: true
            }
          ],
          type: 'Vec<(CurrencyTypeEnum, CurrencyTypeEnum, String, String, String, String, String)>'
        },
        currencyPair: {
          description: 'currency pairs',
          params: [
          ],
          type: 'Vec<(CurrencyTypeEnum, CurrencyTypeEnum)>'
        },
        targetAmountAvailable: {
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
        supplyAmountNeeded: {
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
        toAddLiquidity: {
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
        },

        getAccountStakingInfo: {
          description: 'deposited token',
          params: [
            {
              name: 'account',
              type: 'String'
            },
            {
              name: 'currency_first',
              type: 'CurrencyTypeEnum'
            },
            {
              name: 'currency_second',
              type: 'CurrencyTypeEnum'
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
    onConnected()
  })
  theApi.on('disconnected', () => {
    console.log('disconnected')
    onDisConnected()
  })
  theApi.on('ready', () => {
    console.log('ready')
  })

  onInited()
}




