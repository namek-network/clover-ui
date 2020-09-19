import React, { useCallback, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { TokenType } from '../../state/token/types'
import useLast from '../../hooks/useLast'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: TokenType | null,
  onCurrencySelect: (currency: TokenType) => void,
  otherSelectedCurrency?: TokenType | null
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const handleCurrencySelect = useCallback(
    (currency: TokenType) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={50}>
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          selectedCurrency={selectedCurrency}
          onCurrencySelect={handleCurrencySelect}
          otherSelectedCurrency={otherSelectedCurrency}
        />
    </Modal>
  )
}
