import _ from 'lodash'

const baseUrl = "https://rpc.ownstack.cn"
export function getTokenTypes() {
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
    }).catch((e) => {
      return null
    })
}

export function getTokenAmount(addr: string, tokenName?: string) {
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
    }).catch((e) => {
      return null
    })
}