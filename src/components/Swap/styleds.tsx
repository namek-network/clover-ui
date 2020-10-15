import _ from 'lodash';
import React from 'react';
import { AlertTriangle } from 'react-feather';
import styled, { css } from 'styled-components';
import { Text } from 'rebass';
import { AutoColumn } from '../Column';
import { AutoRow } from '../Row';
import CurrencyLogo from '../CurrencyLogo';
import { TokenType } from '../../state/token/types';

export const Wrapper = styled.div`
  position: relative;
`;

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  padding: 2px;

  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`;

export const SectionBreak = styled.div`
  height: 1px;
  width: 100%;
  background-color: #EDEEF2;
`;

export const BottomGrouping = styled.div`
  margin-top: 1rem;
`;

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.red1
      : severity === 2
      ? theme.yellow2
      : severity === 1
      ? theme.text1
      : theme.green1};
`;

export const StyledBalanceMaxMini = styled.button`
  height: 22px;
  width: 22px;
  background-color: ${({ theme }) => theme.bg2};
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.4rem;
  cursor: pointer;
  color: #565A69;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;

  :hover {
    background-color: #EDEEF2;
  }
  :focus {
    background-color: #EDEEF2;
    outline: none;
  }
`;

export const TruncatedText = styled(Text)`
  text-overflow: ellipsis;
  width: 220px;
  overflow: hidden;
`;

// styles
export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`;

const SwapCallbackErrorInner = styled.div`
  background-color: transparentize(0.9, #FF6871);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: #FF6871;
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`;

const SwapCallbackErrorInnerAlertTriangle = styled.div`
  background-color: transparentize(0.9, #FF6871);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  border-radius: 12px;
  min-width: 48px;
  height: 48px;
`;

export function SwapCallbackError({ error }: { error: string }) {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <AlertTriangle size={24} />
      </SwapCallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </SwapCallbackErrorInner>
  )
};

export const SwapShowAcceptChanges = styled(AutoColumn)`
  background-color: transparentize(0.9, #ff007a);
  color: #ff007a;
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`;

const RouteContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RouteSeparator = styled.span`
  font-size: 16px;
  font-family: fontoed;
  color: #666F83;

  margin-left: 5px;
`

export function SwapRoutes({
  routes,
  tokenTypesByName
}: {
  routes: string[],  // array of routed token names
  tokenTypesByName: {[name: string]: TokenType}  // supported token lists keyed by name
}) {

  return (
    <AutoRow justify='flex-start'>
      {routes.map((route, index) => (
        <RouteContainer>
          {(index > 0) && (
            <RouteSeparator>
              <i className='fo-chevron-right' />
            </RouteSeparator>
          )}
          <CurrencyLogo currency={_.get(tokenTypesByName, route)} size={'30px'} />
        </RouteContainer>
      ))}
    </AutoRow>
  );
}
