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

const CurrencyInputPanelBottom = styled(CurrencyInputPanel)`
  width: 100%;
  margin-top: -12px;
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

const LabelText = styled.div`
  height: 14px;
  font-size: 14px;
  font-family: Helvetica;
  color: #858B9C;
  line-height: 14px;
`

const AmountText = styled.div`
  height: 14px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #41485D;
  line-height: 14px;
`

const ContentRowBetween = styled(RowBetween)`
  margin-bottom: 16px;
`

const ContentWrapper = styled(Column)`
  background: #F9FAFB;
  margin-top: 9px;
  width: 100%;
  border-radius: 8px;
  padding: 16px 16px 0 16px;
`

const RightWrapper = styled(Column)`
  position: absolute;
  bottom: 0;
  right: -435px;
  width: 420px;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
  border-radius: 16px;
  opacity: 0.75;
  padding: 22px 52px 0 42px;
`

const PairTitleWrapper = styled.div`
  margin-top: 17px;
`

const PairContentWrapper = styled.div`
  margin-top: 24px;
  padding-bottom: 16px;
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

export default function AddLiquidModal({isOpen, onDismiss, onClose}: AddLiquidModalProps) {
    
    return (
      <Modal isOpen={isOpen} onDismiss={() => {}} maxHeight={90} customStyle={customStyle}>
        <BodyWrapper>
          <Head>
            <Title>Add liquidity</Title>
            <CloseButton onClick={() => onClose()}><i className="fa fo-x"></i></CloseButton>
          </Head>
          <Wrapper>
            <CurrencyInputPanel
              id="add-liquid-input1"
              value={'0'}
              onUserInput={() => {}}
              currency={Types[0]}
              onCurrencySelect={()=> {}}
              balance={'0'}
              showBalance={true}
              showMaxButton={true}
              onMax={() => {}}
              insufficientBalance={false}
              customStyle={'width: 100%;'}
            />
            <CirclePlus><i className="fa fo-plus"></i></CirclePlus>
            <CurrencyInputPanel
              id="add-liquid-input2"
              value={'0'}
              onUserInput={() => {}}
              currency={Types[1]}
              onCurrencySelect={()=> {}}
              balance={'0'}
              showBalance={true}
              showMaxButton={true}
              onMax={() => {}}
              insufficientBalance={false}
              customStyle={'width: 100%;margin-top: -12px;'}
            />

            <Button onClick={() => {}}>Input</Button>

            <ContentWrapper>
            <PairTransContent contents={testData}></PairTransContent>
            </ContentWrapper>
          </Wrapper>
        </BodyWrapper>
        <RightWrapper>
          <Column>
            <Title>My position</Title>
            <PairTitleWrapper>
              <PairIconTitle left={BxbIcon} right={BethIcon} title={'DOT/BxETH'}></PairIconTitle>
            </PairTitleWrapper>
            <PairContentWrapper>
              <PairTransContent contents={testData}></PairTransContent>
            </PairContentWrapper>
          </Column>
        </RightWrapper>
      </Modal>
    );
}
