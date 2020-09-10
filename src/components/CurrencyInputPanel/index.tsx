import Currency from '../../entities/currency';
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Text } from 'rebass'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'

const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: #F7F8FA;
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid #F7F8FA;
  background-color: #FFFFFF;
`

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: #000000;
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${darken(0.2, '#565A69')};
  }
`
const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`;

const TextFrom = styled(Text)`
  color: #565A69;
  font-weight: 500;
  font-size: 14px;
`;

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected }) => (selected ? '#FFFFFF' : '#ff007a')};
  color: ${({ selected }) => (selected ? '#000000' : '#FFFFFF')};
  border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected }) => (selected ? '#F7F8FA': darken(0.05, '#ff007a'))};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`


interface CurrencyInputPanelProps {
  id: string,
  label?: string,
  value: string
  onUserInput: (value: string) => void,
  currency?: Currency | null
}

export default function CurrencyInputPanel({
  id,
  label = 'Input',
  value,
  onUserInput,
  currency
}: CurrencyInputPanelProps) {

  const [modalOpen, setModalOpen] = useState(false)
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={false}>
        <LabelRow>
          <RowBetween>
            <TextFrom>
              {label}
            </TextFrom>
          </RowBetween>
        </LabelRow>
        <InputRow selected={false}>
          <>
            <NumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={val => {
                onUserInput(val)
              }}
            />
          </>
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => { setModalOpen(true) }}
          >
            <Aligner>
              {currency ? (
                <CurrencyLogo currency={currency} size={'24px'} />
              ) : null}
              <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.symbol) || 'Select a token'}
                </StyledTokenName>
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>

      <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          selectedCurrency={currency}
        />

    </InputPanel>
  )
}
