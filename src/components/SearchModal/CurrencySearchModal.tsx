import Currency from '../../entities/currency';
import React, { useCallback, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import useLast from '../../hooks/useLast'
import Modal from '../Modal'
import { CurrencySearch } from './CurrencySearch'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  selectedCurrency
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={80}>
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          selectedCurrency={selectedCurrency}
        />
    </Modal>
  )
}
