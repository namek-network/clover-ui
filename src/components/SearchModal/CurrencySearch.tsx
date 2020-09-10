import Currency from '../../entities/currency';
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import ReactGA from 'react-ga'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { X } from 'react-feather'
import Column from '../Column'
import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween } from '../Row'
import CurrencyList from './CurrencyList'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'

const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
}

export function CurrencySearch({
  selectedCurrency,
  onDismiss,
  isOpen
}: CurrencySearchProps) {

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')

   // clear the input on open
   useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    setSearchQuery(input)
    fixedList.current?.scrollTo(0)
  }, [])

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token
            <QuestionHelper text="Find a token by searching for its name or symbol or by pasting its address below." />
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder='Search token name'
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={() => {}}
          onKeyDown={() => {}}
        />
        <RowBetween>
          <Text fontSize={14} fontWeight={500}>
            Token Name
          </Text>
        </RowBetween>
      </PaddedColumn>

      <Separator />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              currencies={Currency.BuiltinCurrencies}
              selectedCurrency={selectedCurrency}
              onCurrencySelect={() => {}}
              otherCurrency={null}
              fixedListRef={fixedList}
              showDot={false}
            />
          )}
        </AutoSizer>
      </div>

    </Column>
  )
}
