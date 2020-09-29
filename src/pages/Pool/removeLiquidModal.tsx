import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Column, {ColumnCenter} from '../../components/Column'
import {RowBetween} from '../../components/Row'
import { PairTransContent } from './poolPairItem'
import _ from 'lodash'
import Modal from '../../components/Modal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { useUserPoolPairItems, useChainPoolPairItems, useTransStateUpdate } from '../../state/pool/hooks';
import { TokenType, defaultTokenType } from '../../state/token/types';
import { PoolPairItem as PoolPairItemType } from '../../state/pool/types'
import BigNum, {div, times}  from '../../types/bigNum';
import { useAccountInfo } from '../../state/wallet/hooks';
import { toast } from 'react-toastify';
import { doRemoveLiqudityTrans } from '../../utils/transUtils'

import { findPairItem } from './utils';
import { showTextType } from './types'
import { PrimitiveButton } from '../../components/Button'


const customStyle = "position: relative;overflow: visible; max-width:472px;"

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
  width: 100%
`

const Wrapper = styled(ColumnCenter)`
  padding: 0 27px 16px 24px;
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
  margin-top: 12px;
}`

const ContentWrapper = styled(Column)`
  background: #F9FAFB;
  margin-top: 9px;
  width: 100%;
  border-radius: 8px;
  padding: 16px 16px 0 16px;
`

const CurrencyAmountWrapper = styled(Column)`
  border-radius: 16px;
  background-color: #FFFFFF;
  box-shadow: 0px 2px 20px 0px rgba(0,0,0,0.1);
  width: 100%;
  padding: 16px 12px 16px 23px;
  margin-top: -12px;
`

const OutputText = styled.div`
  height: 14px;
  font-size: 14px;
  font-family: Helvetica;
  color: #858B9C;
  line-height: 14px;
`

const AmountText = styled.div`
  font-size: 24px;
  font-family: Helvetica;
  color: #111A34;
  line-height: 24px;
  margin-top: 8px;
