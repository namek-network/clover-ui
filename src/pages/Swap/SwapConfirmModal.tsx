import React, { useCallback, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import styled, { keyframes } from 'styled-components'
import { Button as RebassButton } from 'rebass/styled-components'
import { darken } from 'polished';
import { TokenType } from '../../state/token/types'
import Modal from '../../components/Modal'
import Column, { AutoColumn } from '../../components/Column'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Text } from 'rebass'
import { X } from 'react-feather'

const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
  color: #CCCCCC;
`

const ContentWrapper = styled(AutoColumn)`
  margin: 10px; 15px;
`;

const ConfirmSwapButton = styled(RebassButton)`
  padding: 18px;
  height: 49px;
  width: 100%;
  text-align: center;
  border-radius: 8px;
  outline: none;
  border: 1px solid transparent;
  text-decoration: none;
  background: #FF6E12;
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 500;
  font-family: Helvetica;

  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;

  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }

  &:focus {
    background-color: ${({ disabled }) => !disabled && darken(0.08, '#FF6E12')};
    outline: none;
  }
  &:hover {
    background-color: ${({ disabled }) => !disabled && darken(0.08, '#FF6E12')};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: #FDEAF1;
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

const FromToText = styled(Text)`
  height: 16px;
  font-size: 18px;
  font-family: Helvetica;
  color: #111A34;
  line-height: 16px;
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '15px')};
`

const TokenAmountText = styled(Text)`
  height: 50px;
  font-size: 40px;
  font-family: Roboto-Medium, Roboto;
  font-weight: 500;
  color: #111A34;
  line-height: 50px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
`;

const HintText = styled(Text)`
  height: 48px;
  font-size: 16px;
  font-family: Helvetica-Light, Helvetica;
  font-weight: 300;
  color: #666F83;
  line-height: 24px;
`;

const TransactionInfoPanel = styled(AutoColumn)`
  background: #F9FAFB;
  border-radius: 8px;
`;

const TransactionInfoLabel = styled.span`
  font-size: 14px;
  font-family: Helvetica;
  color: #858B9C;
  margin-right: 5px;
`;

const TransactionInfo = styled.span`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #41485D;
`;

interface SwapConfirmhModalProps {
  isOpen: boolean
  onDismiss: () => void
  onConfirmSwap: () => void
  fromToken?: TokenType
  fromTokenAmount?: string
  toToken?: TokenType
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onConfirmSwap,
  fromToken,
  fromTokenAmount,
  toToken
}: SwapConfirmhModalProps) {


  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={50}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap='14px'>

          <RowBetween>
            <Text fontWeight={500} fontSize={16} color='#777777'>
              Confirm Swap
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>

          <ContentWrapper gap='14px'>
            <AutoColumn gap='5px'>
              <FromToText>From</FromToText>
              <AutoRow justify='start'>
                <RowFixed style={{minWidth: '120px'}}>
                  <CurrencyLogo currency={fromToken} size={'24px'} />
                  <StyledTokenName className="token-symbol-container" active={true}>
                    {fromToken?.name}
                  </StyledTokenName>
                </RowFixed>
                <TokenAmountText>{fromTokenAmount}</TokenAmountText>
              </AutoRow>
            </AutoColumn>

            <AutoColumn gap='5px'>
              <FromToText>To</FromToText>
              <AutoRow justify='start'>
                <RowFixed style={{minWidth: '120px'}}>
                  <CurrencyLogo currency={toToken} size={'24px'} />
                  <StyledTokenName className="token-symbol-container" active={true}>
                    {toToken?.name}
                  </StyledTokenName>
                </RowFixed>
                <TokenAmountText>3.2235</TokenAmountText>
              </AutoRow>
            </AutoColumn>

            <AutoRow justify='space-between'></AutoRow>

            <HintText>Output is estimated. If the price changes by more than 0.5%. your transaction will revert.</HintText>

            <TransactionInfoPanel gap='6px'>
              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Price</TransactionInfoLabel>
                <TransactionInfo>2.99967 {toToken?.name}/{fromToken?.name}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Minimum sent</TransactionInfoLabel>
                <TransactionInfo>2.99967 {toToken?.name}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Price Impact</TransactionInfoLabel>
                <TransactionInfo>5.27%</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Liquility Provder Fee</TransactionInfoLabel>
                <TransactionInfo>0.0015 DOT</TransactionInfo>
              </AutoRow>

            </TransactionInfoPanel>
          </ContentWrapper>


          <ConfirmSwapButton onClick={onConfirmSwap}>Confirm Swap</ConfirmSwapButton>

        </PaddedColumn>
      </Column>
    </Modal>
  )
}
