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
import BigNum from '../../types/bigNum';
import { useAccountInfo } from '../../state/wallet/hooks';
import { doTransaction } from '../../utils/transUtils'

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

export const Button = styled(PrimitiveButton)`
  margin-top: 32px;
}`

interface DepositModalProps {
  isOpen: boolean
  onClose: (state: string) => void
  fromTokenType: TokenType | undefined
  toTokenType: TokenType | undefined
  balanceAmount: string
}

export default function DepositModal({isOpen, onClose, fromTokenType, toTokenType, balanceAmount}: DepositModalProps): React.ReactElement {
  const [inputShareAmount, setInputShareAmount] = useState<string>('');
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  
  const accountInfo = useAccountInfo();
  const transStateUpdate = useTransStateUpdate()

  const handleSetInputShareAmount = (amount: string) => {
    setInputShareAmount(amount);
  }

  const handleSetMaxShareAmount = useCallback(() => {
    setInputShareAmount(balanceAmount)
  }, [balanceAmount]);

  const handleDepositClick = useCallback(() => {
    onClose('confirm')
    const amountBN = BigNum.fromRealNum(inputShareAmount)

    if (_.isEmpty(accountInfo.address)) {
      return
    }
    const onError = (msg: string) => {
      // toast(msg)
    }

    let amountText = `Depositing LP ${amountBN.realNum} ${fromTokenType?.name ?? ''}-${toTokenType?.name ?? ''}`
    const onStart = () => {
      transStateUpdate({stateText: 'Waiting for Confirmation', amountText, status: 'start'})
    }
    const onEnd = (state: string, blockHash?: string, payload?: any) => {
      let stateText = ''
      let status = ''
      let hash
      if (state === 'complete') {
        stateText = 'Transaction Submitted'
        amountText = `Depositing LP ${payload?.shareAmount?.realNum ?? '-'} ${fromTokenType?.name ?? ''}-${toTokenType?.name ?? ''}`
        status = 'end'
        hash = blockHash
      } else if (state === 'rejected') {
        stateText = 'Transaction Rejected'
        amountText = ''
        status = 'rejected'
      } else {
        stateText = 'Transaction Failed'
        amountText = ''
        status = 'error'
      }
      transStateUpdate({stateText: stateText, amountText, status: status, hash})
    }

    doTransaction('stakePoolShares', [fromTokenType?.id ?? -1, toTokenType?.id ?? -1, amountBN.bigNum], accountInfo.address, onError, onStart, onEnd)

  }, [fromTokenType, toTokenType, inputShareAmount, accountInfo, onClose, transStateUpdate])
  
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
              id="deposit-input"
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
              balancePrefix={'AvailableToDeposit'}
              tokenPair={{fromToken: fromTokenType ?? defaultTokenType, 
                toToken: toTokenType ?? defaultTokenType}}
            />

            <Button onClick={handleDepositClick} disabled={!inputBtnEnable()}>{t('deposit')}</Button>
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
