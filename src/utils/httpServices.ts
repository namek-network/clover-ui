import _ from 'lodash'

const baseUrl = "https://rpc.ownstack.cn"
export function getTokenTypes(): Promise<string|null> {
  const params = {
    jsonrpc: "2.0",
    id: 1,
    method: "get_currencies",
    params: []
   }

   return fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(params)
    }).then((data) => {
      return data.json()
    }).catch(() => {
      return null
    })
}

export function getTokenAmount(addr: string, tokenName?: string): Promise<string|null> {
  const p = _.isEmpty(tokenName) ? [addr] : [addr, tokenName]
  const params = {
    "jsonrpc": "2.0",
     "id": 1,
     "method": "get_balance",
     "params": p
   }

   return fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(params)
    }).then((data) => {
      return data.json()
    }).catch(() => {
      return null
    })
}

const blockBrowserBase = 'https://apps.ownstack.cn/#/explorer'
export function getBlockBrowserAddress(hash?: string): string {
  if (_.isEmpty(hash)) {
    return blockBrowserBase
  }
  return `${blockBrowserBase}/query/${hash}`
}