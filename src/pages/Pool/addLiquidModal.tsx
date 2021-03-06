import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { TokenType } from '../../state/token/types';
import Column, {ColumnCenter} from '../../components/Column'
import Row, {RowBetween} from '../../components/Row'
import Circle from '../../components/Circle'
import { PairTransContent, PairIconTitle } from './poolPairItem'
import _ from 'lodash'
import Modal from '../../components/Modal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { useTokenTypes } from '../../state/token/hooks'
import { useAccountInfo } from '../../state/wallet/hooks';
import BigNum, {div, times, add}  from '../../types/bigNum';
import { useUserPoolPairItems, useChainPoolPairItems } from '../../state/pool/hooks';
import { PoolPairItem as PoolPairItemType } from '../../state/pool/types'
import { DataFromAddLiquid } from './index'
import {selectedPairExists, findPairItem} from './utils'
import { showTextType } from './types'
import {PrimitiveButton} from '../../components/Button'


const customStyle = "position: relative;overflow: visible;max-width:472px;"

const Head = styled(RowBetween)`
  padding: 16px 12px 0 16px;
  margin-bottom: 32px;
`
const Title = styled.div`
  font-size: 16px;
  font-family: Helvetica;
  color: #777777;
`

const CloseButton = styled.div`
  font-size: 20px;
  color: #CCCCCC;
  cursor: pointer;
`
const BodyWrapper = styled(Column)`
  width: 100%;
  z-index: 1000;
  background: white;
  border-radius: 16px;
`

const Wrapper = styled(ColumnCenter)`
  display: flex;
  padding: 12px 27px 16px 24px;
  overflow: auto;
`

const CirclePlus = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FCF0DC;
  border: 2px solid #FFFFFF;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  color:#F99E3C;
  margin-top: -10px;
  z-index: 2;
`

export const Button = styled(PrimitiveButton)`
  flex-shrink: 0;
  margin-top: 12px;
}`

const ContentWrapper = styled(Column)`
  flex-shrink: 0;
  background: #F9FAFB;
  margin-top: 9px;
  width: 100%;
  border-radius: 8px;
  padding: 16px 16px 0 16px;
`

const RightWrapper = styled(({ startAnimation, ...rest }) => (
  <Column {...rest} />
))`
  position: absolute;
  bottom: 0;
  right: ${({ startAnimation }) => (startAnimation ? '-435px' : '0')};
  width: 420px;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
  border-radius: 16px;
  opacity: ${({ startAnimation }) => (startAnimation ? '0.75' : '0')};
  padding: 22px 52px 0 42px;
  transition:  right 0.3s, opacity 0.3s;
  z-index: 500;
`

const PairTitleWrapper = styled.div`
  margin-top: 17px;
`

const PairContentWrapper = styled.div`
  margin-top: 24px;
  padding-bottom: 16px;
`
const FirstPoolTip = styled(Row)`
  padding: 0 23px;
  margin-bottom: 12px;
`

const CircleTip = styled(Circle)`
  background: #FDE9E8;
  font-size: 18px;
  color: #F6373F;
`
const TipText = styled.div`
  font-size: 14px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #FA5050;
`

const TipWrapper = styled(Row)`
  align-items: start;
  margin-top: 9px;
  flex-shrink: 0;
`

const CircleInfo = styled(Circle)`
  background: #FCF0DC;
  border: 2px solid #FFFFFF;
  font-size: 18px;
  color: #F99E3C;
`

const InfoText = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #F99E3C;
  margin-left: 4px;
  padding-right: 10px;
`

const MyPositionWrapper = styled(Column)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    margin-top: 15px;
  `}
`

interface MyPositionProps {
  fromToken: TokenType | undefined,
  toToken: TokenType | undefined,
  mpShowData: showTextType[]
}

const MyPosition = ({fromToken, toToken, mpShowData}: MyPositionProps): React.ReactElement => {
  return (
    <MyPositionWrapper>
      <Title>My position</Title>
      <PairTitleWrapper>
        <PairIconTitle left={fromToken?.logo ?? ''} right={toToken?.logo ?? ''} title={`${fromToken?.name ?? ''}/${toToken?.name ?? ''}`}></PairIconTitle>
      </PairTitleWrapper>
      <PairContentWrapper>
        <PairTransContent contents={mpShowData}></PairTransContent>
      </PairContentWrapper>
    </MyPositionWrapper>
  );
}

interface AddLiquidModalProps {
  isOpen: boolean
  onClose: (state: string, data?: DataFromAddLiquid) => void
  fromTokenType?: TokenType
  toTokenType?: TokenType
}

