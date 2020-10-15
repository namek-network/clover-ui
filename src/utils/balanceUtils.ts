import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';

const baseStrNum = '1000000000000'
const base = new BN(baseStrNum)
const M_LENGTH = 6 + 1;

export function divideBase(value: string): string[] {
  const num = new BN(value)
  const m = num.mod(base)
  const n = num.div(base)

  return [n.toString(), m.toString()]
}

export function trimEnd0(value: string): string {
  const n = new BN(value)

  if (n.eqn(0)) {
    return '0'
  }
  const afterTrim = value.replace(/0+$/,'')
  if (afterTrim.endsWith(".")) {
    return afterTrim + "0"
  }

  return afterTrim
}

export function addPrefix0ByBase(value: string): string {
  if (value === '0') {
    return '0'
  }
  const num = baseStrNum.length - value.toString().length - 1
  return Array(num).fill(0).join('') + value.toString()
}

export function constructNumAfterPoint(value: string): string {
  const ret = addPrefix0ByBase(value)
  return trimEnd0(ret)
}

export function convertToShow(value: string): string {
  const [n, m] = divideBase(value)
  const dp = constructNumAfterPoint(m)
  return n + '.' + dp
}

export function convertToShowSI(value: string): string {
  const [n, m] = divideBase(value)
  const dp = constructNumAfterPoint(m)

  if (n.length > M_LENGTH) {
    const [major, rest] = formatBalance(n, { withUnit: false }).split('.');
    const minor = rest.substr(0, 3);
    const unit = rest.substr(3);

    return major + '.' + minor + unit
  }

  return n + '.' + dp
}
