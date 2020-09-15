export type TokenType = {
  id: number,
  name: string,
  logo?: string
}

export type TokenState = {
  tokenTypes: TokenType[]
}
