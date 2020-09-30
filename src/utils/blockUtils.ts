import _ from 'lodash';
import {api} from './apiUtils'

export const methods = ["AddLiquidity", "WithdrawLiquidity", "Swap"]

const step = 500;
const maxBlockToTraverse = 10000;

// traverse latest 'maxBlockToTraverse' block, find 'recent' number of transaction of the address
async function traverseChain(addr: string, startIndex: number, endIndex : number) {
  if (endIndex <= 0 ) {
    return []
  }

  if (startIndex <= 0) {
    startIndex = 1
  }

  // console.log(`-------start:${startIndex}, end:${endIndex}`)
  const startHdr = await api.getApi().rpc.chain.getBlockHash(startIndex);
  const endHdr = await api.getApi().rpc.chain.getBlockHash(endIndex);
  
  const events = await api.getApi().query.system.events.range([startHdr, endHdr]);
  const eventRecords = _.flatMap(events??[], (event) => {
    const [hash, eventRecords] = event
    // console.log(`------------event hash:${hash}`)
    const filteredRecords = _.filter(eventRecords, ({ event: { index, data, method, section }}) => {
      // console.log(`${data[0]}, method: ${section}.${method}`)
      return _.get(data, '0', '').toString() === addr && _.includes(methods, method.toString())})
    _.forEach(filteredRecords, (r) => r.event.$blockHash = hash.toString())
    return filteredRecords
  })

  return _.reverse(eventRecords)
}

export async function getRecentTransaction(addr: string, recent = 3) {
  if (_.isEmpty(addr) || recent <= 0) {
    return null;
  }

  const lastHdr = await api.getApi().rpc.chain.getHeader();
  const chainLength = _.parseInt(lastHdr.number.unwrap().toString())
  console.log(chainLength)

  let blockToTraverse = _.min([chainLength, maxBlockToTraverse]) ?? 0
  let endIndex = chainLength
  let result: any = []

  while (result.length < recent && blockToTraverse > 0 && endIndex > 0) {
    const events = await traverseChain(addr, endIndex - step + 1, endIndex)
    if (!_.isEmpty(events)) {
      result = result.concat(events)
    }
    
    endIndex = endIndex - step
    blockToTraverse = blockToTraverse - step
  }

  result = _.map(_.take(result, recent), (r: any) => r.event)
  return result
}

