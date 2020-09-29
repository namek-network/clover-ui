import React from 'react'
import styled from 'styled-components'
import ReactLoading from "react-loading"
import Column, {ColumnCenter} from '../../components/Column'
import { darken } from 'polished'
import { Button as RebassButton } from 'rebass/styled-components'
import Modal from '../../components/Modal'
import { useSwapTransState } from '../../state/swap/hooks'
import { getBlockBrowserAddress } from '../../utils/httpServices'


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

const StateTextWrapper = styled(Column)`
  align-items: center;
  margin-bottom: 30px;
`

const AmountText = styled.div`
  height: 16px;
  font-size: 16px;
  font-family: Helvetica;
  color: #111A34;
  line-height: 16px;
  margin-top: 8px;
  margin-bottom: 30px;
`

const StateText = styled.div`
  height: 32px;
  font-size: 32px;
  font-family: Helvetica;
  color: #111A34;
  line-height: 32px;
  margin-top: 20px;
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
  onDismiss: () => void
  onClose: () => void
}

export default function TransferStateModal({isOpen, onClose}: TransferStateModalProps): React.ReactElement {
  const transState = useSwapTransState()

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
                    transState.status === 'success' ? <i className="fa fo-check-circle"></i> 
                      : <i className="fa fo-x-circle" style={{color: 'red'}}></i>
                  }
                </SubmitIcon>
            }

          <StateTextWrapper>
            <StateText>{transState.stateText}</StateText>
            <AmountText>{transState.amountText}</AmountText>
            {
              transState.status === 'success' && <TransLink href={getBlockBrowserAddress(transState.hash)} target="_blank">View on Subscan</TransLink>
            }
          </StateTextWrapper>

            {
              (transState.status === 'failed') && <Button onClick={() => {
                onClose()
              }}>Close</Button>
            }
            
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
