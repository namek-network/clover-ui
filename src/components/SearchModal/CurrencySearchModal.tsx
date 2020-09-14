import React, { useCallback, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { Token } from '../../state/token/types'
import useLast from '../../hooks/useLast'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Token | null,
  onCurrencySelect: (currency: Token) => void
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  selectedCurrency,
  onCurrencySelect
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const handleCurrencySelect = useCallback(
    (currency: Token) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={80}>
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          selectedCurrency={selectedCurrency}
          onCurrencySelect={handleCurrencySelect}
        />
    </Modal>
  )
}
