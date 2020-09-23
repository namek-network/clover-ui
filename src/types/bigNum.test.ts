import BigNum, { defaultBase } from './bigNum';

describe('BigNum test suites', () => {

  test('BigNum test cases', () => {
    expect(BigNum.Zero.realNum).toEqual('0');
    expect(BigNum.Zero.bigNum).toEqual('0');

    expect(BigNum.fromRealNum('')).toBe(BigNum.Zero);
    expect(BigNum.fromRealNum('  ')).toBe(BigNum.Zero);
    expect(BigNum.fromRealNum('abc')).toBe(BigNum.Zero);

    expect(BigNum.fromRealNum('1').bigNum).toEqual('1000000000000');
    expect(BigNum.fromBigNum('1000000000000').realNum).toEqual('1');

    expect(BigNum.fromRealNum('0.123').bigNum).toEqual('123000000000');
    expect(BigNum.fromBigNum('123000000000').realNum).toEqual('0.123');
    
    expect(BigNum.fromRealNum('52.0033').bigNum).toEqual('52003300000000');
    expect(BigNum.fromBigNum('52003300000000').realNum).toEqual('52.0033');

    expect(BigNum.div('6666', '2000000006666')).toEqual('0.00000000333');
    expect(BigNum.div('6666', '2000000006666', true)).toEqual('0.0000003333');
    expect(BigNum.div('1', '2')).toEqual('0.5');
    expect(BigNum.div('10000', '2')).toEqual('5000.0');
    expect(BigNum.fromBigNum("16").getBigNumBase16()).toEqual('1');
  });

});
