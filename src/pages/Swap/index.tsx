import _ from 'lodash';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { darken } from 'polished'
import { ArrowDown } from 'react-feather';
import { AutoColumn } from '../../components/Column';
import { AutoRow, RowBetween } from '../../components/Row';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { Wrapper, ArrowWrapper, BottomGrouping } from '../../components/Swap/styleds';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import { TokenType } from '../../state/token/types';
import { useTokenTypes } from '../../state/token/hooks';
import { useFromToken, useFromTokenAmount, useToToken, useToTokenAmount, useSetFromToken, useSetToToken, useSetFromTokenAmount, useSetToTokenAmount, useSwitchFromToTokens } from '../../state/swap/hooks';

const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
  border-radius: 16px;
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

const ConnectWallet = styled(RebassButton)`
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
    // box-shadow: 0 0 0 1pt ${({ disabled }) => !disabled && darken(0.03, '#FF6E12')};
    background-color: ${({ disabled }) => !disabled && darken(0.08, '#FF6E12')};
  }
  &:hover {
    background-color: ${({ disabled }) => !disabled && darken(0.08, '#FF6E12')};
  }
  &:active {
    // box-shadow: 0 0 0 1pt ${({ disabled }) => !disabled && darken(0.05, '#FF6E12')};
    background-color: ${({ disabled }) => !disabled && darken(0.05, '#FF6E12')};
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
          />
        </AutoColumn>
        <BottomGrouping>
          <ConnectWallet onClick={() => {}}>Connect Wallet</ConnectWallet>
        </BottomGrouping>
      </Wrapper>
    </BodyWrapper>
  );
}

