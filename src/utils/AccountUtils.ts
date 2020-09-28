import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { TokenType } from '../state/token/types'
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import { AccountInfo, TokenAmount } from '../state/wallet/types';
import BigNum from '../types/bigNum'
import { api } from './apiUtils'
import { originName } from '../constants'
import _ from 'lodash'

export interface WalletType {
  name: string,
  showName: string,
  icon: string
}

export const supportedWalletTypes = [
  {
    name: 'Math Wallet',
    showName: 'Math',
    icon: require('../assets/images/icon-math.svg')
  }, {
    name: 'ImToken Wallet',
    showName: 'ImToken',
    icon: require('../assets/images/icon-imtoken.svg')
  }, {
    name: 'Lunie Wallet',
    showName: 'Lunie',
    icon: require('../assets/images/icon-lunie.svg')
  }];

export function getAddress (addr: string): string {
    if (_.size(addr) < 17) {
      return addr
    }

    const prefix = addr.substring(0, 11)
    const suffix = addr.substring(_.size(addr) - 4, _.size(addr))

    return `${prefix}..${suffix}`
  }

export function createAccountInfo(address: string, name: string, walletName: string, tokenAmounts: TokenAmount[]): AccountInfo {
  return {
    address, name, walletName, tokenAmounts
  }
}

export function createEmptyAccountInfo(): AccountInfo {
  return createAccountInfo('', '', '', [])
}

export async function loadAllTokenAmount(addr: string, tokenTypes: TokenType[]): Promise<TokenAmount[]|null> {
  const ret = await api.getBalance(addr)

  if (_.isEmpty(ret)) {
    return null
  }
  
  const types =  _.map(ret, (arr) => {
    const [type, amount] = arr
    return {
      tokenType: _.find(tokenTypes, (tokenType) => tokenType.name === type.toString()) ?? {
        id: -1,
        name: ''
      },
      amount: amount.toString(),
      amountBN: BigNum.fromBigNum(amount).toSerizableBigNum()
    }
  })

  return _.filter(types, (t) => t.tokenType.id >= 0)
}

export async function loadAccount(wallet: WalletType | undefined, tokenTypes: TokenType[], updateAccountInfo: (info: AccountInfo) => void): Promise<string> {
  const injected = await web3Enable(originName);

  if (!injected.length) {
    return "notFoundWallet";
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const mathWallet = _.find(injected, (w: any) => w.isMathWallet === true)
  if (_.isEmpty(mathWallet)) {
    return "notFoundWallet";
  }

  const allAccounts = await web3Accounts();

  if (!allAccounts.length) {
    return "addWallet"
  }

  const mathAccounts: any = await findMathAccount(allAccounts)
  if (_.isEmpty(mathAccounts)) {
    return "addWallet"
  }

  const tokenAmounts = await loadAllTokenAmount(mathAccounts[0].address, tokenTypes)
  if (tokenAmounts === null) {
    return "addWallet"
  }

  const info = createAccountInfo(mathAccounts[0].address, 
    mathAccounts[0].meta?.name ?? '', 
    '' + _.get(wallet, 'name', ''), 
    tokenAmounts ?? [])
    
  updateAccountInfo(info)

  return 'ok'
}

async function findMathAccount(allAccounts: InjectedAccountWithMeta[]) {
  return Promise.all(_.map(allAccounts, async (acc) => {
    return await web3FromAddress(acc.address)
  })).then((wallets: InjectedExtension[]) => {
    return _.filter(_.zipWith(allAccounts, wallets, (a: InjectedAccountWithMeta, w: any) => {
      if (w && w.isMathWallet) {
        return a
      } else {
        return {}
      }
    }), (x) => !_.isEmpty(x))
  })
}
