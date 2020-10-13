import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import NavigationTabs from '../../components/NavigationTabs'
import Row, { RowBetween } from '../../components/Row'
import Column from '../../components/Column'
import Circle from '../../components/Circle'
import { useTranslation } from 'react-i18next'
import { PrimitiveButton, SecondaryLittleButton } from '../../components/Button'
import { PairIconTitle, PairTransContent } from '../Pool/poolPairItem'
import { DataFromAddLiquid, defaultDataFromAddLiquid } from '../Pool'
import { TokenType, defaultTokenType, StakePoolItem } from '../../state/token/types';
import { useTokenTypes } from '../../state/token/hooks';
import AddLiquidModal from '../Pool/addLiquidModal'
import { useAccountInfo } from '../../state/wallet/hooks'
import BigNum, { div, minus, toFixedWithTrim }  from '../../types/bigNum';
import { api } from '../../utils/apiUtils'
import { useUserPoolPairItems, useUserPoolPairItemsUpdate, useChainPairItemsUpdate } from '../../state/pool/hooks';
import { useApiInited } from '../../state/api/hooks'
import { findPairItem } from '../Pool/utils'
import LiquidAddConfirmModal from '../Pool/liquidAddConfirmModal'
import TransferStateModal from '../Pool/transferStateModal';
import DepositModal from './depositModal'
import WithdrawAndClaimModal from './withdrawAndClaimModal'
import ClaimModal from './claimModal'


import _ from 'lodash' 
import { useStakePoolItems } from '../../state/farm/hooks';

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1000px;
`;

const TipWrapper = styled(Row)`
  justify-content: center;
  margin-bottom: 32px;
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
`

const InfoTextBold = styled.div`
  height: 14px;
  font-size: 14px;
  font-family: Helvetica-Bold, Helvetica;
  font-weight: bold;
  color: #F9A346;
  line-height: 14px;
`

const InfoTextWrapper = styled(Column)`
  margin-left: 4px;
`

const ListWrapper = styled.div`
  max-height: calc(100vh - 350px);
  min-height: 350px;
  overflow: auto;
`

const List = styled.div`
  display: grid;
  grid-template-columns: 470px 470px;
  grid-row-gap: 24px;
  grid-column-gap: 16px;
  padding: 20px;
`

const SingleWrapper = styled.div`
  width: 470px;
  padding: 20px;
`

const ItemWrapper = styled(Column)`
  height: 220px;
  background: white;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
`

const ButtonWrapper = styled.div`
  width: 100%;
  padding: 0 16px;
`

const PairIconTitleWrapper = styled.div`
  padding-top: 24px;
  padding-left: 24px;
`

const PairTransContentWrapper = styled.div`
  padding: 24px 40px 0 40px;
`

const FarmPlantWrapper = styled(Column)`
  padding-bottom: 20px;
`

const PlantItemWrapper = styled(Column)`
  width: 470px;
  height: 164px;
  background: white;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
`

const PoolInfoWrapper = styled(Column)`
  width: 470px;
  height: 232px;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
  border-radius: 16px;
  margin-top: 16px;
`

const PlantPairIconTitleWrapper = styled(Row)`
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
`

const AddLiquidityButton = styled(SecondaryLittleButton)`
  height: 32px;
  width: 120px;
  line-height: 32px;
  margin-left: 10px;
  padding: 0;
`

const PoolInfo = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 16px;
  padding: 32px 40px 0 40px;
`

const RowLeft = styled.div`
  display: flex;
  align-items: center;
`

export const LabelTextXS = styled.span`
  font-size: 14px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #858B9C;
  line-height: 14px;
`

// const InfoLabelTextS = styled.i`
//   font-size: 16px;
//   color: #F5A623;
//   font-family: Roboto-Regular, Roboto;
//   font-weight: 400;
// `

const ValueTextXS = styled.span`
  font-size: 14px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #41485D;
  line-height: 14px;
`

const ValueTextL = styled.span`
  font-size: 24px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #41485D;
  line-height: 24px;
`

const StrongValueTextL = styled(ValueTextL)`
  font-weight: bold;
  color: #FF8212;
`

export const StrongValueTextXS = styled(ValueTextXS)`
  font-weight: bold;
`

const RowRight = styled.div`
  text-align: end;
`

const LastRowRight = styled.div`
  display: flex;
`

const RowBetweenWrapper = styled(RowBetween)`
  line-height: 16px;
`

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 134px 136px 134px;
  grid-column-gap: 8px;
  padding: 0 25px;
  margin-top: 40px;
`

const LittleButton = styled(PrimitiveButton)`
  font-size: 14px;
  border-radius: 4px;
  padding: 0;
  height: 32px;
`

const LastRow = styled(RowBetween)`
  height: 16px;
