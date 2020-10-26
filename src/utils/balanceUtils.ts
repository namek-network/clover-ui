import { BigNumber as BN } from "bignumber.js";

export function trimEnd0(value: string): string {
  const n = new BN(value, 10)

  if (n.eq(0)) {
    return '0'
  }
  const afterTrim = value.replace(/0+$/,'')
  if (afterTrim.endsWith(".")) {
    return afterTrim + "0"
  }

  return afterTrim
}


