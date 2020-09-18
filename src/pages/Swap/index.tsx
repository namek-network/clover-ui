import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { ArrowDown, RefreshCw, Info } from 'react-feather';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import { AutoColumn } from '../../components/Column';
import { AutoRow, RowBetween, RowFixed } from '../../components/Row';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { Wrapper, ArrowWrapper, BottomGrouping } from '../../components/Swap/styleds';
import SwapConfirmhModal from './SwapConfirmModal';
import { convertToShow, convertToShowSI } from '../../utils/balanceUtils'
import { TokenType } from '../../state/token/types';
import { useTokenTypes } from '../../state/token/hooks';
import { useFromToken, useFromTokenAmount, useToToken, useToTokenAmount, useSetFromToken, useSetToToken, useSetFromTokenAmount, useSetToTokenAmount, useSwitchFromToTokens } from '../../state/swap/hooks';
import { AccountInfo } from '../../state/wallet/types';
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import WalletSelectDialog from '../../components/WalletComp/walletSelectDialog'
import { supportedWalletTypes, loadAccount } from '../../utils/AccountUtils'
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useTranslation } from 'react-i18next'

const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: 1rem;
`;

const ArrowCircle = styled.div`
  width: 42px;
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
    }
  }
`

const TransactionInfoPanel = styled(BottomGrouping)`
  padding: 0px 15px;
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

