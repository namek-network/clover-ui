import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { X } from 'react-feather'
import { toast } from 'react-toastify';
import { BigNumber as BN } from "bignumber.js";
import { TokenType } from '../../state/token/types'
import { useAccountInfo } from '../../state/wallet/hooks';
import { useSwapTransStateUpdate } from '../../state/swap/hooks';
import Modal from '../../components/Modal'
import Column, { AutoColumn } from '../../components/Column'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { ButtonBigCommon } from '../../components/Button';
import CurrencyLogo from '../../components/CurrencyLogo'
import sysConfig from '../../configs/sysConfig';
import swapUtils from '../../utils/swapUtils';
import BigNum from '../../types/bigNum';


const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
  color: #CCCCCC;
`

const ContentWrapper = styled(AutoColumn)`
  margin: 10px; 15px;
`;

const FromToText = styled(Text)`
  height: 16px;
  font-size: 18px;
  font-family: Helvetica;
  color: #111A34;
  line-height: 16px;
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '15px')};
`

const TokenAmountText = styled(Text)`
  height: 50px;
  font-size: 40px;
  font-family: Roboto-Medium, Roboto;
  font-weight: 500;
  color: #111A34;
  line-height: 50px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
`;

const HintText = styled(Text)`
  height: 48px;
  font-size: 16px;
  font-family: Helvetica-Light, Helvetica;
  font-weight: 300;
  color: #666F83;
  line-height: 24px;
`;

const TransactionInfoPanel = styled(AutoColumn)`
  background: #F9FAFB;
  border-radius: 8px;
`;

const TransactionInfoLabel = styled.span`
  font-size: 14px;
  font-family: Helvetica;
  color: #858B9C;
  margin-right: 5px;
`;

const TransactionInfo = styled.span`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #41485D;
`;

interface SwapConfirmhModalProps {
  isOpen: boolean
  onDismiss: () => void
  onConfirmSwap: () => void
  fromToken: TokenType
  fromTokenAmount: string
  toToken: TokenType
  toTokenAmount: string,
  price: BN | null,
  minReceived: BN | null,
  priceImpact: BN | null,
  liquidityProviderFee: BN | null,
  swapRoutes: number[]
}

export default function SwapConfirmModal({
  isOpen,
  onDismiss,
  onConfirmSwap,
  fromToken,
  fromTokenAmount,
  toToken,
  toTokenAmount,
  price,
  minReceived,
  priceImpact,
  liquidityProviderFee,
  swapRoutes
}: SwapConfirmhModalProps): React.ReactElement {

  const accountInfo = useAccountInfo();

  const transStateUpdate = useSwapTransStateUpdate();

  const handleConfirmSwap = () => {
    onConfirmSwap();

    const onError = (msg: string) => {
      toast(msg)
    }

    const amountText = `Swapping ${fromTokenAmount} ${fromToken.name} to ${toTokenAmount} ${toToken.name}`
    const onStart = () => {
      transStateUpdate({stateText: 'Waiting for Confrimation', amountText, status: 'start'})
    }

    const onEnd = (state: string) => {
      let stateText = ''
      let status = ''
      if (state === 'complete') {
        stateText = 'Transaction Submitted'
        status = 'end'
      } else if (state === 'rejected') {
        stateText = 'Transaction Rejected'
        status = 'rejected'
      } else {
        stateText = 'Transaction Failed'
        status = 'error'
      }
      transStateUpdate({stateText: stateText, amountText, status: status})
    }

    swapUtils.swapCurrency(
      accountInfo,
      fromToken.id, BigNum.fromRealNum(fromTokenAmount), toToken.id, minReceived == null ? BigNum.Zero : BigNum.fromRealNum(minReceived.toString()),
      swapRoutes,
      onError, onStart, onEnd);
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={50}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap='14px'>

          <RowBetween>
            <Text fontWeight={500} fontSize={16} color='#777777'>
              Confirm Swap
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>

          <ContentWrapper gap='14px'>
            <AutoColumn gap='5px'>
              <FromToText>From</FromToText>
              <AutoRow justify='start'>
                <RowFixed style={{minWidth: '120px'}}>
                  <CurrencyLogo currency={fromToken} size={'24px'} />
                  <StyledTokenName className="token-symbol-container" active={true}>
                    {fromToken?.name}
                  </StyledTokenName>
                </RowFixed>
                <TokenAmountText>{fromTokenAmount}</TokenAmountText>
              </AutoRow>
            </AutoColumn>

            <AutoColumn gap='5px'>
              <FromToText>To</FromToText>
              <AutoRow justify='start'>
                <RowFixed style={{minWidth: '120px'}}>
                  <CurrencyLogo currency={toToken} size={'24px'} />
                  <StyledTokenName className="token-symbol-container" active={true}>
                    {toToken?.name}
                  </StyledTokenName>
                </RowFixed>
                <TokenAmountText>{toTokenAmount}</TokenAmountText>
              </AutoRow>
            </AutoColumn>

            <AutoRow justify='space-between'></AutoRow>

            <HintText>Output is estimated. If the price changes by more than 0.5%. your transaction will revert.</HintText>

            <TransactionInfoPanel gap='6px'>
              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Price</TransactionInfoLabel>
                <TransactionInfo>{price == null ? '' : `${price.toFixed(sysConfig.decimalPlacesInfo)} ${toToken?.name}/${fromToken?.name}`}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Minimum received</TransactionInfoLabel>
                <TransactionInfo>{minReceived == null ? '' : `${minReceived.toFixed(sysConfig.decimalPlacesInfo)} ${toToken?.name}`}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Price Impact</TransactionInfoLabel>
                <TransactionInfo>{priceImpact == null ? '' : `${priceImpact.times(100).toFixed(sysConfig.decimalPlacesInfo)}%`}</TransactionInfo>
              </AutoRow>

              <AutoRow justify='space-between'>
                <TransactionInfoLabel>Liquidity Provder Fee</TransactionInfoLabel>
                <TransactionInfo>{liquidityProviderFee == null ? '' : liquidityProviderFee.toFixed(sysConfig.decimalPlacesInfo)} {fromToken?.name}</TransactionInfo>
              </AutoRow>

            </TransactionInfoPanel>
          </ContentWrapper>

          <ButtonBigCommon onClick={handleConfirmSwap}>Confirm Swap</ButtonBigCommon>

        </PaddedColumn>
      </Column>
    </Modal>
  )
}
