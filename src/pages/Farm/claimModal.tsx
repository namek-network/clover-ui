import React, { useCallback } from 'react';
import styled from 'styled-components';
import Column, {ColumnCenter} from '../../components/Column'
import {RowBetween} from '../../components/Row'
import _ from 'lodash'
import Modal from '../../components/Modal'
import { useTranslation } from 'react-i18next'
import { useTransStateUpdate } from '../../state/pool/hooks';
import { TokenType } from '../../state/token/types';
import { toFixedWithTrim } from '../../types/bigNum';
import { useAccountInfo } from '../../state/wallet/hooks';
import { doTransaction } from '../../utils/transUtils'
import tokens from '../../state/token/tokens'

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
  padding: 0 27px 16px 24px;
  overflow: auto;
  display: flex;
`

const Button = styled(PrimitiveButton)`
  margin-top: 32px;
  flex-shrink: 0;
}`

const Amount1Text = styled.div`
  height: 32px;
  font-size: 32px;
  font-family: Helvetica;
  color: #111A34;
  line-height: 32px;
  margin-top: 8px;
`

const Amount2Text = styled.div`
  height: 16px;
  font-size: 16px;
  font-family: Helvetica;
  color: #111A34;
  line-height: 16px;
  margin-top: 6px;
`

interface ClaimProps {
  isOpen: boolean
  onClose: (state: string) => void
  fromTokenType: TokenType | undefined
  toTokenType: TokenType | undefined
  balanceAmount: string
}

export default function ClaimModal({isOpen, onClose, fromTokenType, toTokenType, balanceAmount}: ClaimProps): React.ReactElement { 
  const accountInfo = useAccountInfo();
  const transStateUpdate = useTransStateUpdate()

  const handleClick = useCallback(() => {
    onClose('confirm')

    if (_.isEmpty(accountInfo.address)) {
      return
    }
    const onError = (msg: string) => {
      // toast(msg)
    }

    let amountText = `Claiming ${balanceAmount} CLV`
    const onStart = () => {
      transStateUpdate({stateText: 'Waiting for Confirmation', amountText, status: 'start'})
    }
    const onEnd = (state: string, blockHash?: string, payload?: any) => {
      let stateText = ''
      let status = ''
      let hash
      if (state === 'complete') {
        stateText = `${toFixedWithTrim(payload?.claimAmount?.realNum, 6) ?? '-'} CLV Claimed`
        amountText = `You can use them for governance.`
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

    doTransaction('withdrawRewards', [fromTokenType?.id ?? -1, toTokenType?.id ?? -1], accountInfo.address, onError, onStart, onEnd)

  }, [fromTokenType, toTokenType, accountInfo, onClose, transStateUpdate, balanceAmount])

  const { t } = useTranslation()

    return (
      <Modal isOpen={isOpen} onDismiss={() => {''}} maxHeight={90} customStyle={customStyle}>
        <BodyWrapper>
          <Head>
            <Title>{t('claim')}</Title>
            <CloseButton onClick={() => onClose('close')}><i className="fa fo-x"></i></CloseButton>
          </Head>
          <Wrapper>
            <img alt={''} src={tokens[0].logo ?? ''} width={'80px'}></img>
            <Amount1Text>{`${toFixedWithTrim(balanceAmount, 6)} CLV`}</Amount1Text>
            <Amount2Text>{'has arrived. You can use them for governance'}</Amount2Text>
            <Button onClick={handleClick}>{t('claim')}</Button>
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