const TransactionPriceRefreshWapper = styled.div`
  margin-left: 10px;
  width: 15px;
  height: 15px;
  background: #F3F4F7;
  border-radius: 2px;

  cursor: pointer;
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }

  display: flex;
  justify-content: center;
  align-items: center;
`;

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
  const updateAccountInfo = useAccountInfoUpdate()

  const [walletConnected, setWalletConnected] = useState(!_.isEmpty(_.get(accountInfo, 'address', '')))

  const tokenAmounts = _.get(accountInfo, 'tokenAmounts', []);
  const fromTokenBalance = _.get(_.find(tokenAmounts, t => t.tokenType.id == fromToken?.id), 'amount', '');
  const toTokenBalance = _.get(_.find(tokenAmounts, t => t.tokenType.id == toToken?.id), 'amount', '');

  const handleSetMaxFromTokenAmount = () => setFromTokenAmount(convertToShow(fromTokenBalance));

  const insufficientBalance =  walletConnected && (_.toNumber(fromTokenAmount) > _.toNumber(fromTokenBalance));

  const showPrice = fromToken && toToken && fromToken.id != toToken.id;
  const showTransactionInfo = showPrice && _.toNumber(fromTokenAmount) > 0 && _.toNumber(toTokenAmount) > 0;

  const swapEnabled = walletConnected && fromToken != null && toToken != null && _.toNumber(fromTokenAmount) > 0 && !insufficientBalance;

  const [swapConfirmModalOpen, setSwapConfirmModalOpen] = useState(false);

  const [walletSelectorOpen, setWalletSelectorOpen] = useState(false);

  const myTokenTypes = useTokenTypes()
  const { t } = useTranslation()

  const handleClose = (value: any) => {
    setWalletSelectorOpen(false)
    if (_.isEmpty(value)) {
      return
    }

    async function getAcount() {
      const msg = await loadAccount(value, myTokenTypes, updateAccountInfo);
      if (msg !== 'ok') {
        toast(t(msg))
      }
    }

    getAcount()
  };

  useEffect(() => {
    setWalletConnected(!_.isEmpty(_.get(accountInfo, 'address', '')))
  }, [accountInfo])

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
            balance={convertToShowSI(fromTokenBalance)}
            showBalance={walletConnected}
            showMaxButton={walletConnected}
            onMax={handleSetMaxFromTokenAmount}
            insufficientBalance={insufficientBalance}
          />

          <AutoRow justify='center' gap='-30px' style={{ padding: '0 1rem', zIndex: 2 }}>
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
          
          <CurrencyInputPanel
            id="swap-currency-output"
            value={toTokenAmount || ''}
            onUserInput={handleSetToTokenAmount}
            currency={toToken}
            onCurrencySelect={handleToTokenSelect}
            balance={convertToShowSI(toTokenBalance)}
            showBalance={walletConnected}
            showMaxButton={false}
            insufficientBalance={false}
          />

        </AutoColumn>

        <BottomGrouping>
          {!walletConnected &&
            <ConnectWalletButton onClick={() => {setWalletSelectorOpen(true)}}>Connect Wallet</ConnectWalletButton>
          }
          {walletConnected &&
            <SwapButton disabled={!swapEnabled} onClick={() => setSwapConfirmModalOpen(true)}>Swap</SwapButton>
          }
        </BottomGrouping>

        {(showPrice || showTransactionInfo) && (
          <TransactionInfoPanel>
            <AutoColumn gap={'sm'}>
              {showPrice && (
                <AutoRow justify='space-between'>
                  <TransactionInfoLabel>Price:</TransactionInfoLabel>
                  <RowFixed>
                    <TransactionInfo>0.0125 {toToken?.name} per {fromToken?.name}</TransactionInfo>
                    <TransactionPriceRefreshWapper>
                      <RefreshCw
                        width='10px'
                        height='10px'
                        line-height='10px'
                        fontSize='10px'
                        fontFamily='fontoed'
                        color='#858B9C'
                        onClick={() => {}}
                      />
                    </TransactionPriceRefreshWapper>
                  </RowFixed>
                </AutoRow>
              )}

              {showTransactionInfo && (
                <>
                  <AutoRow justify='space-between'>
                    <RowFixed>
                      <TransactionInfoLabel>Minimum Received:</TransactionInfoLabel>
                      <Info
                          width='16px'
                          height='16px'
                          line-height='16px'
                          fontSize='16px'
                          fontFamily='fontoed'
                          color='#F5A623'
                          cursor='pointer'
                          onClick={() => {}}
                        />
                    </RowFixed>
                    <TransactionInfo>2.99967 {toToken?.name}</TransactionInfo>
                  </AutoRow>

                  <AutoRow justify='space-between'>
                    <RowFixed>
                      <TransactionInfoLabel>Price Impact:</TransactionInfoLabel>
                      <Info
                          width='16px'
                          height='16px'
                          line-height='16px'
                          fontSize='16px'
                          fontFamily='fontoed'
                          color='#F5A623'
                          cursor='pointer'
                          onClick={() => {}}
                        />
                    </RowFixed>
                    <TransactionInfo>5.27%</TransactionInfo>
                  </AutoRow>

                  <AutoRow justify='space-between'>
                    <RowFixed>
                      <TransactionInfoLabel>Liquility Provder Fee:</TransactionInfoLabel>
                      <Info
                          width='16px'
                          height='16px'
                          line-height='16px'
                          fontSize='16px'
                          fontFamily='fontoed'
                          color='#F5A623'
                          cursor='pointer'
                          onClick={() => {}}
                        />
                    </RowFixed>
                    <TransactionInfo>0.003 ETH</TransactionInfo>
                  </AutoRow>

                  <AutoRow justify='space-between'>
                    <TransactionInfoLabel>Route:</TransactionInfoLabel>
                    <TransactionInfo>{fromToken?.name} &gt; {toToken?.name}</TransactionInfo>
                  </AutoRow>

                </>
              )}

            </AutoColumn>
          </TransactionInfoPanel>
        )}

      </Wrapper>

      {swapEnabled && (
        <SwapConfirmhModal
          isOpen={swapConfirmModalOpen}
          onDismiss={() => setSwapConfirmModalOpen(false)}
          onConfirmSwap={() => setSwapConfirmModalOpen(false)}
          fromToken={fromToken}
          fromTokenAmount={fromTokenAmount}
          toToken={toToken}
        />
      )}

      <WalletSelectDialog 
          accountTypes={supportedWalletTypes} 
          open={walletSelectorOpen} 
          onClose={handleClose}></WalletSelectDialog>

    </BodyWrapper>
  );
}
