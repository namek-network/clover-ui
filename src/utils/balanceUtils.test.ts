import { convertToShowSI } from './balanceUtils';

describe('balanceUtils test suite', () => {

  test('convertToShowSI test cases', () => {
    expect(convertToShowSI('1000000000000')).toEqual('1.0');
    expect(convertToShowSI('123000000000')).toEqual('0.123');
    expect(convertToShowSI('52330000000000')).toEqual('52.33');
    expect(convertToShowSI('52003300000000')).toEqual('52.0033');
    expect(convertToShowSI('1230000000')).toEqual('0.00123');
    expect(convertToShowSI('0')).toEqual('0.0');
    expect(convertToShowSI('52330000000000000000')).toEqual('52.330M');
  });

});
