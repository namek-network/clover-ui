import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { ArrowDown } from 'react-feather';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import { AutoColumn } from '../../components/Column';
import { AutoRow, RowBetween } from '../../components/Row';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { Wrapper, ArrowWrapper, BottomGrouping } from '../../components/Swap/styleds';
import { convertToShow } from '../../utils/balanceUtils'
import { TokenType } from '../../state/token/types';
import { useTokenTypes } from '../../state/token/hooks';
import { useFromToken, useFromTokenAmount, useToToken, useToTokenAmount, useSetFromToken, useSetToToken, useSetFromTokenAmount, useSetToTokenAmount, useSwitchFromToTokens } from '../../state/swap/hooks';
import { AccountInfo } from '../../state/wallet/types';
import { useAccountInfo } from '../../state/wallet/hooks';

const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: 1rem;
`;

const ArrowCircle = styled.div`
  width: 40px;
  height: 40px;
  background: #FCF0DC;
  border: 2px solid #F7F8F9;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConnectWalletButton = styled(RebassButton)`
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
`

const SwapButton = styled(RebassButton)`
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

export default function Swap() {

  const fromToken = useFromToken();
  const fromTokenAmount = useFromTokenAmount();
  const toToken = useToToken();
  const toTokenAmount = useToTokenAmount();

  const setFromToken = useSetFromToken();
  const handleFromTokenSelect = (selectedToken: TokenType) => setFromToken(selectedToken);

  const setFromTokenAmount = useSetFromTokenAmount();
  const handleSetFromTokenAmount = (amount: string) => setFromTokenAmount(amount);

  const setToToken = useSetToToken();
  const handleToTokenSelect = (toToken: TokenType) => setToToken(toToken);

  const setToTokenAmount = useSetToTokenAmount();
  const handleSetToTokenAmount = (amount: string) => setToTokenAmount(amount);

  const switchFromToToken = useSwitchFromToTokens();

  const accountInfo = useAccountInfo();
  const walletConnected = !_.isEmpty(_.get(accountInfo, 'address', ''));

  const tokenAmounts = _.get(accountInfo, 'tokenAmounts', []);
  const fromTokenBalance = _.get(_.find(tokenAmounts, t => t.tokenType.id == fromToken?.id), 'amount', '');
  const toTokenBalance = _.get(_.find(tokenAmounts, t => t.tokenType.id == toToken?.id), 'amount', '');

  const handleSetMaxFromTokenAmount = () => setFromTokenAmount(fromTokenBalance);

  const insufficientBalance = _.toNumber(fromTokenAmount) > _.toNumber(fromTokenBalance);

  return (
    <BodyWrapper>
      <SwapPoolTabs active={'swap'} />
      <Wrapper id="swap-page">
        <AutoColumn gap={'md'}>
          <CurrencyInputPanel
              id="swap-currency-input"
              value={fromTokenAmount || ''}
              onUserInput={handleSetFromTokenAmount}
              currency={fromToken}
              onCurrencySelect={handleFromTokenSelect}
              balance={convertToShow(fromTokenBalance)}
              showBalance={walletConnected}
              showMaxButton={walletConnected}
              onMax={handleSetMaxFromTokenAmount}
              insufficientBalance={insufficientBalance}
            />
          <AutoColumn justify="space-between">
            <AutoRow justify='center' style={{ padding: '0 1rem' }}>
              <ArrowWrapper clickable>
                <ArrowCircle>
                  <ArrowDown
                    width='20px'
                    height='18px'
                    line-height='20px'
                    fontSize='8px'
                    fontFamily='fontoed'
                    color='#F99E3C'
                    onClick={() => switchFromToToken()}
                  />
                </ArrowCircle>
              </ArrowWrapper>
            </AutoRow>
          </AutoColumn>
          <CurrencyInputPanel
            id="swap-currency-output"
            value={toTokenAmount || ''}
            onUserInput={handleSetToTokenAmount}
            currency={toToken}
            onCurrencySelect={handleToTokenSelect}
            balance={convertToShow(toTokenBalance)}
            showBalance={walletConnected}
            showMaxButton={false}
            insufficientBalance={false}
          />
        </AutoColumn>
        <BottomGrouping>
          {!walletConnected &&
            <ConnectWalletButton onClick={() => {}}>Connect Wallet</ConnectWalletButton>
          }
          {walletConnected &&
            <SwapButton onClick={() => {}}>Swap</SwapButton>
          }
        </BottomGrouping>
      </Wrapper>
    </BodyWrapper>
  );
}
