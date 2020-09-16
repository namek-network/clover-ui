import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { TokenType } from '../../state/token/types';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import { ReactComponent as DropDown }  from '../../assets/images/dropdown.svg';
import { escapeRegExp } from '../../utils'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  z-index: 1;

  border-radius: 16px;
  background-color: #FFFFFF;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
  padding-top: 8px;
  padding-bottom: 8px;
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
    outline: none;
  }
`

const Aligner = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
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
  width: 0;
  height: 50px;
  line-height: 50px;
  position: relative;
  font-weight: 500;
  font-family: Roboto-Medium, Roboto;
  outline: none;
  border: none;
  flex: 1 1 auto;
  color: #111A34;
  background-color: #FFFFFF;
  font-size: 40px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
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
    color: #E2E4EA;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const StyledBalanceMax = styled.button`
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  color: #FF8212;
  border: none;
  background: none;
  :hover {
    color: ${darken(0.08, '#FF8212')}
  }
  :focus {
    outline: none;
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: #858B9C;
  margin: 0px 25px;
`;

const Balance = styled.span`
  align-self: flex-end;
  margin: 10px 25px 10px 0px;
  font-size: 14px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #666F83;
`;

interface CurrencyInputPanelProps {
  id: string,
  value: string
  onUserInput: (value: string) => void,
  currency?: TokenType | null,
  onCurrencySelect: (currency: TokenType) => void,
  balance?: string | null,
  showBalance?: boolean | null,
  showMaxButton: boolean,
  onMax?: () => void
}

export default function CurrencyInputPanel({
  id,
  value,
  onUserInput,
  currency,
  onCurrencySelect,
  balance,
  showBalance,
  showMaxButton,
  onMax
}: CurrencyInputPanelProps) {

  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id}>
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
            <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.name)}>
                {(currency && currency.name && currency.name.length > 20
                  ? currency.name.slice(0, 4) +
                    '...' +
                    currency.name.slice(currency.name.length - 5, currency.name.length)
                  : currency?.name) || 'Select a token'}
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
          value={value}
          onChange={event => {
            // replace commas with periods, because bithumb exclusively uses period as the decimal separator
            const nextUserInput = event.target.value.replace(/,/g, '.');
            const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
            if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
              onUserInput(nextUserInput)
            }
          }}
        />

        {showMaxButton && (
          <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
        )}
      </InputRow>

      <Separator />

      {showBalance && (
        <Balance>Balance: {balance}</Balance>
      )}

      <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          selectedCurrency={currency}
          onCurrencySelect={onCurrencySelect}
        />

    </InputPanel>
  )
}
