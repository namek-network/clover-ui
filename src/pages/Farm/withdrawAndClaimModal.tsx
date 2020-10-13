import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Column, {ColumnCenter} from '../../components/Column'
import {RowBetween} from '../../components/Row'
import _ from 'lodash'
import Modal from '../../components/Modal'
import { useTranslation } from 'react-i18next'
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { useTransStateUpdate } from '../../state/pool/hooks';
import { TokenType, defaultTokenType } from '../../state/token/types';
import BigNum, {div, times, toFixedWithTrim} from '../../types/bigNum';
import { useAccountInfo } from '../../state/wallet/hooks';
import { doTransaction } from '../../utils/transUtils'
import { StrongValueTextXS, LabelTextXS } from './index'

import { PrimitiveButton } from '../../components/Button'

const customStyle = "position: relative;overflow: visible; max-width:472px;"

const Head = styled(RowBetween)`
  padding: 16px 12px 0 16px;
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
  padding: 30px 27px 16px 24px;
  overflow: auto;
`

const RowWrapper = styled(RowBetween)`
  margin-top: 8px;
`

const RowLeft = styled.div`
  display: flex;
  align-items: center;
`
const RowRight = styled.div`
  text-align: end;
`

const Button = styled(PrimitiveButton)`
  margin-top: 32px;
}`

interface WithdrawAndClaimProps {
  isOpen: boolean
  onClose: (state: string) => void
  fromTokenType: TokenType | undefined
  toTokenType: TokenType | undefined
  balanceAmount: string,
  unClaimedAmount: string
}

export default function WithdrawAndClaimModal({isOpen, onClose, fromTokenType, toTokenType, balanceAmount, unClaimedAmount}: WithdrawAndClaimProps): React.ReactElement {
  const [inputShareAmount, setInputShareAmount] = useState<string>('');
  const [claimAmount, setClaimAmount] = useState<BigNum>(BigNum.Zero);
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  
  const accountInfo = useAccountInfo();
  const transStateUpdate = useTransStateUpdate()

  const calcClaimAmount = (inputAmount: string, balanceAmount: string, unClaimedAmount: string) => {
    const inputAmountBN = BigNum.fromRealNum(inputAmount)
    const balanceAmountBN = BigNum.fromRealNum(balanceAmount)
    const unClaimedAmountBN = BigNum.fromRealNum(unClaimedAmount)

    const claimAmountEsBN = BigNum.fromBigNum(div(times(inputAmountBN.bigNum, unClaimedAmountBN.bigNum), balanceAmountBN.bigNum))
    setClaimAmount(claimAmountEsBN)
  }

  const handleSetInputShareAmount = useCallback((amount: string) => {
    setInputShareAmount(amount);
    calcClaimAmount(amount, balanceAmount, unClaimedAmount)
  }, [balanceAmount, unClaimedAmount])

  const handleSetMaxShareAmount = useCallback(() => {
    setInputShareAmount(balanceAmount)
  }, [balanceAmount]);

  const handleClick = useCallback(() => {
    onClose('confirm')
    const amountBN = BigNum.fromRealNum(inputShareAmount)

    if (_.isEmpty(accountInfo.address)) {
      return
    }
    const onError = (msg: string) => {
      // toast(msg)
    }

    let amountText = `Withdrawing LP ${amountBN.realNum} ${fromTokenType?.name ?? ''}-${toTokenType?.name ?? ''}\nClaiming ${toFixedWithTrim(claimAmount.realNum, 12)} CLV`
    const onStart = () => {
      transStateUpdate({stateText: 'Waiting for Confirmation', amountText, status: 'start'})
    }
    const onEnd = (state: string, blockHash?: string, payload?: any) => {
      let stateText = ''
      let status = ''
      let hash
      if (state === 'complete') {
        stateText = `${toFixedWithTrim(payload?.claimAmount?.realNum, 6) ?? '-'} CLV Claimed`
        amountText = `Received ${payload?.shareAmount?.realNum ?? '-'} ${fromTokenType?.name ?? ''}-${toTokenType?.name ?? ''}`
        status = 'end'
        hash = blockHash
      } else if (state === 'rejected') {
        stateText = 'Transaction Rejected'
        status = 'rejected'
      } else {
        stateText = 'Transaction Failed'
        amountText = ''
        status = 'error'
      }
      transStateUpdate({stateText: stateText, amountText, status: status, hash})
    }

    doTransaction('unstakePoolShares', [fromTokenType?.id ?? -1, toTokenType?.id ?? -1, amountBN.bigNum], accountInfo.address, onError, onStart, onEnd)

  }, [fromTokenType, toTokenType, inputShareAmount, accountInfo, onClose, transStateUpdate, claimAmount.realNum])
  
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


  const { t } = useTranslation()

  useEffect(() => {
    setInsufficientBalance(!_.isEmpty(accountInfo.address) && (BigNum.fromRealNum(inputShareAmount ?? '').gt(BigNum.fromRealNum(balanceAmount))))
  }, [fromTokenType, toTokenType, balanceAmount, inputShareAmount, accountInfo])

    return (
      <Modal isOpen={isOpen} onDismiss={() => {''}} maxHeight={90} customStyle={customStyle}>
        <BodyWrapper>
          <Head>
            <Title>{t('deposit')}</Title>
            <CloseButton onClick={() => onClose('close')}><i className="fa fo-x"></i></CloseButton>
          </Head>
          <Wrapper>
            <CurrencyInputPanel
              id="withdraw-and-claim-input"
              value={inputShareAmount ?? ''}
              onUserInput={handleSetInputShareAmount}
              onCurrencySelect={()=> {''}}
              balance={balanceAmount}
              showBalance={!_.isEmpty(accountInfo.address)}
              showMaxButton={!_.isEmpty(accountInfo.address)}
              onMax={handleSetMaxShareAmount}
              insufficientBalance={insufficientBalance}
              customStyle={'width: 100%;'}
              forPairUnclickable={true}
              balancePrefix={'AvailableToWithdraw'}
              tokenPair={{fromToken: fromTokenType ?? defaultTokenType, 
                toToken: toTokenType ?? defaultTokenType}}
            />
            <RowWrapper>
              <RowLeft>
                <img alt={''} src={fromTokenType?.logo ?? ''} width={'32px'} style={{marginRight: '8px'}}></img>
                <div><LabelTextXS>{t('clvRewards')}</LabelTextXS></div>
              </RowLeft>
              <RowRight>
                <StrongValueTextXS>{`${toFixedWithTrim(claimAmount.realNum, 12)} CLV`}</StrongValueTextXS>
              </RowRight>
            </RowWrapper>
            
            <Button onClick={handleClick} disabled={!inputBtnEnable()}>{t('withdrawAndClaim')}</Button>
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