`

interface RemoveLiquidModalProps {
  isOpen: boolean
  onClose: (state: string) => void
  fromTokenType: TokenType | undefined
  toTokenType: TokenType | undefined
}

interface OutputTokenPair {
  token1Type?: TokenType,
  token1Amount: string,
  token2Type?: TokenType,
  token2Amount: string
}

const defaultOutputTokenPair = {token1Amount: '0', token2Amount: '0'}
export default function RemoveLiquidModal({isOpen, onClose, fromTokenType, toTokenType}: RemoveLiquidModalProps): React.ReactElement {
  const chainPoolItems = useChainPoolPairItems()
  const userPoolItems = useUserPoolPairItems()
  const accountInfo = useAccountInfo();

  const [balanceAmount, setBalanceAmount] = useState<string>('0')
  const [inputShareAmount, setInputShareAmount] = useState<string>('');
  const [outputTokenAmount, setOutputTokenAmount] = useState<OutputTokenPair>(defaultOutputTokenPair)
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [showData, setShowData] = useState<showTextType[]>([])

  const transStateUpdate = useTransStateUpdate()

  const calcOutPutAmount = (chainPoolItems: PoolPairItemType[], amount: string, fromTokenType?: TokenType, toTokenType?: TokenType):OutputTokenPair   => {
    const item = findPairItem(chainPoolItems, fromTokenType, toTokenType)
    if (_.isEmpty(item)) {
      return defaultOutputTokenPair
    }

    const totalShareBN = BigNum.fromBigNum(item?.totalShare ?? '')
    const removeAmountBN = BigNum.fromRealNum(amount)

    let fromTotal:BigNum
    let toTotal:BigNum
    if (item?.fromToken.name === fromTokenType?.name) {
      fromTotal = BigNum.fromBigNum(item?.fromAmount ?? '')
      toTotal = BigNum.fromBigNum(item?.toAmount ?? '')
    } else {
      fromTotal = BigNum.fromBigNum(item?.toAmount ?? '')
      toTotal = BigNum.fromBigNum(item?.fromAmount ?? '')
    }
    
    const t1AmountBN = BigNum.fromBigNum(div(times(removeAmountBN.bigNum, fromTotal.bigNum), totalShareBN.bigNum))
    const t2AmountBN = BigNum.fromBigNum(div(times(removeAmountBN.bigNum, toTotal.bigNum), totalShareBN.bigNum))
    return {
      token1Type: fromTokenType,
      token1Amount: t1AmountBN.realNum,
      token2Type: toTokenType,
      token2Amount: t2AmountBN.realNum
    }
  }

  const handleSetInputShareAmount = useCallback((amount: string) => {
    setInputShareAmount(amount);
    const outputAmount = calcOutPutAmount(chainPoolItems, amount, fromTokenType, toTokenType)
    setOutputTokenAmount(outputAmount)
  }, [chainPoolItems, fromTokenType, toTokenType])

  const handleSetMaxShareAmount = useCallback(() => {
    setInputShareAmount(balanceAmount)
    const outputAmount = calcOutPutAmount(chainPoolItems, balanceAmount, fromTokenType, toTokenType)
    setOutputTokenAmount(outputAmount)
  }, [balanceAmount, fromTokenType, toTokenType, chainPoolItems]);

  const inputBtnEnable = useCallback(() => {
    const amountBN = BigNum.fromRealNum(inputShareAmount)

    if (_.isEmpty(fromTokenType) || _.isEmpty(toTokenType)) {
      return false
    }

    if (amountBN.eq(BigNum.Zero) || insufficientBalance) {
      return false
    }

    return true
  }, [inputShareAmount, fromTokenType, toTokenType, insufficientBalance])

  const handleRemoveClick = useCallback(() => {
    onClose('confirm')
    const amountBN = BigNum.fromRealNum(inputShareAmount)

    if (_.isEmpty(accountInfo.address)) {
      return
    }
    const onError = (msg: string) => {
      // toast(msg)
    }

    const amountText = `Withdrawing ${fromTokenType?.name ?? ''}/${toTokenType?.name ?? ''} Tokens ${amountBN.realNum}`
    const onStart = () => {
      transStateUpdate({stateText: 'Waiting for Confrimation', amountText, status: 'start'})
    }
    const onEnd = (state: string, blockHash?: string) => {
      let stateText = ''
      let status = ''
      let hash
      if (state === 'complete') {
        stateText = 'Transaction Submitted'
        status = 'end'
        hash = blockHash
      } else if (state === 'rejected') {
        stateText = 'Transaction Rejected'
        status = 'rejected'
      } else {
        stateText = 'Transaction Failed'
        status = 'error'
      }
      transStateUpdate({stateText: stateText, amountText, status: status, hash})
    }

    doRemoveLiqudityTrans(fromTokenType ?? defaultTokenType, toTokenType ?? defaultTokenType, amountBN, accountInfo, onError, onStart, onEnd)

  }, [fromTokenType, toTokenType, inputShareAmount, accountInfo, onClose, transStateUpdate])
  
  useEffect(() => {
    const item = findPairItem(userPoolItems, fromTokenType, toTokenType)
    setBalanceAmount(BigNum.fromBigNum(item?.userShare ?? '').realNum)
    setOutputTokenAmount({token1Amount: '0', token2Amount: '0', token1Type: fromTokenType, token2Type: toTokenType})
  }, [fromTokenType, toTokenType, userPoolItems])

  useEffect(() => {
    setInsufficientBalance(!_.isEmpty(accountInfo.address) && (BigNum.fromRealNum(inputShareAmount ?? '').gt(BigNum.fromRealNum(balanceAmount))))
  }, [fromTokenType, toTokenType, balanceAmount, inputShareAmount, accountInfo])

  useEffect(() => {
    const item = findPairItem(chainPoolItems, fromTokenType, toTokenType)
    const totalBN = BigNum.fromBigNum(item?.totalShare ?? '')
    const inputBN = BigNum.fromRealNum(inputShareAmount)

    let fromTotal:BigNum
    let toTotal:BigNum
    if (item?.fromToken.name === fromTokenType?.name) {
      fromTotal = BigNum.fromBigNum(item?.fromAmount ?? '')
      toTotal = BigNum.fromBigNum(item?.toAmount ?? '')
    } else {
      fromTotal = BigNum.fromBigNum(item?.toAmount ?? '')
      toTotal = BigNum.fromBigNum(item?.fromAmount ?? '')
    }
    
    const rate = div(fromTotal.bigNum, toTotal.bigNum)
    const percent = totalBN.eq(BigNum.Zero) ? '-' : div(inputBN.bigNum, totalBN.bigNum, true)

    setShowData([
      {
        label: `Rates`,
        amount: `${rate} ${fromTokenType?.name ?? ''}/${toTokenType?.name ?? ''}`
      },
      {
        label: `Current pool Size:`,
        amount: `${fromTotal.realNum} ${fromTokenType?.name ?? ''} + ${toTotal.realNum} ${toTokenType?.name ?? ''}`
      },
      {
        label: `Share of pool`,
        amount: `${percent}%`
      },
    ])
  }, [fromTokenType, toTokenType, inputShareAmount, chainPoolItems])

    return (
      <Modal isOpen={isOpen} onDismiss={() => {''}} maxHeight={90} customStyle={customStyle}>
        <BodyWrapper>
          <Head>
            <Title>Remove liquidity</Title>
            <CloseButton onClick={() => onClose('close')}><i className="fa fo-x"></i></CloseButton>
          </Head>
          <Wrapper>
            <CurrencyInputPanel
              id="remove-liquid-input"
              value={inputShareAmount ?? ''}
              onUserInput={handleSetInputShareAmount}
              onCurrencySelect={()=> {''}}
              balance={balanceAmount}
              showBalance={!_.isEmpty(accountInfo.address)}
              showMaxButton={!_.isEmpty(accountInfo.address)}
              onMax={handleSetMaxShareAmount}
              insufficientBalance={insufficientBalance}
              customStyle={'width: 100%;'}
              forPair={true}
              tokenPair={{fromToken: fromTokenType ?? defaultTokenType, 
                toToken: toTokenType ?? defaultTokenType}}
            />
            <CirclePlus><i className="fa fo-arrow-down"></i></CirclePlus>
            <CurrencyAmountWrapper>
              <OutputText>Output (estimated)</OutputText>
              <AmountText>{`${outputTokenAmount.token1Amount} ${outputTokenAmount.token1Type?.name ?? ''} + ${outputTokenAmount.token2Amount} ${outputTokenAmount.token2Type?.name ?? ''}`}</AmountText>
            </CurrencyAmountWrapper>

            <Button onClick={handleRemoveClick} disabled={!inputBtnEnable()}>Remove liquidity</Button>

            <ContentWrapper>
              <PairTransContent contents={showData}></PairTransContent>
            </ContentWrapper>
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
