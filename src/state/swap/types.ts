export type SwapTransState = {
  stateText: string,
  amountText: string,
  status: string  //available value: start, end, rejected, error
}

export type SwapState = {
  transState: SwapTransState
}
