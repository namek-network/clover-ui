import React from 'react';
import styled from 'styled-components';
import Column, {ColumnCenter} from '../../components/Column'
import Modal from '../../components/Modal'
import {PrimitiveButton} from '../Button'


const customStyle = "position: relative; overflow: visible; max-width:472px;"

const Head = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px 12px 0 16px;
  justify-content: space-between;
  align-items: center;
`

const CloseButton = styled.div`
  font-size: 20px;
  color: #CCCCCC;
  cursor: pointer;
  height: 20px;
  line-height: 20px;
`
const BodyWrapper = styled(Column)`
  width: 100%
`

const Wrapper = styled(ColumnCenter)`
  padding: 0 27px 16px 24px;
`

const StateTextWrapper = styled(Column)`
  align-items: center;
  margin-top: 32px;
  margin-bottom: 40px;
`

const StateText = styled.div`
  height: 20px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #41485D;
  line-height: 20px;
`

const Title = styled.div`
  height: 16px;
  font-size: 16px;
  font-family: Helvetica;
  color: #777777;
  line-height: 16px;
`

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void,
  title: string,
  info: string
}

export default function InfoModal({isOpen, onClose, title, info}: InfoModalProps): React.ReactElement {
    return (
      <Modal isOpen={isOpen} onDismiss={() => {''}} maxHeight={90} customStyle={customStyle}>
        <BodyWrapper>
          <Head>
            <Title>{title}</Title>
            <CloseButton onClick={() => onClose()}><i className="fa fo-x"></i></CloseButton>
          </Head>
          
          <Wrapper>
            <StateTextWrapper>
              <StateText>{info}</StateText>
            </StateTextWrapper>
            <PrimitiveButton onClick={onClose}>Close</PrimitiveButton>
          </Wrapper>
        </BodyWrapper>
      </Modal>
    );
}
