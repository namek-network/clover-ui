import React, { useState, useEffect } from 'react';
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
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks'
import { api } from '../../utils/apiUtils'
import { useApiInited } from '../../state/api/hooks'
import { useTranslation } from 'react-i18next'
import WalletSelectDialog from '../../components/WalletComp/walletSelectDialog'
import { supportedWalletTypes, loadAccount } from '../../utils/AccountUtils'
import { toast } from 'react-toastify';
import { useTokenTypes } from '../../state/token/hooks';
import WalletConnectComp from '../../components/WalletComp/walletConnectComp'
import { useUserPoolPairItems, useChainPoolPairItems, useUserPoolPairItemsUpdate, useChainPairItemsUpdate } from '../../state/pool/hooks';
import { TokenType, defaultTokenType } from '../../state/token/types';
import BigNum  from '../../types/bigNum';
import { PoolPairItem as PoolPairItemType, defaultPoolPairItem } from '../../state/pool/types';

const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
`;

export const Wrapper = styled.div`
  position: relative;
  background: white;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
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
  margin-top: 12px;
  width: 100%;
`

const NoLiquidFount = styled.div`
  background: #F9FAFB;
  border-radius: 16px;
  padding: 16px;
  color: #858B9C;
  margin: 8px 0 112px 0;
`

const PoolPaireList = styled.div`
  max-height: 240px;
  overflow: auto;
`

const testData = [
  {id: 1}, {id:2},{id: 3}, {id: 4}, {id: 5}
]

export interface DataFromAddLiquid {
  fromToken: TokenType,
  toToken: TokenType,
  fromAmount: BigNum,
  toAmount: BigNum
}

const defaultDataFromAddLiquid = {
  fromToken: defaultTokenType,
  toToken: defaultTokenType,
  fromAmount: BigNum.fromRealNum(''),
  toAmount: BigNum.fromRealNum('')
}

export default function Pool() {
  const [selectedItem, setSeletedItem] = useState<PoolPairItemType>(defaultPoolPairItem)
  const [isOpen, setOpen] = useState(false)
  const [addLiquidModalOpen, setAddLiquidModalOpen] = useState(false)
  const [removeLiquidModalOpen, setRemoveLiquidModalOpen] = useState(false)
  const [liquidAddConfirmModalOpen, setLiquidAddConfirmModalOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const [dataFromAddLiquid, setDataFromAddLiquid] = useState<DataFromAddLiquid>(defaultDataFromAddLiquid)

  const userPoolItems = useUserPoolPairItems()
  const chainPoolItems = useChainPoolPairItems()

  const userPoolItemsUpdate = useUserPoolPairItemsUpdate()
  const chainPoolItemsUpdate = useChainPairItemsUpdate()

  const { t } = useTranslation()

  const myInfo = useAccountInfo()
  const apiInited = useApiInited()

  const tokenTypes = useTokenTypes()

  useEffect(() => {
    if (!apiInited) {
      return
    }

    if (_.isEmpty(myInfo.address)) {
      return
    }

    const loadPoolItems = async () => {
      const items = await api.getLiquidity(myInfo.address)
      console.log(`item: ${items}`)
      

      userPoolItemsUpdate(_.map(items, ([fromTokenName, toTokenName, fromAmount, toAmount, userShare, totalShare]) => {
        return {
          fromToken: _.find(tokenTypes, (tt) => tt.name === fromTokenName.toString()) ?? defaultTokenType,
          toToken: _.find(tokenTypes, (tt) => tt.name === toTokenName.toString()) ?? defaultTokenType,
          fromAmount: fromAmount.toString(), 
          toAmount: toAmount.toString(), 
          userShare: userShare.toString(), 
          totalShare: totalShare.toString()
        }
      }))

      const chainItems = await api.getLiquidity()
      console.log(`chain item: ${chainItems}`)
      chainPoolItemsUpdate(_.map(chainItems, ([fromTokenName, toTokenName, fromAmount, toAmount, userShare, totalShare]) => {
        return {
          fromToken: _.find(tokenTypes, (tt) => tt.name === fromTokenName.toString()) ?? defaultTokenType,
          toToken: _.find(tokenTypes, (tt) => tt.name === toTokenName.toString()) ?? defaultTokenType,
          fromAmount: fromAmount.toString(), 
          toAmount: toAmount.toString(), 
          userShare: userShare.toString(), 
          totalShare: totalShare.toString()
        }
      }))
    }

    loadPoolItems()
  }, [myInfo, apiInited, tokenTypes])

  const handleClick = () => {
    setAddLiquidModalOpen(true)
  }

  const handleRemoveClick = () => {
    setRemoveLiquidModalOpen(true)
  }

  const onAddLiquidModalClose = (state: string, data?: DataFromAddLiquid) => {
    setAddLiquidModalOpen(false)

    if (state !== 'close' && !_.isEmpty(data)) {
      setLiquidAddConfirmModalOpen(true)
      setDataFromAddLiquid(data ?? defaultDataFromAddLiquid)
    }
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
              _.isEmpty(userPoolItems) ? <NoLiquidFount>{t('noLiquidity')}</NoLiquidFount> 
                : <PoolPaireList>
                  {
                    _.map(userPoolItems, (item) => (
                    <PoolPairItem item={item} key={item.fromToken.name + item.toToken.name}
                      onAddClick={handleClick}
                      onRemoveClick={handleRemoveClick}
                      selectedItem={selectedItem} 
                      onSelectItem={setSeletedItem}></PoolPairItem>))
                  }
                </PoolPaireList>
            }
          </Column>
        </Wrapper>
        {
          _.isEmpty(myInfo.address) ? <WalletConnectComp></WalletConnectComp> 
          : <StyledButton onClick={handleClick} disabled={disabled}>{t('addLiquidity')}</StyledButton>
        }
        
        <AddLiquidModal isOpen={addLiquidModalOpen} 
          onDismiss={() => {}} 
          fromTokenType={selectedItem.fromToken.id < 0 ? undefined : selectedItem.fromToken}
          toTokenType={selectedItem.toToken.id < 0 ? undefined : selectedItem.toToken}
          onClose={onAddLiquidModalClose}></AddLiquidModal>
        <LiquidAddConfirmModal 
          isOpen={liquidAddConfirmModalOpen} 
          onDismiss={() => {}} 
          fromToken={dataFromAddLiquid.fromToken}
          toToken={dataFromAddLiquid.toToken}
          fromAmount={dataFromAddLiquid.fromAmount}
          toAmount={dataFromAddLiquid.toAmount}
          onClose={() => setLiquidAddConfirmModalOpen(false)}></LiquidAddConfirmModal>
        <RemoveLiquidModal isOpen={false} onDismiss={() => {}} onClose={() => setOpen(false)}></RemoveLiquidModal>
      </BodyWrapper>
    );
}
