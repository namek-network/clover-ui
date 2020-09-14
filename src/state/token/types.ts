export type Token = {
  symbol: string
  logo: string
}

export type TokenState = {
  tokens: Token[],
  tokenBySymbols: {
    [symbol: string]: Token
  }
}
