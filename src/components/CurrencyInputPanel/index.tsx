import React, { useState, useCallback } from 'react'
import styled, { css }  from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { TokenType } from '../../state/token/types'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { ButtonSmallSecondary } from '../Button'
import CurrencyLogo from '../CurrencyLogo'
import { ReactComponent as DropDown }  from '../../assets/images/dropdown.svg'
import { escapeRegExp } from '../../utils'
import { PairIconTitle } from '../../pages/Pool/poolPairItem'

const InputPanel = styled.div<{ customStyle: string|undefined }>`
  flex-shrink: 0;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  z-index: 1;
  border-radius: 16px;
  background-color: #FFFFFF;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
  padding-top: 8px;
  padding-bottom: 8px;
  ${({ customStyle }) => customStyle && css`${customStyle}`}
`

const InputRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.75rem 0.95rem 0.75rem 1rem;
`;

const CurrencySelect = styled.div<{ selected: boolean }>`
  align-items: center;
  min-width: 135px;
  margin-right: 10px;
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

  font-size: 18px;
  font-family: Helvetica;
  color: #111A34;
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

const Separator = styled.div<{insufficientBalance: boolean}>`
  height: 1px;
  background-color: ${({insufficientBalance}) => (insufficientBalance ? 'red' : '#858B9C')};
  margin: 0px 20px;
`;

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px 20px;
`;

const InsufficientBalance = styled.span`
  font-size: 14px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #FA5050;
`;

const Balance = styled.span`
  font-size: 14px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #666F83;
`;

export interface TokenPair {
  fromToken: TokenType,
  toToken: TokenType
}
interface CurrencyInputPanelProps {
  id: string,
  value: string
  onUserInput: (value: string) => void,
  currency?: TokenType | null,
  onCurrencySelect: (currency: TokenType) => void,
  otherCurrency?: TokenType | null,
  balance?: string | null,
  showBalance?: boolean | null,
  showMaxButton: boolean,
  onMax?: () => void,
  insufficientBalance?: boolean | null
  customStyle?: string,
  forPair?: boolean,
  forPairUnclickable?: boolean,
  balancePrefix?: string,
  tokenPair?: TokenPair
}

export default function CurrencyInputPanel({
  id,
  value,
  onUserInput,
  currency,
  onCurrencySelect,
  otherCurrency,
  balance,
  showBalance,
  showMaxButton,
  onMax,
  insufficientBalance,
  customStyle, 
  forPair = false,
  forPairUnclickable = false,
  balancePrefix = 'balance',
  tokenPair
}: CurrencyInputPanelProps): React.ReactElement {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id} customStyle={customStyle}>
      <InputRow>
        <CurrencySelect
          selected={true}
          onClick={() => { setModalOpen(true) }}
        >
        {(forPair !== true && !forPairUnclickable && !(currency && currency !== null)) &&
          <ButtonSmallSecondary>{t('selectAToken')}</ButtonSmallSecondary>
        }

        {(forPair !== true && !forPairUnclickable && currency && currency !== null) &&
          <Aligner>
            <CurrencyLogo currency={currency} size={'24px'} />
            <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.name)}>
                {currency.name.length > 20
                  ? currency.name.slice(0, 4) + '...' + currency.name.slice(currency.name.length - 5, currency.name.length)
                  : currency?.name}
            </StyledTokenName>
            <StyledDropDown  />
          </Aligner>
        }

        {
          forPairUnclickable && <Aligner>
            <PairIconTitle left={tokenPair?.fromToken.logo ?? ''} right={tokenPair?.toToken.logo ?? ''} title={`${tokenPair?.fromToken.name ?? ''}-${tokenPair?.toToken.name ?? ''}`} size={'32px'} fontSize={'18px'}></PairIconTitle>
          </Aligner>
        }
          {
            forPair && <Aligner>
            <StyledTokenName className="token-symbol-container" active={Boolean(forPair && tokenPair)}>
                {tokenPair 
                  && tokenPair.fromToken.id >= 0
                  && tokenPair.toToken.id >= 0
                  ? tokenPair.fromToken.name + '/' + tokenPair.toToken.name
                   : 'Select a Pair'}
            </StyledTokenName>
            <StyledDropDown  />
          </Aligner>
          }
          
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
          <StyledBalanceMax onClick={onMax}>{t('max')}</StyledBalanceMax>
        )}
      </InputRow>

      <Separator insufficientBalance={insufficientBalance || false} />

      <BalanceRow>
        <div>
          {insufficientBalance && (
            <InsufficientBalance>{t('insufficientBalance')}</InsufficientBalance> 
          )}
        </div>
        {showBalance && (
          <Balance>{t(balancePrefix)}: {balance}</Balance>
        )}
      </BalanceRow>

      <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          selectedCurrency={currency}
          onCurrencySelect={onCurrencySelect}
          otherSelectedCurrency={otherCurrency}
          forPair={forPair}
          selectedPair={tokenPair}
        />

    </InputPanel>
  )
}
