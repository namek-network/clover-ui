import React, { useState } from 'react';
import styled from 'styled-components';
import { SwapPoolTabs } from '../../components/NavigationTabs'
import Column from '../../components/Column'
import { darken } from 'polished';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import PoolPairItem from './poolPairItem'
import _ from 'lodash'
import AddLiquidModal from './addLiquidModal'
import LiquidAddConfirmModal from './liquidAddConfirmModal'
import RemoveLiquidModal from './removeLiquidModal';

const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
`;

export const Wrapper = styled.div`
  position: relative;
  background: white;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 17px 24px;
`;

export const Title = styled.div`
  height: 24px;
  font-size: 16px;
  font-family: Helvetica-Light, Helvetica;
  font-weight: 300;
  color: #666F83;
  line-height: 24px;
  `
export const Button = styled(RebassButton)`
  color: white;
  border: 0;
  background: #FF6E12;
  border-radius: 8px;
  font-size: 18px;
  outline: none;
  height: 49px;

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

const StyledButton = styled(Button)`
  margin-top: 8px;
`

const NoLiquidFount = styled.div`
  text-align: center;
  background: #F9FAFB;
  border-radius: 16px;
  padding: 24px 0;
  color: #858B9C;
  margin: 8px 0;
`

const PoolPaireList = styled.div`
  max-height: 240px;
  overflow: auto;
`

const testData = [
  {id: 1}, {id:2},{id: 3}, {id: 4}, {id: 5}
]

// const testData: any = []

export default function Pool() {
  const [selectedItem, setSeletedItem] = useState({})
  const [isOpen, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

    return (
      <BodyWrapper>
        <SwapPoolTabs active={'pool'} />
        <Wrapper>
          <Column>
            <Title>
              My Liquidity List
            </Title>
            {
              _.isEmpty(testData) ? <NoLiquidFount>You have no Liquid</NoLiquidFount> 
                : <PoolPaireList>
                  {
                    _.map(testData, (item) => (
                    <PoolPairItem item={item} key={item.id}
                      selectedItem={selectedItem} 
                      onSelectItem={setSeletedItem}></PoolPairItem>))
                  }
                </PoolPaireList>
            }
            <StyledButton onClick={handleClick}disabled={disabled}>Add Liquidity</StyledButton>
          </Column>
        </Wrapper>
        <AddLiquidModal isOpen={isOpen} onDismiss={() => {}} onClose={() => setOpen(false)}></AddLiquidModal>
        <LiquidAddConfirmModal isOpen={false} onDismiss={() => {}} onClose={() => setOpen(false)}></LiquidAddConfirmModal>
        <RemoveLiquidModal isOpen={false} onDismiss={() => {}} onClose={() => setOpen(false)}></RemoveLiquidModal>
      </BodyWrapper>
    );
}
