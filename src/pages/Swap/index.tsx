import _, { reverse } from 'lodash';
import React, { useState, useEffect } from 'react';
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
import { Wrapper, BottomGrouping } from '../../components/Swap/styleds';
import SwapConfirmhModal from './SwapConfirmModal';
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

enum AutoCalAmount {
  FromTokenAmount,
  ToTokenAmount
}

export default function Swap() {
  const apiInited = useApiInited();

  const [fromToken, setFromToken] = useState<TokenType | null>(null);
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('');

  const [toToken, setToToken] = useState<TokenType | null>(null);
  const [toTokenAmount, setToTokenAmount] = useState('');

  const [autoCalAmount, setAutoCalAmount] = useState<AutoCalAmount>(AutoCalAmount.ToTokenAmount);

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
  const updateAccountInfo = useAccountInfoUpdate()

  const [walletConnected, setWalletConnected] = useState(!_.isEmpty(_.get(accountInfo, 'address', '')))

  const tokenAmounts = _.get(accountInfo, 'tokenAmounts', []);
  const fromTokenBalance: BigNum = BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === fromToken?.id), 'amountBN', BigNum.SerizableZero));
  const toTokenBalance: BigNum = BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === toToken?.id), 'amountBN', BigNum.SerizableZero));

  const handleSetMaxFromTokenAmount = () => handleSetFromTokenAmount(fromTokenBalance.realNum);

  const insufficientBalance =  walletConnected && (BigNum.fromRealNum(fromTokenAmount ?? '').gt(fromTokenBalance));

  const [price, setPrice] = useState<BigNum | null>(null);
  const [priceReverse, setPriceReverse] = useState<BigNum | null>(null);

  const [priceInfo, setPriceInfo] = useState('');
  const [priceInfoReverse, setPriceInfoReverse] = useState<boolean>(false);
  const showPrice = fromToken && toToken && fromToken.id !== toToken.id;

  // fetch price and reversed price
  useEffect(() => {
    if (!apiInited || fromToken == null || toToken == null || fromToken.id === toToken.id) {
      return;
    }

    async function fetchPrice() {
      /**
       * sample result:
       * "result": {
            "balance": "7242",
            "routes": ["BUSD", "DOT"]
        },
       */
      const { balance: balance, routes: routes } = await api.targetAmountAvailable((fromToken as TokenType).name, (toToken as TokenType).name, BigNum.fromRealNum('1').bigNum);
      setPrice(BigNum.fromBigNum(balance.toString()));

      const { balance: balanceReverse, routes: routesReverse } = await api.targetAmountAvailable((toToken as TokenType).name, (fromToken as TokenType).name, BigNum.fromRealNum('1').bigNum);
      setPriceReverse(BigNum.fromBigNum(balanceReverse.toString()));
    }
    
    fetchPrice();
  }, [apiInited, fromToken, toToken]);

  // auto set to-token-amount base on user input from-token-amount and price, and vice versa
  useEffect(() => {
    if (fromToken == null || toToken == null
      || (autoCalAmount == AutoCalAmount.ToTokenAmount && (price == null || !numUtils.isNum(fromTokenAmount)))
      || (autoCalAmount == AutoCalAmount.FromTokenAmount && (priceReverse == null || !numUtils.isNum(toTokenAmount)))) {
      return;
    }

    if (autoCalAmount == AutoCalAmount.ToTokenAmount) {
      setToTokenAmount(BigNum.fromRealNum(fromTokenAmount).times(price as BigNum).toBN().toFixed(sysConfig.decimalPlaces));
    } else if (autoCalAmount == AutoCalAmount.FromTokenAmount) {
      setFromTokenAmount(BigNum.fromRealNum(toTokenAmount).times(priceReverse as BigNum).toBN().toFixed(sysConfig.decimalPlaces));
    }
  }, [fromToken, toToken, price, priceReverse, fromTokenAmount, toTokenAmount, autoCalAmount]);

  // update price info
  useEffect(() => {
    if (fromToken == null || toToken == null || (priceInfoReverse && priceReverse == null) || (!priceInfoReverse && price == null)) {
      setPriceInfo('');
      return;
    }

    if (priceInfoReverse) {
      setPriceInfo(`${(priceReverse as BigNum).toBN().toFixed(sysConfig.decimalPlaces)} ${fromToken.name} per ${toToken.name}`);
    } else {
      setPriceInfo(`${(price as BigNum).toBN().toFixed(sysConfig.decimalPlaces)} ${toToken.name} per ${fromToken.name}`);
    }
  }, [fromToken, toToken, price, priceReverse, priceInfoReverse]);

  const slippage = useSlippageTol();
  const [minReceived, setMinReceived] = useState<BN | null>(null);
  useEffect(() => {
    if (toToken == null || !numUtils.isNum(fromTokenAmount) || priceReverse == null) {
      setMinReceived(null);
      return;
    }
    setMinReceived(swapUtils.calMinReceived(fromTokenAmount, priceReverse.toBN(), slippage / 10000));
  }, [toToken, fromTokenAmount, priceReverse, slippage]);

  const [priceImpace, setPriceImpact] = useState<BN | null>(null);
  useEffect(() => {
    if (price == null) {
      setPriceImpact(null);
      return;
    }
    setPriceImpact(swapUtils.calPriceImpact(price.toBN()));
  }, [price]);

  const showTransactionInfo = showPrice && (_.toNumber(fromTokenAmount) > 0 || _.toNumber(toTokenAmount) > 0);

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

        {(showPrice || true) && (
          <TransactionInfoPanel>
            <AutoColumn gap={'sm'}>
              {showPrice && (
                <AutoRow justify='space-between'>
                  <TransactionInfoLabel>Price:</TransactionInfoLabel>
                  <RowFixed>
                    <TransactionInfo>{priceInfo}</TransactionInfo>
                    <TransactionPriceRefreshWapper onClick={() => setPriceInfoReverse(!priceInfoReverse)}>
                        <i className='fo-repeat refresh-price' />
                    </TransactionPriceRefreshWapper>
                  </RowFixed>
                </AutoRow>
              )}

              {true && (
                <>
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
                    <TransactionInfo>{priceImpace == null ? '' : `${priceImpace.times(100).toFixed(sysConfig.decimalPlaces)}%`}</TransactionInfo>
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
