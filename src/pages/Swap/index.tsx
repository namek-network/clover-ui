import _, { reverse } from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { Button as RebassButton } from 'rebass/styled-components'
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'
import { BigNumber as BN } from "bignumber.js";
import { AutoColumn } from '../../components/Column';
import { AutoRow, RowFixed } from '../../components/Row';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { Wrapper, BottomGrouping, SwapRoutes } from '../../components/Swap/styleds';
import SwapConfirmhModal from './SwapConfirmModal';
import SwapTransStateModal from './SwapTransStateModal';
import { TokenType } from '../../state/token/types';
import { useTokenTypes } from '../../state/token/hooks';
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import { useApiInited } from '../../state/api/hooks';
import { useSlippageTol } from '../../state/settings/hooks';
import BigNum  from '../../types/bigNum';
import WalletSelectDialog from '../../components/WalletComp/walletSelectDialog'
import { supportedWalletTypes, loadAccount } from '../../utils/AccountUtils'
import { api } from '../../utils/apiUtils';
import numUtils from '../../utils/numUtils';
import swapUtils from '../../utils/swapUtils';
import sysConfig from '../../configs/sysConfig';
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
    setFromTokenAmount(amount);
    setToTokenAmount('');
  }

  const handleSwitchFromToToken = () => {
    setFromToken(toToken);
    setToToken(fromToken)
    handleSetFromTokenAmount(toTokenAmount);
  }

  const handleFromTokenSelect = (selectedToken: TokenType) => {
    if (toToken != null && selectedToken.id === toToken.id) {
      handleSwitchFromToToken();
    } else {
      setFromToken(selectedToken);
    }
    setPriceInfoReverse(false);
  };
  
  const handleToTokenSelect = (selectedToken: TokenType) => {
    if (fromToken != null && selectedToken.id === fromToken.id) {
      handleSwitchFromToToken();
    } else {
      setToToken(selectedToken);
    }
    setPriceInfoReverse(false);
  };
  
  const accountInfo = useAccountInfo();
  const updateAccountInfo = useAccountInfoUpdate()

  const [walletConnected, setWalletConnected] = useState(!_.isEmpty(_.get(accountInfo, 'address', '')))

  const tokenAmounts = _.get(accountInfo, 'tokenAmounts', []);
  const fromTokenBalance: BigNum = BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === fromToken?.id), 'amountBN', BigNum.SerizableZero));
  const toTokenBalance: BigNum = BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === toToken?.id), 'amountBN', BigNum.SerizableZero));

  const handleSetMaxFromTokenAmount = () => handleSetFromTokenAmount(fromTokenBalance.realNum);

  const insufficientBalance =  walletConnected && (BigNum.fromRealNum(fromTokenAmount ?? '').gt(fromTokenBalance));

  const [price, setPrice] = useState<BigNum | null>(null);
  const [priceReverse, setPriceReverse] = useState<BigNum | null>(null);
  const [swapRoutes, setSwapRoutes] = useState<string[]>();
  const [swapRouteIds, setSwapRouteIds] = useState<number[]>();

  const [priceInfo, setPriceInfo] = useState('');
  const [priceInfoReverse, setPriceInfoReverse] = useState<boolean>(false);
  const showSwapInfo = fromToken && toToken && (fromToken.id !== toToken.id) && (_.toNumber(fromTokenAmount) > 0);

  const slippage = useSlippageTol();

  // on user input (supply amount or target amount), dynamically fetch price & reverse price, calculate mimimal received and price impact, etc
  useEffect(() => {
    const validFromTokenAmount = _.toNumber(fromTokenAmount) > 0;
    if (!apiInited || fromToken == null || toToken == null || (fromToken.id === toToken.id) || !validFromTokenAmount) {
      return;
    }

    // only allow user to input supply amount, and get target amount via api and calculate price 
    async function calSwapInfo() {
      const supplyAmountBN = BigNum.fromRealNum(fromTokenAmount);
      const { balance: targetAmount, routes: swapRoutes } = await api.targetAmountAvailable((fromToken as TokenType).name, (toToken as TokenType).name, supplyAmountBN.bigNum);
      const targetAmountBN = BigNum.fromBigNum(targetAmount);
      const price: BigNum = targetAmountBN.div(supplyAmountBN);

      setToTokenAmount(targetAmountBN.toBN().toFixed(sysConfig.decimalPlaces));
      setPrice(price);
      setSwapRoutes(swapRoutes);
      setSwapRouteIds(swapRoutes.map((r: string) => myTokenTypesByName[r].id));

      const { balance: reverseSupplyAmount, routes: reverseSwapRoutes } = await api.targetAmountAvailable((toToken as TokenType).name, (fromToken as TokenType).name, targetAmountBN.bigNum);
      const reversePrice: BigNum = BigNum.fromBigNum(reverseSupplyAmount).div(targetAmountBN);
      setPriceReverse(reversePrice);
    }

    calSwapInfo();
  }, [apiInited, fromToken, toToken, fromTokenAmount, toTokenAmount]);

  // update price info
  useEffect(() => {
    if (!priceInfoReverse) {
      if (price == null || fromToken == null || toToken == null) {
        setPriceInfo('');
      } else {
        setPriceInfo(`${price.toBN().toFixed(sysConfig.decimalPlaces)} ${toToken.name} per ${fromToken.name}`);
      }
    } else {
      if (priceReverse == null || fromToken == null || toToken == null) {
        setPriceInfo('');
      } else {
        setPriceInfo(`${priceReverse.toBN().toFixed(sysConfig.decimalPlaces)} ${fromToken.name} per ${toToken.name}`);
      }
    }

  }, [price, priceReverse, priceInfoReverse]);

  // const slippage = useSlippageTol();
  const [minReceived, setMinReceived] = useState<BN | null>(null);
  useEffect(() => {
    if (toToken == null || !numUtils.isNum(fromTokenAmount) || price == null) {
      setMinReceived(null);
      return;
    }
    setMinReceived(swapUtils.calMinReceived(fromTokenAmount, price.toBN(), slippage / 10000));
  }, [toToken, fromTokenAmount, price, slippage]);

  const [priceImpact, setPriceImpact] = useState<BN | null>(null);
  useEffect(() => {
    if (price == null) {
      setPriceImpact(null);
      return;
    }
    setPriceImpact(swapUtils.calPriceImpact(price.toBN()));
  }, [price]);

  const liquidityProviderFee = new BN(fromTokenAmount).times(sysConfig.liquidityProviderFeeRatio);

  const swapEnabled = walletConnected && fromToken != null && toToken != null && _.toNumber(fromTokenAmount) > 0 && !insufficientBalance;

  const [swapConfirmModalOpen, setSwapConfirmModalOpen] = useState(false);

  const [swapTransStateModalOpen, setSwapTransStateModalOpen] = useState(false);

  const handleOnSwapConfirm = () => {
    setSwapConfirmModalOpen(false);
    setSwapTransStateModalOpen(true);
    // TODO: update fromTokenAmount & toTokenAmount, and trigger wallet balance refresh
  }

  const [walletSelectorOpen, setWalletSelectorOpen] = useState(false);

  const myTokenTypes = useTokenTypes();
  const myTokenTypesByName = _.keyBy(myTokenTypes, 'name');

  const { t } = useTranslation()

  const handleClose = useCallback((value: any) => {
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
  }, [apiInited, myTokenTypes]);

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
            onUserInput={() => {}}
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

        {(showSwapInfo) && (
          <TransactionInfoPanel>
            <AutoColumn gap={'sm'}>
              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Price:</TransactionInfoLabel>
                <RowFixed>
                  <TransactionInfo>{priceInfo}</TransactionInfo>
                  <TransactionPriceRefreshWapper onClick={() => setPriceInfoReverse(!priceInfoReverse)}>
                      <i className='fo-repeat refresh-price' />
                  </TransactionPriceRefreshWapper>
                </RowFixed>
              </AutoRow>

              <AutoRow justify='space-between'>
                <RowFixed>
                  <TransactionInfoLabel>Minimum Received:</TransactionInfoLabel>
                  <i className='fo-info clover-info' onClick={() => {}}></i>
                </RowFixed>
                <TransactionInfo>{minReceived == null ? '' : `${minReceived.toFixed(sysConfig.decimalPlaces)} ${toToken?.name}`}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <RowFixed>
                  <TransactionInfoLabel>Price Impact:</TransactionInfoLabel>
                  <i className='fo-info clover-info' onClick={() => {}}></i>
                </RowFixed>
                <TransactionInfo>{priceImpact == null ? '' : `${priceImpact.times(100).toFixed(sysConfig.decimalPlaces)}%`}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <RowFixed>
                  <TransactionInfoLabel>Liquidity Provder Fee:</TransactionInfoLabel>
                  <i className='fo-info clover-info' onClick={() => {}}></i>
                </RowFixed>
                <TransactionInfo>{liquidityProviderFee.toFixed(sysConfig.decimalPlaces)} {fromToken?.name}</TransactionInfo>
              </AutoRow>

              <TransactionInfoLabel>Route:</TransactionInfoLabel>
              {swapRoutes && (
                <SwapRoutes routes={fromToken == null ? swapRoutes : [fromToken.name, ...swapRoutes]} tokenTypesByName={myTokenTypesByName} />
              )}

            </AutoColumn>
          </TransactionInfoPanel>
        )}

      </Wrapper>

      {swapEnabled && (
        <SwapConfirmhModal
          isOpen={swapConfirmModalOpen}
          onDismiss={() => setSwapConfirmModalOpen(false)}
          onConfirmSwap={handleOnSwapConfirm}
          fromToken={fromToken as TokenType}
          fromTokenAmount={fromTokenAmount}
          toToken={toToken as TokenType}
          toTokenAmount={toTokenAmount}
          price={price == null ? null : price.toBN()}
          minReceived={minReceived}
          priceImpact={priceImpact}
          liquidityProviderFee={liquidityProviderFee}
          swapRoutes={swapRouteIds ?? []}
        />
      )}

      <SwapTransStateModal
        isOpen={swapTransStateModalOpen}
        onDismiss={() => {}}
        onClose={() => setSwapTransStateModalOpen(false)} />

      <WalletSelectDialog 
          accountTypes={supportedWalletTypes} 
          open={walletSelectorOpen} 
          onClose={handleClose}></WalletSelectDialog>

    </BodyWrapper>
  );
}