export default function AddLiquidModal({isOpen, onClose, fromTokenType, toTokenType}: AddLiquidModalProps): React.ReactElement {
  const [fromToken, setFromToken] = useState<TokenType | undefined>(fromTokenType);
  const [fromTokenAmount, setFromTokenAmount] = useState<string>('');

  const [startAnimation, setStartAnimation] = useState(false);

  const [toToken, setToToken] = useState<TokenType | undefined>(toTokenType);
  const [toTokenAmount, setToTokenAmount] = useState('');

  const accountInfo = useAccountInfo();

  const [tokenAmounts, setTokenAmounts] = useState(_.get(accountInfo, 'tokenAmounts', []))

  const [fromTokenBalance, setFromTokenBalance] = useState<string>(BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === fromToken?.id), 'amountBN', BigNum.SerizableZero)).realNum)
  const [toTokenBalance, setToTokenBalance] = useState<string>(BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === toToken?.id), 'amountBN', BigNum.SerizableZero)).realNum)
  
  const [walletConnected, setWalletConnected] = useState(false)
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [insufficientToBalance, setInsufficientToBalance] = useState(false)

  const userPoolItems = useUserPoolPairItems()
  const chainPoolItems = useChainPoolPairItems()

  const [showData, setShowData] = useState<showTextType[]>([])
  const [mpShowData, setMpShowData] = useState<showTextType[]>([])

  const calcFromAmount = (chainPoolItems: PoolPairItemType[], fromToken: TokenType|undefined, toToken: TokenType|undefined, toAmount: string): string => {
    const item = findPairItem(chainPoolItems, fromToken, toToken)
    let fromTotal = ''
    let toTotal = ''
    if (item?.fromToken.name === fromToken?.name) {
      fromTotal = item?.fromAmount ?? ''
      toTotal = item?.toAmount ?? ''
    } else {
      fromTotal = item?.toAmount ?? ''
      toTotal = item?.fromAmount ?? ''
    }
    return div(times(toAmount, fromTotal), toTotal)
  }

  const calcToAmount = (chainPoolItems: PoolPairItemType[], fromToken: TokenType|undefined, toToken: TokenType|undefined, fromAmount: string): string => {
    const item = findPairItem(chainPoolItems, fromToken, toToken)
    let fromTotal = ''
    let toTotal = ''
    if (item?.fromToken.name === fromToken?.name) {
      fromTotal = item?.fromAmount ?? ''
      toTotal = item?.toAmount ?? ''
    } else {
      fromTotal = item?.toAmount ?? ''
      toTotal = item?.fromAmount ?? ''
    }
    return div(times(fromAmount, toTotal), fromTotal)
  }

  const handleSetFromTokenAmount = useCallback((amount: string) => {
    if (selectedPairExists(chainPoolItems, fromToken, toToken)) {
      setFromTokenAmount(amount);
      const toAmount = calcToAmount(chainPoolItems, fromToken, toToken, amount)
      setToTokenAmount(toAmount === 'NaN' ? '' : toAmount);
    } else {
      setFromTokenAmount(amount);
    }
  }, [chainPoolItems, fromToken, toToken])

  const handleSetMaxFromTokenAmount = () => setFromTokenAmount(fromTokenBalance);

  const handleFromTokenSelect = (selectedToken: TokenType) => {
    if (toToken != null && selectedToken.id === toToken.id) {
      handleSwitchFromToToken();
    } else {
      setFromToken(selectedToken);
    }
  };
  
  const handleSetToTokenAmount = useCallback((amount: string) => {
    if (selectedPairExists(chainPoolItems, fromToken, toToken)) {
      setToTokenAmount(amount);
      const fromAmount = calcFromAmount(chainPoolItems, fromToken, toToken, amount)
      setFromTokenAmount(fromAmount === 'NaN' ? '' : fromAmount);
    } else {
      setToTokenAmount(amount);
    }
  }, [chainPoolItems, fromToken, toToken])

  const handleSwitchFromToToken = () => {
    setFromToken(toToken);
    setFromTokenAmount(toTokenAmount);
    setToToken(fromToken)
    setToTokenAmount(fromTokenAmount);
  }

  const handleToTokenSelect = (selectedToken: TokenType) => {
    if (fromToken != null && selectedToken.id === fromToken.id) {
      handleSwitchFromToToken();
    } else {
      setToToken(selectedToken);
    }
  };

  const handleSetMaxToTokenAmount = () => setToTokenAmount(toTokenBalance);

  const inputBtnEnable = useCallback(() => {
    const amountToBig = BigNum.fromRealNum(toTokenAmount)
    const amountFromBig = BigNum.fromRealNum(fromTokenAmount)

    if (_.isEmpty(fromToken) || _.isEmpty(toToken)) {
      return false
    }

    if (amountFromBig.eq(BigNum.Zero) || amountToBig.eq(BigNum.Zero)) {
      return false
    }

    if (insufficientBalance || insufficientToBalance) {
      return false
    }

    return true
  }, [fromTokenAmount, toTokenAmount, fromToken, toToken, insufficientBalance, insufficientToBalance])

  useEffect(() => {
    setFromToken(fromTokenType)
    setToToken(toTokenType)
  }, [fromTokenType, toTokenType])

  useEffect(() => {
    if (_.isEmpty(accountInfo.address)) {
      setWalletConnected(false)
    } else {
      setWalletConnected(true)
    }

    setTokenAmounts(_.get(accountInfo, 'tokenAmounts', []))
  }, [accountInfo])

  useEffect(() => {
    setInsufficientBalance(walletConnected && (BigNum.fromRealNum(fromTokenAmount ?? '').gt(BigNum.fromRealNum(fromTokenBalance))))
    setInsufficientToBalance(walletConnected && (BigNum.fromRealNum(toTokenAmount ?? '').gt(BigNum.fromRealNum(toTokenBalance))))
  }, [walletConnected, fromTokenAmount, fromTokenBalance, toTokenAmount, toTokenBalance])

  useEffect(() => {
    const fbn = BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === fromToken?.id), 'amountBN', BigNum.SerizableZero))
    setFromTokenBalance(fbn.realNum)
    const tbn = BigNum.fromSerizableBigNum(_.get(_.find(tokenAmounts, t => t.tokenType.id === toToken?.id), 'amountBN', BigNum.SerizableZero))
    setToTokenBalance(tbn.realNum) 
  }, [tokenAmounts, fromToken, toToken])

  useEffect(() => {
    let r1to2 = '-'
    let r2to1 = '-'
    let percent = '-'

    if (_.isEmpty(fromToken) || _.isEmpty(toToken)) {
      return
    }

    const item = findPairItem(chainPoolItems, fromToken, toToken)
    if (!_.isEmpty(item)) {
      const {fAmount, tAmount} = (fromToken?.name === item?.fromToken.name) 
        ? {fAmount: item?.fromAmount, tAmount: item?.toAmount} 
        : {fAmount: item?.toAmount, tAmount: item?.fromAmount}
        
      const amountFromBig = BigNum.fromBigNum(fAmount ?? '')
      const amountToBig = BigNum.fromBigNum(tAmount ?? '')

      const amountFromInputBig = BigNum.fromRealNum(fromTokenAmount ?? '')

      const estimateTotleBig = BigNum.fromBigNum(add(amountFromBig.bigNum, amountFromInputBig.bigNum))
      if (!estimateTotleBig.eq(BigNum.Zero)) {
        percent =  div(amountFromInputBig.bigNum, add(amountFromBig.bigNum, amountFromInputBig.bigNum), true)
      }

      if (!amountFromBig.eq(BigNum.Zero)&& !amountToBig.eq(BigNum.Zero)) {
        r1to2 = div(amountFromBig.bigNum.toString(), amountToBig.bigNum.toString())
        r2to1 = div(amountToBig.bigNum.toString(), amountFromBig.bigNum.toString())
      }
    } else {
      const amountFromBig = BigNum.fromRealNum(fromTokenAmount)
      const amountToBig = BigNum.fromRealNum(toTokenAmount)

      if (!amountFromBig.eq(BigNum.Zero)&& !amountToBig.eq(BigNum.Zero)) {
        r1to2 = div(amountFromBig.bigNum.toString(), amountToBig.bigNum.toString())
        r2to1 = div(amountToBig.bigNum.toString(), amountFromBig.bigNum.toString())
        percent = '100%'
      }
    }

    setShowData([
      {
        label: `${fromToken?.name} per ${toToken?.name}`,
        amount: `${r1to2}`
      },
      {
        label: `${toToken?.name} per ${fromToken?.name}`,
        amount: `${r2to1}`
      },
      {
        label: `Pool share`,
        amount: `${percent}`
      },
    ])
  }, [chainPoolItems, userPoolItems, fromToken, toToken, fromTokenAmount, toTokenAmount])

  useEffect(() => {
    setStartAnimation(false)
    const itemInPool = findPairItem(userPoolItems, fromToken, toToken)
    if (_.isEmpty(itemInPool)) {
      return
    }

    const item = itemInPool?.fromToken.name !== fromToken?.name ? {
      fromToken: toToken,
      fromAmount: itemInPool?.toAmount,
      toToken: fromToken,
      toAmount: itemInPool?.toAmount,
      userShare: itemInPool?.userShare,
      totalShare: itemInPool?.totalShare
    } : itemInPool

    setMpShowData([
      {
        label: `Pooled ${item?.fromToken?.name}`,
        amount: `${BigNum.fromBigNum(item?.fromAmount ?? '').realNum} ${item?.fromToken?.name}`
      },
      {
        label: `Pooled ${item?.toToken?.name}`,
        amount: `${BigNum.fromBigNum(item?.toAmount ?? '').realNum} ${item?.toToken?.name}`
      },
      {
        label: `My pool tokens:`,
        amount: `${BigNum.fromBigNum(item?.userShare ?? '').realNum}`
      },
      {
        label: `My pool share:`,
        amount: `${div(item?.userShare ?? '', item?.totalShare ?? '', true)}%`
      }
    ])
    
  }, [fromToken, toToken, userPoolItems])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {setStartAnimation(true)}, 0)
    } else {
      setStartAnimation(false)
    }
    
  }, [isOpen])

  const myTokenTypes = useTokenTypes()
  const myTokenTypesByName = _.keyBy(myTokenTypes, 'name')

  useEffect(() => {
    if (isOpen 
      && (_.isUndefined(fromToken) || _.isNull(fromToken))
      && (_.isUndefined(toToken) || _.isNull(toToken))
      && !_.isEmpty(myTokenTypes)) {
      const clv = _.get(myTokenTypesByName, 'CLV')
      if (clv) {
        setFromToken(clv)
      }
    }
  }, [isOpen, myTokenTypes, myTokenTypesByName, fromToken, toToken])

    return (
      <Modal isOpen={isOpen} onDismiss={() => {''}} maxHeight={90} customStyle={customStyle}>
        {
          selectedPairExists(userPoolItems, fromToken, toToken) && (!isMobile) &&
          <RightWrapper startAnimation={startAnimation}>
            <MyPosition fromToken={fromToken} toToken={toToken} mpShowData={mpShowData}></MyPosition>
          </RightWrapper>
        }
        <BodyWrapper>
          <Head>
            <Title>Add liquidity</Title>
            <CloseButton onClick={() => onClose('close')}><i className="fa fo-x"></i></CloseButton>
          </Head>
          {
              !selectedPairExists(chainPoolItems, fromToken, toToken) && !_.isEmpty(fromToken) && !_.isEmpty(toToken) && <FirstPoolTip>
                <CircleTip><i className="fa fo-info tip-icon"></i></CircleTip>
                <TipText>You are the first liquidity provider for this pool. The  price of this pool will be determined by the ratio of tokens you add</TipText>
              </FirstPoolTip>
            }
          <Wrapper>
            <CurrencyInputPanel
              id="add-liquid-input1"
              value={fromTokenAmount ?? ''}
              onUserInput={handleSetFromTokenAmount}
              currency={fromToken}
              onCurrencySelect={handleFromTokenSelect}
              balance={fromTokenBalance}
              otherCurrency={toToken}
              showBalance={walletConnected}
              showMaxButton={walletConnected}
              onMax={handleSetMaxFromTokenAmount}
              insufficientBalance={insufficientBalance}
              customStyle={'width: 100%;'}
            />
            <CirclePlus><i className="fa fo-plus"></i></CirclePlus>
            <CurrencyInputPanel
              id="add-liquid-input2"
              value={toTokenAmount || ''}
              onUserInput={handleSetToTokenAmount}
              currency={toToken}
              onCurrencySelect={handleToTokenSelect}
              otherCurrency={fromToken}
              balance={toTokenBalance}
              showBalance={walletConnected}
              showMaxButton={walletConnected}
              onMax={handleSetMaxToTokenAmount}
              insufficientBalance={insufficientToBalance}
              customStyle={'width: 100%;margin-top: -12px;'}
            />

            <Button onClick={() => onClose('input', {
              fromToken: {id: fromToken?.id ?? -1, name: fromToken?.name ?? '', logo: fromToken?.logo},
              toToken: {id: toToken?.id ?? -1, name: toToken?.name ?? '', logo: toToken?.logo},
              fromAmount: BigNum.fromRealNum(fromTokenAmount),
              toAmount: BigNum.fromRealNum(toTokenAmount)
            })} disabled={!inputBtnEnable()}>Input</Button>
            {
              !_.isEmpty(showData) && <ContentWrapper>
                <PairTransContent contents={showData}></PairTransContent>
              </ContentWrapper>
            }
            {
              selectedPairExists(userPoolItems, fromToken, toToken) && 
              <TipWrapper>
                <CircleInfo><i className="fa fo-info"></i></CircleInfo>
                <InfoText>Liquidity Providers earn 0.3% of all trades on this pair proportional to their share of the pool. Fees are added to the pool, and can be claimed by withdrawing liquidity.</InfoText>
              </TipWrapper>
            }
            
            {
              selectedPairExists(userPoolItems, fromToken, toToken) && isMobile &&
              <MyPosition fromToken={fromToken} toToken={toToken} mpShowData={mpShowData}></MyPosition>
            }
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
