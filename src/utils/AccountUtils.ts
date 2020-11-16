import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { TokenType } from '../state/token/types'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountInfo, TokenAmount } from '../state/wallet/types';
import BigNum from '../types/bigNum'
import { api } from './apiUtils'
import { originName } from '../constants'
import keyring from '@polkadot/ui-keyring';
import _ from 'lodash'

export interface WalletType {
  name: string,
  showName: string,
  icon: string
}

export const supportedWalletTypes = [{
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
  }, {
    name: 'Clover Wallet',
    showName: 'Clover',
    icon: require('../assets/images/icon-clover.svg')
  }, {
    name: 'Polkadot Wallet',
    showName: 'polkadot-js',
    icon: require('../assets/images/icon-polkadot.svg')
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

function isCloverWallet(injectedWallet: any) {
  return injectedWallet.name === 'clover'
}

function isPolkadotWallet(injectedWallet: any) {
  return injectedWallet.name === 'polkadot-js'
}

function invalidWalletNetwork(allAccounts: InjectedAccountWithMeta[]): boolean {
  keyring.loadAll({ ss58Format: 42, type: 'ed25519' }, allAccounts);

  const accounts = keyring.getAccounts();
  const addrs = _.map(accounts, (acc) => acc.address)

  return _.some(allAccounts, (acc) => !_.includes(addrs, acc.address))
}

export async function loadAccount(wallet: WalletType | undefined, tokenTypes: TokenType[],
  updateAccountInfo: (info: AccountInfo) => void, updateWrongNetwork: (wrong: boolean) => void): Promise<string> {
  const injected = await web3Enable(originName);

  if (!injected.length) {
    return "notFoundWallet";
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const mathWallet = _.find(injected, (w: any) => w.isMathWallet === true)
  const cloverWallet: any = _.find(injected, (w: any) => isCloverWallet(w))
  const polkadotWallet: any = _.find(injected, (w: any) => isPolkadotWallet(w))
  if (_.isEmpty(mathWallet) && _.isEmpty(cloverWallet) && _.isEmpty(polkadotWallet)) {
    return "notFoundWallet";
  }

  const allAccounts = await web3Accounts();

  if (!allAccounts.length) {
    return "addWallet"
  }

  if (invalidWalletNetwork(allAccounts)) {
    updateWrongNetwork(true)
    return "change to valid network"
  }

  const tokenAmounts = await loadAllTokenAmount(allAccounts[0].address, tokenTypes)
  if (tokenAmounts === null) {
    return "addWallet"
  }

  const info = createAccountInfo(allAccounts[0].address,
    allAccounts[0].meta?.name ?? '',
    '' + _.get(wallet, 'name', ''),
    tokenAmounts ?? [])

  updateAccountInfo(info)

  return 'ok'
}

