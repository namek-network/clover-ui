import React, { useCallback } from 'react'
import { TokenType } from '../../state/token/types'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'
import { TokenPair } from '../CurrencyInputPanel'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: TokenType | null,
  onCurrencySelect: (currency: TokenType) => void,
  otherSelectedCurrency?: TokenType | null,
  forPair: boolean,
  selectedPair?: TokenPair,
  onPairSelect?: (pair: TokenPair) => void
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  forPair = false,
  selectedPair,
  onPairSelect
}: CurrencySearchModalProps): React.ReactElement {

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

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={50}>
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          selectedCurrency={selectedCurrency}
          onCurrencySelect={handleCurrencySelect}
          otherSelectedCurrency={otherSelectedCurrency}
          forPair={forPair}
          selectedPair={selectedPair}
          onPairSelect={handlePairSelect}
        />
    </Modal>
  )
}
