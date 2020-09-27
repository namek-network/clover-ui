import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { SwapPoolTabs } from '../../components/NavigationTabs'
import Column, {ColumnCenter} from '../../components/Column'
import { darken } from 'polished';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import Row, {RowBetween} from '../../components/Row'
import PoolPairItem, { PairTransContent, PairIconTitle } from './poolPairItem'
import _ from 'lodash'
import Modal from '../../components/Modal'
import BigNum, {div, times}  from '../../types/bigNum';
import { TokenType } from '../../state/token/types';
import { showTextType } from './types'
import {selectedPairExists, findPairItem} from './utils'
import { useUserPoolPairItems, useChainPoolPairItems, useUserPoolPairItemsUpdate, useChainPairItemsUpdate, useTransStateUpdate } from '../../state/pool/hooks';
import { api } from '../../utils/apiUtils'
import { useApiInited } from '../../state/api/hooks';
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks'
import { AccountInfo } from '../../state/wallet/types';
import { doAddLiqudityTrans } from '../../utils/transUtils'
import { toast } from 'react-toastify';


const customStyle = "position: relative; \
overflow: visible; \
max-width:472px;"

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
`

export const Button = styled(RebassButton)`
  color: white;
  border: 0;
  background: #FF6E12;
  border-radius: 8px;
  font-size: 18px;
  outline: none;
  height: 49px;
  width: 100%;
  margin-top: 12px;

  &:focus {
    outline: none;
  }
  &:hover {
    background-color: ${({ disabled }) => !disabled && darken(0.08, '#FF6E12')};
  }
  :disabled {
    opacity: 0.4;
  }
}`

const PairContentWrapper = styled.div`
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px 16px 0 16px;
  width: 100%;
`

const AmountText = styled.div`
  height: 32px;
  line-height: 32px;
  font-size: 32px;
  font-family: Helvetica;
  color: #111A34;
  margin-top:16px;
`

const PairText = styled.div`
  font-size: 16px;
  font-family: Helvetica;
  color: #111A34;
  margin-top: 8px;
`

const TipText = styled.div`
  font-size: 16px;
  font-family: Helvetica-Light, Helvetica;
  font-weight: 300;
  color: #666F83;
  margin-left: 20px;
  margin-top: 24px;
`

const Body = styled.div`
  overflow: auto;
`
interface AddLiquidModalProps {
  isOpen: boolean
  onClose: (state: string) => void
  fromToken: TokenType,
  toToken: TokenType,
  fromAmount: BigNum,
  toAmount: BigNum
}

export default function LiquidAddConfirmModal({isOpen, onClose, fromToken, toToken, fromAmount, toAmount}: AddLiquidModalProps) {
  const [showData, setShowData] = useState<showTextType[]>([])
  const chainPoolItems = useChainPoolPairItems()
  const [shareAmount, setShareAmount] = useState('')

  const inited = useApiInited()
  const accountInfo = useAccountInfo()

  const transStateUpdate = useTransStateUpdate()
  
  useEffect(() => {
    const loadShareFromServer = async (inited: boolean, fromToken: TokenType, toToken: TokenType, fromAmount: BigNum, toAmount: BigNum) => {
      if (!inited || _.isEmpty(fromToken.name) || _.isEmpty(toToken.name)) {
        return
      }
      
      const ret = await api.toAddLiquidity(fromToken.name, toToken.name, fromAmount.bigNum, toAmount.bigNum)
      setShareAmount(BigNum.fromBigNum(ret[0]).realNum)

      setShowData([
        {
          label: `${fromToken.name} Deposited:`,
          amount: `${fromAmount.realNum}`
        },
        {
          label: `${toToken.name} Deposited:`,
          amount: `${toAmount.realNum}`
        },
        {
          label: `Rates:`,
          amount: `${div(fromAmount.bigNum.toString(), toAmount.bigNum.toString())} ${fromToken.name}/${toToken.name}`
        },
        {
          label: `Share of pool:`,
          amount: `${div(ret[0], ret[1], true)}%`
        },
      ])
    }

    loadShareFromServer(inited, fromToken, toToken, fromAmount, toAmount)
  }, [fromToken, toToken, fromAmount, toAmount, chainPoolItems, inited])

  const handleConfirmClick = useCallback(() => {
    onClose('confirm')

    if (_.isEmpty(accountInfo.address)) {
      return
    }
    const onError = (msg: string) => {
      toast(msg)
    }

    const amountText = `Supplying ${fromAmount.realNum} ${fromToken.name} and  ${toAmount.realNum} ${toToken.name}`
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

    doAddLiqudityTrans(fromToken, toToken, fromAmount, toAmount, accountInfo, onError, onStart, onEnd)

  }, [fromToken, toToken, fromAmount, toAmount, accountInfo])

    return (
      <Modal isOpen={isOpen} onDismiss={() => {}} maxHeight={90} customStyle={customStyle}>
        <BodyWrapper>
          <Head>
            <Title>You will receive</Title>
            <CloseButton onClick={() => onClose('close')}><i className="fa fo-x"></i></CloseButton>
          </Head>
          <Body>
            <Wrapper>
              <PairIconTitle left={fromToken.logo ?? ''} right={toToken.logo ?? ''} title={''} size={'40px'}></PairIconTitle>
              <AmountText>{shareAmount}</AmountText>
              <PairText>{`${fromToken.name}/${toToken.name} Tokens`}</PairText>
              <TipText>Output is estimated. If the price changes by more than 0.5%. your transaction will revert.</TipText>
            </Wrapper>
            
            <Wrapper>
              <PairContentWrapper>
                <PairTransContent contents={showData}></PairTransContent>
              </PairContentWrapper>
              <Button onClick={handleConfirmClick}>Confirm Supply</Button>
            </Wrapper>
          </Body>
        </BodyWrapper>
      </Modal>
    );
}
