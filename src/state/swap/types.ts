export type SwapTransState = {
  stateText: string,
  amountText: string,
  status: string  //available value: start, end, rejected, error
  hash?: string
}

export type SwapState = {
  transState: SwapTransState
}
