import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Text } from 'rebass'
import { Token } from '../../state/token/types';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import { ReactComponent as DropDown }  from '../../assets/images/dropdown.svg';

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

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`;

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  min-width: 135px;
  margin-right: ${({ selected }) => (selected ? '0px' : '10px')};
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
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  // min-width: 135px;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '15px')};
`

const StyledDropDown = styled(DropDown)`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: #C5CAD5;
    stroke-width: 1.5px;
  }
`

const NumericalInput = styled.input`
  // color: #E2E4EA;
  width: 0;
  height: 40px;
  line-height: 40px;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: #FFFFFF;
  font-size: 36px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  padding: 0px;

  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  -moz-appearance: textfield;

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: #C3C5CB;
  }
`;

interface CurrencyInputPanelProps {
  id: string,
  value: string
  onUserInput: (value: string) => void,
  currency?: Token | null,
  onCurrencySelect: (currency: Token) => void
}

export default function CurrencyInputPanel({
  id,
  value,
  onUserInput,
  currency,
  onCurrencySelect
}: CurrencyInputPanelProps) {

  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
      <Container hideInput={false}>
        <InputRow selected={false}>

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
              <StyledDropDown  />
            </Aligner>
          </CurrencySelect>

          <NumericalInput
            inputMode="decimal"
            title="Token Amount"
            autoComplete="off"
            autoCorrect="on"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder='0.0'
            minLength={1}
            maxLength={79}
            spellCheck="false"
            />
        </InputRow>
      </Container>

      <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          selectedCurrency={currency}
          onCurrencySelect={onCurrencySelect}
        />

    </InputPanel>
  )
}
