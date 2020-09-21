import React, { CSSProperties, MutableRefObject, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components'
import Column from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { MenuItem } from './styleds'
import { TokenType } from '../../state/token/types'

function currencyKey(currency: TokenType): number {
  return currency.id;
}

const CurrencyListWrapper = styled.div`
  margin: 5px 25px;
`;

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style
}: {
  currency: TokenType
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const key = currencyKey(currency)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size={'24px'} />
      <Column>
        <Text title={currency.name} fontWeight={500}>
          {currency.name}
        </Text>
      </Column>
    </MenuItem>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef
}: {
  height: number
  currencies: TokenType[]
  selectedCurrency?: TokenType | null
  onCurrencySelect: (currency: TokenType) => void
  otherCurrency?: TokenType | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}) {
  const itemData = currencies;

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: TokenType = data[index]
      const isSelected = Boolean(selectedCurrency && (currencyKey(selectedCurrency) === currencyKey(currency)))
      const otherSelected = Boolean(otherCurrency && (currencyKey(otherCurrency) === currencyKey(currency)))
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [onCurrencySelect, otherCurrency, selectedCurrency]
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

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
