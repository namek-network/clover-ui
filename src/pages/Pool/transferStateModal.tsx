import React from 'react';
import styled from 'styled-components';
import Column, {ColumnCenter} from '../../components/Column'
import Modal from '../../components/Modal'

import { useTransState } from '../../state/pool/hooks';
import ReactLoading from "react-loading";
import {getBlockBrowserAddress} from '../../utils/httpServices'
import { PrimitiveButton } from '../../components/Button'


const customStyle = "position: relative; overflow: visible; max-width:472px;"

const Head = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding: 16px 12px 0 16px;
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

export const Button = styled(PrimitiveButton)`
  margin-top: 12px;
}`

const StateTextWrapper = styled(Column)`
  align-items: center;
  margin-bottom: 30px;
`
const AmountText = styled.div`
  font-size: 16px;
  font-family: Helvetica;
  color: #111A34;
  line-height: 16px;
  margin-top: 8px;
  white-space: pre-line;
  text-align: center;
`

const StateText = styled.div`
  font-size: 32px;
  font-family: Helvetica;
  color: #111A34;
  margin-top: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 28px;
  `};
`

const SubmitIcon = styled.div` 
  height: 57px;
  font-size: 56px;
  color: #F99E3C;
  line-height: 57px;
`

const TransLink = styled.a`
  height: 16px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FF8212;
  line-height: 16px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    color: #F99E3C;
    text-decoration: none;
  }
`

interface TransferStateModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TransferStateModal({isOpen, onClose}: TransferStateModalProps): React.ReactElement {
  const transState = useTransState()
    return (
      <Modal isOpen={isOpen} onDismiss={() => {''}} maxHeight={90} customStyle={customStyle}>
        <BodyWrapper>
          <Head>
            <CloseButton onClick={() => onClose()}><i className="fa fo-x"></i></CloseButton>
          </Head>
          
          <Wrapper>
            {
              transState.status === 'start' ? <ReactLoading type={'bubbles'} color="#F68C2F" /> 
              : <SubmitIcon>
                  {
                    transState.status === 'end' ? <i className="fa fo-check-circle"></i> 
                      : <i className="fa fo-x-circle" style={{color: 'red'}}></i>
                  }
                </SubmitIcon>
            }
          <StateTextWrapper>
            <StateText>{transState.stateText}</StateText>
            <AmountText>{transState.amountText}</AmountText>
            {
              transState.status === 'end' && <TransLink href={getBlockBrowserAddress(transState.hash)} target="_blank">View on Subscan</TransLink>
            }
          </StateTextWrapper>
            {
              (transState.status === 'end' || transState.status === 'rejected' || transState.status === 'error') && <Button onClick={() => {
                onClose()
              }}>Close</Button>
            }
            
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