`

export default function Farm(): React.ReactElement {
  const [disabled, ] = useState(false)
  const [time, ] = useState(' 55:16:34:31')
  const [selectedItem, setSelectedItem] = useState<StakePoolItem>()
  const [addLiquidModalOpen, setAddLiquidModalOpen] = useState(false)
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [withdrawAndClaimModalOpen, setWithdrawAndClaimModalOpen] = useState(false)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [liquidAddConfirmModalOpen, setLiquidAddConfirmModalOpen] = useState(false)
  const [showData, setShowData] = useState<{label: string, amount: string}[]>([])
  const [fromToken, setFromToken] = useState<TokenType>()
  const [toToken, setToToken] = useState<TokenType>()
  const [depositDisabled, setDepositDisabled] = useState(true)
  const [withdrawDisabled, setWithDrawDisabled] = useState(true)
  const [claimDisabled, setClaimDisabled] = useState(true)
  const [dataFromAddLiquid, setDataFromAddLiquid] = useState<DataFromAddLiquid>(defaultDataFromAddLiquid)
  const [transferStateModalOpen, setTransferStateModalOpen] = useState(false)

  const { t } = useTranslation()
  const tokenTypes = useTokenTypes()

  const myInfo = useAccountInfo()
  const apiInited = useApiInited()
  const userPoolItems = useUserPoolPairItems()
  const stakePoolItems = useStakePoolItems()

  const userPoolItemsUpdate = useUserPoolPairItemsUpdate()
  const chainPoolItemsUpdate = useChainPairItemsUpdate()

  const handleClick = (item: StakePoolItem) => {
    setSelectedItem(item)
  }

  const addLiquidityClick = () => {
    setAddLiquidModalOpen(true)
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

  const depositClick = () => {
    setDepositModalOpen(true)
  }

  const withdrawAndClaimClick = () => {
    setWithdrawAndClaimModalOpen(true)
  }

  const claimClick = () => {
    setClaimModalOpen(true)
  }

  const onDepositModalClose = (state: string) => {
    setDepositModalOpen(false)

    if (state !== 'close') {
      setTransferStateModalOpen(true)
    }
  }

  const onWithdrawAndClaimModalClose = (state: string) => {
    setWithdrawAndClaimModalOpen(false)

    if (state !== 'close') {
      setTransferStateModalOpen(true)
    }
  }

  const onClaimModalClose = (state: string) => {
    setClaimModalOpen(false)

    if (state !== 'close') {
      setTransferStateModalOpen(true)
    }
  }

  const getTotalAmountShowData = useCallback((item: StakePoolItem) => {
    const itemInPool = _.find(stakePoolItems, (it) => it.fromTokenType.id === item.fromTokenType.id && it.toTokenType.id === item.toTokenType.id)
    return [
      {
        label: 'Total Deposited:', 
        amount: BigNum.fromBigNum(itemInPool?.totalAmount ?? '').realNum
      }, 
      {
        label: `Pool Rate:`,
        amount: `-`
      }
    ]
  }, [stakePoolItems])

  useEffect(() => {
    if (!apiInited) {
      return
    }

    if (_.isEmpty(myInfo.address)) {
      return
    }

    const loadPoolItems = async () => {
      const items = await api.getLiquidity(myInfo.address)

      userPoolItemsUpdate(_.map(items, ([fromTokenName, toTokenName, fromAmount, toAmount, userShare, userStaked, totalShare]) => {
        return {
          fromToken: _.find(tokenTypes, (tt) => tt.name === fromTokenName.toString()) ?? defaultTokenType,
          toToken: _.find(tokenTypes, (tt) => tt.name === toTokenName.toString()) ?? defaultTokenType,
          fromAmount: fromAmount.toString(), 
          toAmount: toAmount.toString(), 
          userShare: userShare.toString(), 
          userStaked: userStaked.toString(),
          totalShare: totalShare.toString()
        }
      }))

      const chainItems = await api.getLiquidity()
      chainPoolItemsUpdate(_.map(chainItems, ([fromTokenName, toTokenName, fromAmount, toAmount, userShare, userStaked, totalShare]) => {
        return {
          fromToken: _.find(tokenTypes, (tt) => tt.name === fromTokenName.toString()) ?? defaultTokenType,
          toToken: _.find(tokenTypes, (tt) => tt.name === toTokenName.toString()) ?? defaultTokenType,
          fromAmount: fromAmount.toString(), 
          toAmount: toAmount.toString(), 
          userShare: userShare.toString(), 
          userStaked: userStaked.toString(),
          totalShare: totalShare.toString()
        }
      }))
    }

    loadPoolItems()
  }, [apiInited, myInfo, tokenTypes, chainPoolItemsUpdate, userPoolItemsUpdate])

  useEffect(() => {
    const loadMyDepositInfo = async () => {
      const fromToken = _.find(tokenTypes, (tt) => tt.name === selectedItem?.fromTokenType.name) ?? undefined
      const toToken = _.find(tokenTypes, (tt) => tt.name === selectedItem?.toTokenType.name) ?? undefined

      setFromToken(fromToken)
      setToToken(toToken)
      if (!_.isEmpty(fromToken) && !_.isEmpty(toToken)) {
        const item = findPairItem(userPoolItems, fromToken, toToken)
        if (!_.isEmpty(item)) {
          const [share, clv] = await api.getAccountStakingInfo(myInfo.address, fromToken?.name ?? '', toToken?.name ?? '')
          const percent = div(item?.userShare ?? '', item?.totalShare ?? '', true)
          setDepositDisabled(BigNum.fromBigNum(item?.userShare ?? '0').lte(BigNum.Zero))
          setWithDrawDisabled(BigNum.fromBigNum(share ?? '0').lte(BigNum.Zero))
          setClaimDisabled(BigNum.fromBigNum(clv ?? '0').lte(BigNum.Zero))
          setShowData([
            {
              label: 'My pool share:',
              amount: percent
            },
            {
              label: 'My LP token avilable:',
              amount: BigNum.fromBigNum(minus(item?.userShare ?? '0', share)).realNum
            },
            {
              label: 'My LP token deposit:',
              amount: BigNum.fromBigNum(share).realNum
            },
            {
              label: 'My unclaimed CLV:',
              amount: BigNum.fromBigNum(clv).realNum
            }
          ])
        }
      }
    }
    
    loadMyDepositInfo()
  }, [selectedItem, userPoolItems, tokenTypes, myInfo.address])

  return (
    <BodyWrapper>
      <NavigationTabs active={'farm'} customStyle={'width: 100%;max-width: 460px;'}/>
      <TipWrapper>
        <StyledCircle><i className="fa fo-info"></i></StyledCircle>
        <InfoTextWrapper>
          <InfoText>{t('depositTip')}</InfoText>
          <InfoTextBold>{t('rewardsEndIn')}{time}</InfoTextBold>
        </InfoTextWrapper>
      </TipWrapper>
      {
        _.isEmpty(selectedItem) && !_.isEmpty(stakePoolItems) &&
        <ListWrapper>
          {
            stakePoolItems && stakePoolItems.length > 1 ?
            <List>
            {
              _.map(stakePoolItems, (d: StakePoolItem, i) => {
              return (
              <ItemWrapper key={i}>
                <PairIconTitleWrapper>
                  <PairIconTitle left={d.fromTokenType.logo ?? ''} right={d.toTokenType.logo ?? ''} title={`${d.fromTokenType.name}-${d.toTokenType.name}`} size={'40px'} fontSize={'32px'}></PairIconTitle>
                </PairIconTitleWrapper>
                <PairTransContentWrapper>
                  <PairTransContent contents={getTotalAmountShowData(d)}></PairTransContent>
                </PairTransContentWrapper>
                <ButtonWrapper>
                  <PrimitiveButton onClick={() => handleClick(d)} disabled={disabled}>{t('deposit')}</PrimitiveButton>
                </ButtonWrapper>
              </ItemWrapper>)
              })
            }
            </List> 
            :
            <SingleWrapper>
              {
                _.map(stakePoolItems, (d: StakePoolItem, i) => {
                  return (
                  <ItemWrapper key={i}>
                    <PairIconTitleWrapper>
                      <PairIconTitle left={d.fromTokenType.logo ?? ''} right={d.toTokenType.logo ?? ''} title={`${d.fromTokenType.name}-${d.toTokenType.name}`} size={'40px'} fontSize={'32px'}></PairIconTitle>
                    </PairIconTitleWrapper>
                    <PairTransContentWrapper>
                      <PairTransContent contents={getTotalAmountShowData(d)}></PairTransContent>
                    </PairTransContentWrapper>
                    <ButtonWrapper>
                      <PrimitiveButton onClick={() => handleClick(d)} disabled={disabled}>{t('deposit')}</PrimitiveButton>
                    </ButtonWrapper>
                  </ItemWrapper>)
                  })
              }
            </SingleWrapper>
          }
          
        </ListWrapper>
      }
      {
        selectedItem &&
        <FarmPlantWrapper>
          <PlantItemWrapper>
            <PlantPairIconTitleWrapper>
              <PairIconTitle left={selectedItem.fromTokenType.logo ?? ''} right={selectedItem.toTokenType.logo ?? ''} title={fromToken?.name ? `${fromToken?.name}-${toToken?.name}` : ''} size={'40px'} fontSize={'32px'}></PairIconTitle>
              <AddLiquidityButton onClick={addLiquidityClick}>{t('addLiquidity')}</AddLiquidityButton>
            </PlantPairIconTitleWrapper>
            <PairTransContentWrapper>
              <PairTransContent contents={getTotalAmountShowData(selectedItem)}></PairTransContent>
            </PairTransContentWrapper>
          </PlantItemWrapper>

          <PoolInfoWrapper>
            <PoolInfo>
              <RowBetweenWrapper>
                <RowLeft>
                  <LabelTextXS>My pool share:</LabelTextXS>
                  {/* <InfoLabelTextS className='fo-info'></InfoLabelTextS> */}
                </RowLeft>
                <RowRight>
                  <StrongValueTextXS>{_.isEmpty(showData) ? '0' : showData[0].amount}</StrongValueTextXS>
                  <ValueTextXS>{' %'}</ValueTextXS>
                </RowRight>
              </RowBetweenWrapper>
              <RowBetweenWrapper>
                <RowLeft>
                  <LabelTextXS>My LP token avilable:</LabelTextXS>
                </RowLeft>
                <RowRight>
                  <StrongValueTextXS>{_.isEmpty(showData) ? '0' : showData[1].amount}</StrongValueTextXS>
                  <ValueTextXS>{fromToken?.name ? ` ${fromToken?.name}-${toToken?.name}` : ' '}</ValueTextXS>
                </RowRight>
              </RowBetweenWrapper>
              <RowBetweenWrapper>
                <RowLeft>
                  <LabelTextXS>My LP token deposit:</LabelTextXS>
                </RowLeft>
                <RowRight>
                  <StrongValueTextXS>{_.isEmpty(showData) ? '0' : showData[2].amount}</StrongValueTextXS>
                  <ValueTextXS>{fromToken?.name ? ` ${fromToken?.name}-${toToken?.name}` : ' '}</ValueTextXS>
                </RowRight>
              </RowBetweenWrapper>
              <LastRow>
                <RowLeft>
                  <LabelTextXS>My unclaimed CLV:</LabelTextXS>
                </RowLeft>
                <LastRowRight>
                  <div style={{marginTop:'-2px'}}><StrongValueTextL>{toFixedWithTrim(_.isEmpty(showData) ? '0' : showData[3].amount, 6)}</StrongValueTextL></div>
                  <div style={{marginLeft: '5px'}}><ValueTextXS>{'CLV'}</ValueTextXS></div>
                  {/* <Lineheight16><LabelTextXS>(~ 0.2 CLV/week )</LabelTextXS></Lineheight16> */}
                </LastRowRight>
              </LastRow>
            </PoolInfo>
            <ButtonGroup>
              <LittleButton onClick={depositClick} disabled={depositDisabled}>{t('deposit')}</LittleButton>
              <LittleButton onClick={withdrawAndClaimClick} disabled={withdrawDisabled}>{t('withdrawAndClaim')}</LittleButton>
              <LittleButton onClick={claimClick} disabled={claimDisabled}>{t('claim')}</LittleButton>
            </ButtonGroup>
          </PoolInfoWrapper>
        </FarmPlantWrapper>
      }

      <AddLiquidModal isOpen={addLiquidModalOpen} 
        fromTokenType={fromToken}
        toTokenType={toToken}
        onClose={onAddLiquidModalClose}></AddLiquidModal>
      <LiquidAddConfirmModal 
        isOpen={liquidAddConfirmModalOpen}  
        fromToken={dataFromAddLiquid.fromToken}
        toToken={dataFromAddLiquid.toToken}
        fromAmount={dataFromAddLiquid.fromAmount}
        toAmount={dataFromAddLiquid.toAmount}
        onClose={onLiquidAddConfirmModalClose}></LiquidAddConfirmModal>
      <DepositModal isOpen={depositModalOpen} 
        fromTokenType={fromToken}
        toTokenType={toToken}
        balanceAmount={_.isEmpty(showData) ? '0' : showData[1].amount}
        onClose={onDepositModalClose}></DepositModal>
      <WithdrawAndClaimModal isOpen={withdrawAndClaimModalOpen}
        fromTokenType={fromToken}
        toTokenType={toToken}
        balanceAmount={_.isEmpty(showData) ? '0' : showData[2].amount}
        unClaimedAmount={_.isEmpty(showData) ? '0' : showData[3].amount}
        onClose={onWithdrawAndClaimModalClose}></WithdrawAndClaimModal>
      <ClaimModal 
        isOpen={claimModalOpen}
        fromTokenType={fromToken}
        toTokenType={toToken}
        balanceAmount={_.isEmpty(showData) ? '0' : showData[3].amount} 
        onClose={onClaimModalClose}></ClaimModal>
      <TransferStateModal isOpen={transferStateModalOpen} onClose={() => setTransferStateModalOpen(false)}></TransferStateModal>
      
    </BodyWrapper>
  )
}
