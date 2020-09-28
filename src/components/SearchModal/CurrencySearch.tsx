import _ from 'lodash'
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { X } from 'react-feather'
import Column from '../Column'
import { RowBetween } from '../Row'
import CurrencyList from './CurrencyList'
import { filterTokens, filterPairs } from './filtering'
import { TokenType } from '../../state/token/types'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useTokenTypes } from '../../state/token/hooks';
import { TokenPair } from '../CurrencyInputPanel'
import TokenPairList from '../SearchModal/TokenPairList'
import { useChainPoolPairItems } from '../../state/pool/hooks';

const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
  color: #CCCCCC;
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: TokenType | null,
  onCurrencySelect: (currency: TokenType) => void,
  otherSelectedCurrency?: TokenType | null,
  forPair?: boolean,
  selectedPair?: TokenPair,
  onPairSelect?: (pair: TokenPair) => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  onDismiss,
  isOpen,
  forPair = false,
  selectedPair,
  onPairSelect
}: CurrencySearchProps): React.ReactElement {
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

  const handlePairSelect = useCallback(
    (pair: TokenPair) => {
      onPairSelect !== undefined && onPairSelect(pair)
      onDismiss()
    },
    [onDismiss, onPairSelect]
  )

  const chainPoolItems = useChainPoolPairItems()
  const filteredPairs: TokenPair[] = useMemo(() => {
    const allPairs = _.map(chainPoolItems, (item) => {return {fromToken: item.fromToken, toToken: item.toToken}})
    return filterPairs(allPairs, searchQuery)
  }, [chainPoolItems, searchQuery])

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
            {
              forPair ? 'Select a pair' : 'Select a token'
            }
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={'Search token pair'}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={() => {''}}
        />
      </PaddedColumn>

      <Separator />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            forPair !== true ? <CurrencyList
              height={height}
              currencies={filteredTokens}
              selectedCurrency={selectedCurrency}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              fixedListRef={fixedList}
            /> 
            :
            <TokenPairList
              height={height}
              pairs={filteredPairs}
              selectedPair={selectedPair}
              onPairSelect={handlePairSelect}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>

    </Column>
  )
}
