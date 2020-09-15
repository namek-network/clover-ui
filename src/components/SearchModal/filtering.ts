import { TokenType } from '../../state/token/types'

export function filterTokens(tokens: TokenType[], search: string): TokenType[] {
  if (search.length === 0) return tokens

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.includes(p)))
  }

  return tokens.filter(token => {
    const { name } = token

    return (name && matchesSearch(name))
  })
}
