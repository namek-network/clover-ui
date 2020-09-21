import _ from 'lodash';

export function isNum(num: string): boolean {
  if (_.isEmpty(num) || _.isEmpty(num.trim())) {
    return false;
  }

  return !_.isNaN(_.toNumber(num));
}