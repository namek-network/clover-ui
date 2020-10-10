import React from 'react';
import { AlertTriangle } from 'react-feather';
import styled, { css } from 'styled-components';
import { Text } from 'rebass';
import { AutoColumn } from '../../components/Column';

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

export function SwapCallbackError({ error }: { error: string }): React.ReactElement {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <AlertTriangle size={24} />
      </SwapCallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </SwapCallbackErrorInner>
  )
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  background-color: transparentize(0.9, #ff007a);
  color: #ff007a;
  padding: 0.5rem;
  border-radius: 12px;
  margin-top: 8px;
`;
