import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BigNumber as BN } from "bignumber.js";
import { ButtonBigCommon } from '../../components/Button';
import { AutoColumn } from '../../components/Column';
import { AutoRow, RowFixed } from '../../components/Row';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { Wrapper, BottomGrouping, SwapRoutes } from '../../components/Swap/styleds';
import SwapConfirmhModal from './SwapConfirmModal';
import SwapTransStateModal from './SwapTransStateModal';
import { TokenType } from '../../state/token/types';
import { useTokenTypes } from '../../state/token/hooks';
import { useAccountInfo } from '../../state/wallet/hooks';
import { useApiInited } from '../../state/api/hooks';
import { useSlippageTol } from '../../state/settings/hooks';
import BigNum  from '../../types/bigNum';
import WalletConnectComp from '../../components/WalletComp/walletConnectComp'
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

enum AutoCalAmount {
  FromTokenAmount,
  ToTokenAmount
}

export default function Swap(): React.ReactElement {
  const apiInited = useApiInited();

  const [fromToken, setFromToken] = useState<TokenType | null>(null);
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('');

  const [toToken, setToToken] = useState<TokenType | null>(null);
  const [toTokenAmount, setToTokenAmount] = useState('');

  const [autoCalAmount, setAutoCalAmount] = useState<AutoCalAmount>(AutoCalAmount.ToTokenAmount);

  const myTokenTypes = useTokenTypes();
  const myTokenTypesByName = _.keyBy(myTokenTypes, 'name');

  const handleSetFromTokenAmount = (amount: string) => {
    setFromTokenAmount(amount);
    setToTokenAmount('');
    setAutoCalAmount(AutoCalAmount.ToTokenAmount);
  }

  const handleSetToTokenAmount = (amount: string) => {
    setToTokenAmount(amount);
    setFromTokenAmount('');
    setAutoCalAmount(AutoCalAmount.FromTokenAmount);
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

  // on user input, dynamically fetch price & reverse price, calculate mimimal received and price impact, etc
  useEffect(() => {
    const validFromTokenAmount = _.toNumber(fromTokenAmount) > 0;
    const validToTokenAmount = _.toNumber(toTokenAmount) > 0;
    if (!apiInited || fromToken == null || toToken == null || (fromToken.id === toToken.id)
      || (autoCalAmount === AutoCalAmount.ToTokenAmount && !validFromTokenAmount)
      || (autoCalAmount === AutoCalAmount.FromTokenAmount && !validToTokenAmount)) {
      return;
    }

    async function calSwapInfo() {
      let supplyAmountBN, targetAmountBN, swapRoutes;
      if (autoCalAmount === AutoCalAmount.ToTokenAmount) {
        supplyAmountBN = BigNum.fromRealNum(fromTokenAmount);
        const { balance: targetAmount, routes } = await api.targetAmountAvailable((fromToken as TokenType).name, (toToken as TokenType).name, supplyAmountBN.bigNum);
        targetAmountBN = BigNum.fromBigNum(targetAmount);
        swapRoutes = routes;
        setToTokenAmount(targetAmountBN.toBN().toFixed(sysConfig.decimalPlaces));
      }
      else {
        targetAmountBN = BigNum.fromRealNum(toTokenAmount);
        const { balance: supplyAmount, routes } = await api.supplyAmountNeeded((fromToken as TokenType).name, (toToken as TokenType).name, targetAmountBN.bigNum);
        supplyAmountBN = BigNum.fromBigNum(supplyAmount);
        swapRoutes = routes;
        setFromTokenAmount(supplyAmountBN.toBN().toFixed(sysConfig.decimalPlaces));
      }

      const price: BigNum = targetAmountBN.div(supplyAmountBN);

      setPrice(price);
      setSwapRoutes(swapRoutes);
      setSwapRouteIds(swapRoutes.map((r: string) => myTokenTypesByName[r].id));

      const { balance: reverseSupplyAmount } = await api.targetAmountAvailable((toToken as TokenType).name, (fromToken as TokenType).name, targetAmountBN.bigNum);
      const reversePrice: BigNum = BigNum.fromBigNum(reverseSupplyAmount).div(targetAmountBN);
      setPriceReverse(reversePrice);
    }

    calSwapInfo();
  }, [apiInited, fromToken, toToken, fromTokenAmount, toTokenAmount, autoCalAmount, myTokenTypesByName]);

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

  }, [price, priceReverse, priceInfoReverse, fromToken, toToken])

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

    setFromTokenAmount('');
    setToTokenAmount('');
  }

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
            <WalletConnectComp></WalletConnectComp>
          }
          {walletConnected &&
            <ButtonBigCommon disabled={!swapEnabled} onClick={() => setSwapConfirmModalOpen(true)}>Swap</ButtonBigCommon>
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
                  <i className='fo-info clover-info' onClick={() => {''}}></i>
                </RowFixed>
                <TransactionInfo>{minReceived == null ? '' : `${minReceived.toFixed(sysConfig.decimalPlaces)} ${toToken?.name}`}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <RowFixed>
                  <TransactionInfoLabel>Price Impact:</TransactionInfoLabel>
                  <i className='fo-info clover-info' onClick={() => {''}}></i>
                </RowFixed>
                <TransactionInfo>{priceImpact == null ? '' : `${priceImpact.times(100).toFixed(sysConfig.decimalPlaces)}%`}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <RowFixed>
                  <TransactionInfoLabel>Liquidity Provder Fee:</TransactionInfoLabel>
                  <i className='fo-info clover-info' onClick={() => {''}}></i>
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
        onDismiss={() => {''}}
        onClose={() => setSwapTransStateModalOpen(false)} />

    </BodyWrapper>
  );
}
