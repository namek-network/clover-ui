import { isNum } from './numUtils';

describe('numUtils test suite', () => {

  test('isNum test cases', () => {
    expect(isNum('')).toEqual(false);
    expect(isNum(' ')).toEqual(false);
    expect(isNum('ab')).toEqual(false);

    expect(isNum('1.')).toEqual(true);
    expect(isNum('.123')).toEqual(true);
    expect(isNum('12345')).toEqual(true);
    expect(isNum('12.35')).toEqual(true);
    expect(isNum('0012.3500')).toEqual(true);
  });

});
