import React, { CSSProperties, MutableRefObject, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { MenuItem } from './styleds'
import { TokenPair } from '../CurrencyInputPanel'
import { PairIconTitle } from '../../pages/Pool/poolPairItem'

function pairKey(pair: TokenPair): string {
  return pair.fromToken.name + pair.toToken.name;
}

const CurrencyListWrapper = styled.div`
  margin: 5px 25px;
`;

function PairRow({
  pair,
  onSelect,
  isSelected,
  style
}: {
  pair: TokenPair
  onSelect: () => void
  isSelected: boolean
  style: CSSProperties
}) {
  const key = pairKey(pair)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
    >
      <PairIconTitle 
        left={pair.fromToken.logo ?? ''} 
        right={pair.toToken.logo ?? ''} 
        title={`${pair.fromToken.name}/${pair.toToken.name}`}
        showTitle={true}/>
      {/* <CurrencyLogo currency={currency} size={'24px'} />
      <Column>
        <Text title={currency.name} fontWeight={500}>
          {currency.name}
        </Text>
      </Column> */}
    </MenuItem>
  )
}

export default function TokenPairList({
  height,
  pairs,
  selectedPair,
  onPairSelect,
  fixedListRef
}: {
  height: number
  pairs: TokenPair[]
  selectedPair?: TokenPair | null
  onPairSelect: (pair: TokenPair) => void
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}): React.ReactElement {
  const itemData = pairs;

  const Row = useCallback(
    ({ data, index, style }) => {
      const pair: TokenPair = data[index]
      const isSelected = Boolean(selectedPair && (pairKey(selectedPair) === pairKey(pair)))
      const handleSelect = () => onPairSelect(pair)
      return (
        <PairRow
          style={style}
          pair={pair}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      )
    },
    [onPairSelect, selectedPair]
  )

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const itemKey = useCallback((index: number, data: any) => pairKey(data[index]), [])

  return (
    <CurrencyListWrapper>
      <FixedSizeList
        height={height}
        ref={fixedListRef as any}
        width="100%"
        itemData={itemData}
        itemCount={itemData.length}
        itemSize={56}
        itemKey={itemKey}
      >
        {Row}
      </FixedSizeList>
    </CurrencyListWrapper>
  )
}
