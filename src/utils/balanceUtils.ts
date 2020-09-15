import BN from 'bn.js';
import { Compact } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';

const M_LENGTH = 6 + 1;
const K_LENGTH = 3 + 1;

export function format(value: Compact<any> | BN | string, withCurrency = true, withSi?: boolean, _isShort?: boolean, labelPost?: string) {
  const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');
  const isShort = _isShort || (withSi && prefix.length >= K_LENGTH);
  const unitPost = withCurrency ? ` ${formatBalance.getDefaults().unit}` : '';

  if (prefix.length > M_LENGTH) {
    const [major, rest] = formatBalance(value, { withUnit: false }).split('.');
    const minor = rest.substr(0, 3);
    const unit = rest.substr(3);

    
  }
}