import _ from 'lodash';

export function isNum(num: string): boolean {
  if (_.isEmpty(num) || _.isEmpty(num.trim())) {
    return false;
  }

  if (num.trim() == '.') {
    return true;
  }

  return !_.isNaN(_.toNumber(num));
}