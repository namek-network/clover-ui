import _ from 'lodash';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ArrowDown } from 'react-feather';
import { AutoColumn } from '../../components/Column';
import { AutoRow, RowBetween } from '../../components/Row';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { Wrapper, ArrowWrapper } from '../../components/Swap/styleds';
import { Token } from '../../state/token/types';
import { useTokens } from '../../state/token/hooks';
import { useFromToken, useFromTokenAmount, useToToken, useToTokenAmount, useSetFromToken, useSetToToken, useSwitchFromToTokens } from '../../state/swap/hooks';

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

export default function Swap() {

  const fromToken = useFromToken();
  const toToken = useToToken();


  const setFromToken = useSetFromToken();
  const handleFromTokenSelect = (selectedToken: Token) => setFromToken(selectedToken);

  const setToToken = useSetToToken();
  const handleToTokenSelect = (toToken: Token) => setToToken(toToken);

  const switchFromToToken = useSwitchFromToTokens();

  return (
    <BodyWrapper>
      <SwapPoolTabs active={'swap'} />
      <Wrapper id="swap-page">
        <AutoColumn gap={'md'}>
          <CurrencyInputPanel
              id="swap-currency-input"
              value=''
              onUserInput={value => {}}
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
            value=''
            onUserInput={value => {}}
            currency={toToken}
            onCurrencySelect={handleToTokenSelect}
          />
        </AutoColumn>
      </Wrapper>
    </BodyWrapper>
  );
}

