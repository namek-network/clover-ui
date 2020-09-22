import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { Button as RebassButton } from 'rebass/styled-components'
import { AutoColumn } from '../../components/Column';
import { AutoRow, RowFixed } from '../../components/Row';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { Wrapper, BottomGrouping } from '../../components/Swap/styleds';
import SwapConfirmhModal from './SwapConfirmModal';
import { TokenType } from '../../state/token/types';
import { useTokenTypes } from '../../state/token/hooks';
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import { useApiInited } from '../../state/api/hooks';
import BigNum  from '../../types/bigNum';
import WalletSelectDialog from '../../components/WalletComp/walletSelectDialog'
import { supportedWalletTypes, loadAccount } from '../../utils/AccountUtils'
import { api } from '../../utils/apiUtils';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'
import '../../assets/vendors/font-bxb/bxb-font.css'
import './index.css'

const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
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
  const apiInited = useApiInited();

  const [fromToken, setFromToken] = useState<TokenType | null>(null);
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('');

  const [toToken, setToToken] = useState<TokenType | null>(null);
  const [toTokenAmount, setToTokenAmount] = useState('');

  const handleSetFromTokenAmount = (amount: string) => {
    if (_.isEmpty(amount)) { return; }
    setFromTokenAmount(amount);
    setToTokenAmount('');
  }

  const handleSetToTokenAmount = (amount: string) => {
    if (_.isEmpty(amount)) { return; }
    setToTokenAmount(amount);
    setFromTokenAmount('');
  }

  const handleSwitchFromToToken = () => {
    setFromToken(toToken);
    setFromTokenAmount(toTokenAmount);
    setToToken(fromToken)
    setToTokenAmount(fromTokenAmount);
  }

  const handleFromTokenSelect = (selectedToken: TokenType) => {
    if (toToken != null && selectedToken.id === toToken.id) {
      handleSwitchFromToToken();
    } else {
      setFromToken(selectedToken);
    }
    setPriceReverse(false);
  };
  
  const handleToTokenSelect = (selectedToken: TokenType) => {
    if (fromToken != null && selectedToken.id === fromToken.id) {
      handleSwitchFromToToken();
    } else {
      setToToken(selectedToken);
    }
    setPriceReverse(false);
  };
  
  const accountInfo = useAccountInfo();
  const updateAccountInfo = useAccountInfoUpdate()

  const [walletConnected, setWalletConnected] = useState(!_.isEmpty(_.get(accountInfo, 'address', '')))

  const tokenAmounts = _.get(accountInfo, 'tokenAmounts', []);
  const fromTokenBalance: BigNum = BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === fromToken?.id), 'amountBN', BigNum.SerizableZero));
  const toTokenBalance: BigNum = BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === toToken?.id), 'amountBN', BigNum.SerizableZero));

  const handleSetMaxFromTokenAmount = () => setFromTokenAmount(fromTokenBalance.realNum);

  const insufficientBalance =  walletConnected && (BigNum.fromRealNum(fromTokenAmount ?? '').gt(fromTokenBalance));

  const [priceReverse, setPriceReverse] = useState<boolean>(false);
  const [priceInfo, setPriceInfo] = useState('');
  const showPrice = fromToken && toToken && fromToken.id !== toToken.id;
  useEffect(() => {
    if (!apiInited || fromToken == null || toToken == null || fromToken.id === toToken.id) {
      setPriceInfo('');
      return;
    }

    async function fetchPrice() {
      const sourceToken = priceReverse ? (toToken as TokenType).name : (fromToken as TokenType).name;
      const targetToken = priceReverse ? (fromToken as TokenType).name : (toToken as TokenType).name
      /**
       * sample result:
       * "result": {
            "balance": "7242",
            "routes": ["BUSD", "DOT"]
        },
       */
      const { balance: balance, routes: routes } = await api.targetAmountAvailable(sourceToken, targetToken, BigNum.fromRealNum('1').bigNum);
      const price = BigNum.fromBigNum(balance.toString()).realNum;
      setPriceInfo(`${price} ${targetToken} per ${sourceToken}`);
    }

    fetchPrice();
  }, [apiInited, fromToken, toToken, priceReverse]);

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
            value={fromTokenAmount ?? ''}
            onUserInput={handleSetFromTokenAmount}
            currency={fromToken}
            onCurrencySelect={handleFromTokenSelect}
            otherCurrency={toToken}
            balance={fromTokenBalance.realNum}
            showBalance={walletConnected}
            showMaxButton={walletConnected}
            onMax={handleSetMaxFromTokenAmount}
            insufficientBalance={insufficientBalance}
          />

          <AutoRow justify='center' gap='-30px' style={{ padding: '0 1rem', zIndex: 2 }}>
            <div className='switch-circle' onClick={() => handleSwitchFromToToken()}>
              <span>
                <i className='fo-arrow-down switch-icon switch-icon-default'></i>
                <i className='fo-repeat switch-icon switch-icon-onhover'></i>
              </span>
            </div>
          </AutoRow>
          
          <CurrencyInputPanel
            id="swap-currency-output"
            value={toTokenAmount || ''}
            onUserInput={handleSetToTokenAmount}
            currency={toToken}
            onCurrencySelect={handleToTokenSelect}
            otherCurrency={fromToken}
            balance={toTokenBalance.realNum}
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
                    <TransactionInfo>{priceInfo}</TransactionInfo>
                    <TransactionPriceRefreshWapper onClick={() => setPriceReverse(!priceReverse)}>
                        <i className='fo-repeat refresh-price' />
                    </TransactionPriceRefreshWapper>
                  </RowFixed>
                </AutoRow>
              )}

              {showTransactionInfo && (
                <>
                  <AutoRow justify='space-between'>
                    <RowFixed>
                      <TransactionInfoLabel>Minimum Received:</TransactionInfoLabel>
                      <i className='fo-info clover-info' onClick={() => {}}></i>
                    </RowFixed>
                    <TransactionInfo>2.99967 {toToken?.name}</TransactionInfo>
                  </AutoRow>

                  <AutoRow justify='space-between'>
                    <RowFixed>
                      <TransactionInfoLabel>Price Impact:</TransactionInfoLabel>
                      <i className='fo-info clover-info' onClick={() => {}}></i>
                    </RowFixed>
                    <TransactionInfo>5.27%</TransactionInfo>
                  </AutoRow>

                  <AutoRow justify='space-between'>
                    <RowFixed>
                      <TransactionInfoLabel>Liquility Provder Fee:</TransactionInfoLabel>
                      <i className='fo-info clover-info' onClick={() => {}}></i>
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
          fromToken={fromToken == null ? undefined : fromToken}
          fromTokenAmount={fromTokenAmount}
          toToken={toToken == null ? undefined : toToken}
        />
      )}

      <WalletSelectDialog 
          accountTypes={supportedWalletTypes} 
          open={walletSelectorOpen} 
          onClose={handleClose}></WalletSelectDialog>

    </BodyWrapper>
  );
}
