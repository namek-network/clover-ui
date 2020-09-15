export type Token = {
  symbol: string
  logo: string
}

export type TokenState = {
  tokens: Token[],
  tokenBySymbols: {
    [symbol: string]: Token
  }
  tokenTypes: TokenType[]
}

export type TokenType = {
  id: number,
  name: string,
  logo?: string
}