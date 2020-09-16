import _ from 'lodash';
import { TokenAmount } from '../../state/wallet/types';

export function getAddress (addr: string) {
    if (_.size(addr) < 17) {
      return addr
    }

    const prefix = addr.substring(0, 11)
    const suffix = addr.substring(_.size(addr) - 4, _.size(addr))

    return `${prefix}..${suffix}`
  }

export function createAccountInfo(address: string, name: string, walletName: string, tokenAmounts: TokenAmount[]) {
  return {
    address, name, walletName, tokenAmounts
  }
}

export function createEmptyAccountInfo() {
  return createAccountInfo('', '', '', [])
}