import { trimEnd0 } from './balanceUtils';

describe('balanceUtils test suite', () => {

  test('convertToShowSI test cases', () => {
    expect(trimEnd0('0.5000')).toEqual('0.5');
    expect(trimEnd0('0.0000')).toEqual('0');
  });

});
