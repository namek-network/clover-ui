import React, { Component } from 'react';
import styled from 'styled-components';
import { AutoColumn } from '../../components/Column'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Wrapper } from '../../components/Swap/styleds'
import Currency from '../../entities/currency';
import { useTokens } from '../../state/token/hooks';


const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
  border-radius: 16px;
  padding: 1rem;
`;

export default function Swap() {
  const tokens = useTokens();
  console.log('supported tokens: ', tokens);

  return (
    <BodyWrapper>
        <SwapPoolTabs active={'swap'} />
        <Wrapper id="swap-page">
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
                id="swap-currency-input"
                label='From'
                value=''
                onUserInput={value => {}}
                currency={Currency.Dot}
              />
            <CurrencyInputPanel
              id="swap-currency-output"
              label='To'
              value=''
              onUserInput={value => {}}
              currency={null}
            />
          </AutoColumn>
        </Wrapper>
      </BodyWrapper>
  );
}

