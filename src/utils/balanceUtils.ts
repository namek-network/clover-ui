import BN from 'bn.js';
import { Compact } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import _ from 'lodash'

const baseStrNum = '1000000000000'
const base = new BN(baseStrNum)
const M_LENGTH = 6 + 1;
const K_LENGTH = 3 + 1;

export function divideBase(value: string) {
  let num = new BN(value)
  const m = num.mod(base) //小数部分
  const n = num.div(base) //整数部分

  return [n.toString(), m.toString()]
}

export function trimEnd0(value: string) {
  const n = new BN(value)

  if (n.eqn(0)) {
    return '0'
  }
  return value.replace(/0+$/,'')
}

export function addPrefix0ByBase(value: string) {
  if (value === '0') {
    return '0'
  }
  const num = baseStrNum.length - value.toString().length - 1
  return Array(num).fill(0).join('') + value.toString()
}

export function constructNumAfterPoint(value: string) {
  const ret = addPrefix0ByBase(value)
  return trimEnd0(ret)
}

export function convertToShow(value: string) {
  const [n, m] = divideBase(value)
  const dp = constructNumAfterPoint(m)
  return n + '.' + dp
}

export function convertToShowSI(value: string) {
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

function test() {
  const cases = [
    '1000000000000', //1.0
    '123000000000', //0.123
    '52330000000000',//52.33
    '52003300000000', //52.0033
    '1230000000', //0.00123
    '0', //0.0
    '52330000000000000000'//52.33M
  ]

  _.forEach(cases, (c) => {
    console.log('test'+convertToShowSI(c))
  })
}

test()


// function format (value: Compact<any> | BN | string, withCurrency = true, withSi?: boolean, _isShort?: boolean, labelPost?: string): React.ReactNode {
//   const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');
//   const isShort = _isShort || (withSi && prefix.length >= K_LENGTH);
//   const unitPost = withCurrency ? ` ${formatBalance.getDefaults().unit}` : '';

//   if (prefix.length > M_LENGTH) {
//     const [major, rest] = formatBalance(value, { withUnit: false }).split('.');
//     const minor = rest.substr(0, 3);
//     const unit = rest.substr(3);

//     return <>{major}.<span className='ui--FormatBalance-postfix'>{minor}</span><span className='ui--FormatBalance-unit'>{unit}{unitPost}</span>{labelPost || ''}</>;
//   }

//   return <>{`${prefix}${isShort ? '' : '.'}`}{!isShort && <span className='ui--FormatBalance-postfix'>{`000${postfix || ''}`.slice(-3)}</span>}<span className='ui--FormatBalance-unit'>{unitPost}</span>{labelPost || ''}</>;
// }