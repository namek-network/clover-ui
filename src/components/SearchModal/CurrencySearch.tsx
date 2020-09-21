import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { X } from 'react-feather'
import Column from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween } from '../Row'
import CurrencyList from './CurrencyList'
import { filterTokens } from './filtering'
import { TokenType } from '../../state/token/types'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useTokenTypes } from '../../state/token/hooks';

const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
  color: #CCCCCC;
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: TokenType | null,
  onCurrencySelect: (currency: TokenType) => void,
  otherSelectedCurrency?: TokenType | null
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  onDismiss,
  isOpen
}: CurrencySearchProps) {
  const allTokens = useTokenTypes();

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredTokens: TokenType[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [allTokens, searchQuery])

  const handleCurrencySelect = useCallback(
    (currency: TokenType) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

   // clear the input on open
   useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    setSearchQuery(input)
    fixedList.current?.scrollTo(0)
  }

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16} color='#777777'>
            Select a token
          </Text>
          <QuestionHelper text="Find a token by searching for its name or symbol." />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder='Search token name'
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={() => {}}
        />
      </PaddedColumn>

      <Separator />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              currencies={filteredTokens}
              selectedCurrency={selectedCurrency}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>

    </Column>
  )
}
