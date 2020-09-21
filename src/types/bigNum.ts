import _ from 'lodash';
import { BigNumber as BN } from "bignumber.js";
import { isNum } from '../utils/numUtils';

export const defaultBase: string = '1000000000000';

// seriable BigNum obj that could put to store
export type SerializableBigNum = {
  base: string,
  bigNum: string
}

export default class BigNum {
  private _base: BN;
  private _realNum: BN;
  private _bigNum: BN;

  private constructor(realNum: BN, bigNum: BN, base: BN) {
    this._realNum = realNum;
    this._bigNum = bigNum;
    this._base = base;
  }

  get base(): string {
    return this._base.toString(10);
  }

  get realNum(): string {
    return this._realNum.toString(10);
  }

  get bigNum(): string {
    return this._bigNum.toString(10);
  }

  static Zero: BigNum = BigNum.fromRealNum('0');
  
  static SerizableZero: SerializableBigNum = BigNum.Zero.toSerizableBigNum();

  static fromRealNum(realNum: string, base: string = defaultBase): BigNum {
    if (!isNum(realNum) || !isNum(base) || realNum.trim() == '.') {
      return BigNum.Zero;
    }

    const realNumBN = new BN(realNum, 10);
    const baseBN = new BN(base, 10);

    return new BigNum(realNumBN, realNumBN.times(baseBN), baseBN);
  }

  static fromBigNum(bigNum: string, base: string = defaultBase): BigNum {
    if (!isNum(bigNum) || !isNum(base) || bigNum.trim() == '.') {
      return BigNum.Zero;
    }

    const bigNumBN = new BN(bigNum, 10);
    const baseBN = new BN(base, 10);

    return new BigNum(bigNumBN.div(baseBN), bigNumBN, baseBN);
  }

  static fromSerizableBigNum(obj: SerializableBigNum): BigNum {
    return BigNum.fromBigNum(obj.bigNum, obj.base);
  }

  toSerizableBigNum = (): SerializableBigNum => {
    return {
      base: this.base,
      bigNum: this.bigNum
    };
  }

  lt = (other: BigNum): boolean => {
    if (this._base.eq(other._base)) {
      return this._bigNum.lt(other._bigNum);
    }
    return this._realNum.lt(other._realNum);
  }

  eq = (other: BigNum): boolean => {
    if (this._base.eq(other._base)) {
      return this._bigNum.eq(other._bigNum);
    }
    return this._realNum.eq(other._realNum);
  }

  lte = (other: BigNum): boolean => {
    if (this._base.eq(other._base)) {
      return this._bigNum.lte(other._bigNum);
    }
    return this._realNum.lte(other._realNum);
  }

  gt = (other: BigNum): boolean => {
    if (this._base.eq(other._base)) {
      return this._bigNum.gt(other._bigNum);
    }
    return this._realNum.gt(other._realNum);
  }

  gte = (other: BigNum): boolean => {
    if (this._base.eq(other._base)) {
      return this._bigNum.gte(other._bigNum);
    }
    return this._realNum.gte(other._realNum);
  }
}
