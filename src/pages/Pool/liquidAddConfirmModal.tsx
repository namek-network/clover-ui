import React, { useState } from 'react';
import styled from 'styled-components';
import { SwapPoolTabs } from '../../components/NavigationTabs'
import Column, {ColumnCenter} from '../../components/Column'
import { darken } from 'polished';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import Row, {RowBetween} from '../../components/Row'
import PoolPairItem, { PairTransContent, PairIconTitle } from './poolPairItem'
import _ from 'lodash'
import Modal from '../../components/Modal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import BxbIcon from '../../assets/images/icon-bxb.svg';
import BethIcon from '../../assets/images/icon-beth.svg';
import BusdIcon from '../../assets/images/icon-busd.svg';
import BdotIcon from '../../assets/images/icon-dot.svg';

import Types from '../../state/token/tokens'


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

const testData = [
  {label:'Pooled DOT:', amount: '3.357 DOT'},
  {label:'Pooled BxETH:', amount: '2.99967 BxETH'},
  {label:'My pool share:', amount: '0.01%'}
]

interface AddLiquidModalProps {
  isOpen: boolean
  onDismiss: () => void
  onClose: () => void
}

export default function LiquidAddConfirmModal({isOpen, onDismiss, onClose}: AddLiquidModalProps) {
    
    return (
      <Modal isOpen={isOpen} onDismiss={() => {}} maxHeight={90} customStyle={customStyle}>
        <BodyWrapper>
          <Head>
            <Title>You will receive</Title>
            <CloseButton onClick={() => onClose()}><i className="fa fo-x"></i></CloseButton>
          </Head>
          <Wrapper>
            <PairIconTitle left={BxbIcon} right={BethIcon} title={''} size={'40px'}></PairIconTitle>
            <AmountText>0.00000620758</AmountText>
            <PairText>DOT/BxETH Tokens</PairText>
            <TipText>Output is estimated. If the price changes by more than 0.5%. your transaction will revert.</TipText>
          </Wrapper>
          
          <Wrapper>
            <PairContentWrapper>
              <PairTransContent contents={testData}></PairTransContent>
            </PairContentWrapper>
            <Button onClick={() => {}}>Confirm Supply</Button>
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
