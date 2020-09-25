import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SwapPoolTabs } from '../../components/NavigationTabs'
import Column from '../../components/Column'
import { darken } from 'polished';
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import { BottomButton } from '../../components/Button'
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
import TransferStateModal from './transferStateModal';
import Row, {RowBetween} from '../../components/Row'
import Circle from '../../components/Circle'

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 620px;
`;

export const Wrapper = styled.div`
  position: relative;
  background: white;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
  border-radius: 1rem;
  padding: 17px 24px;
  max-width: 460px;
  width: 100%;
`;

export const Title = styled.div`
  height: 24px;
  font-size: 16px;
  font-family: Helvetica-Light, Helvetica;
  font-weight: 300;
  color: #666F83;
  line-height: 24px;
  `

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 460px;
  margin-top: 12px;
`

const StyledCircle = styled(Circle)`
  background: #FCF0DC;
  border: 2px solid #FFFFFF;
  text-align: center;
  font-size: 18px;
  color: #F99E3C;
`

const InfoText = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: #F99E3C;
  margin-left: 4px;
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
  width: 100%;
`

const TipWrapper = styled(Row)`
  margin-bottom: 32px;
`

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
  const [transferStateModalOpen, setTransferStateModalOpen] = useState(false)

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

  const onLiquidAddConfirmModalClose = (state: string) => {
    setLiquidAddConfirmModalOpen(false)

    if (state !== 'close') {
      setTransferStateModalOpen(true)
    }
  }

  const onRemoveLiquidModalClose = (state: string) => {
    setRemoveLiquidModalOpen(false)

    if (state !== 'close') {
      setTransferStateModalOpen(true)
    }
  }
    return (
      <BodyWrapper>
        <SwapPoolTabs active={'pool'} customStyle={'width: 100%;max-width: 460px;'}/>
        <TipWrapper>
          <StyledCircle><i className="fa fo-info"></i></StyledCircle>
          <InfoText>Liquidity Providers earn 0.3% of all trades on this pair proportional to their share of the pool. Fees are added to the pool, and can be claimed by withdrawing liquidity.</InfoText>
        </TipWrapper>
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
        <ButtonWrapper>
        {
          _.isEmpty(myInfo.address) ? <WalletConnectComp></WalletConnectComp> 
          : <BottomButton onClick={handleClick} disabled={disabled}>{t('addLiquidity')}</BottomButton>
        }
        </ButtonWrapper>
        
        
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
          onClose={onLiquidAddConfirmModalClose}></LiquidAddConfirmModal>
        <RemoveLiquidModal 
          isOpen={removeLiquidModalOpen} 
          onDismiss={() => {}} 
          fromTokenType={selectedItem.fromToken}
          toTokenType={selectedItem.toToken}
          onClose={onRemoveLiquidModalClose}></RemoveLiquidModal>
        <TransferStateModal isOpen={transferStateModalOpen} onDismiss={() => {}} onClose={() => setTransferStateModalOpen(false)}></TransferStateModal>
      </BodyWrapper>
    );
}
