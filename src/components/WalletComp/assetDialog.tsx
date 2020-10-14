import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {getAddress} from './utils'
import styled from 'styled-components'
import _ from 'lodash'
import { TokenAmount, AccountInfo } from '../../state/wallet/types'
import Modal from '../../components/Modal'
import Column from '../../components/Column'
import BigNum from '../../types/bigNum'

import './index.css'
import { WalletType } from '../../utils/AccountUtils';
import { TokenType } from '../../state/token/types';
import {SerializableBigNum} from '../../types/bigNum';
import { useRecentTransaction } from '../../state/transaction/hooks';
import Row, { RowBetween } from '../Row'
import { transShowTextFromTransRecord } from '../../utils/transShowUtils'
import { useTokenTypes } from '../../state/token/hooks';
import {getBlockBrowserAddress} from '../../utils/httpServices'
import {getRecentTransaction} from '../../utils/blockUtils'
import { useRecentTransactionUpdate } from '../../state/transaction/hooks'
import { TransactionRecord } from '../../state/transaction/types'
import { useAccountInfo } from '../../state/wallet/hooks';


const BodyWrapper = styled(Column)`
  width: 100%;
  padding-bottom: 16px;
`

const ContentWrapper = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  margin-right: 24px;
  margin-top: 20px;
  min-height: 260px;
`

const AddressWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-itmes: center;
  font-size: 32px;
  font-family: Roboto-Medium, Roboto;
  font-weight: 500;
  color: #111A34;
  height: 32px;
  line-height: 32px;
`

const AddressImg = styled.img`
  width: 24px;
  margin-right: 6px;
`

const AddressText = styled.div`
`

const ChangeBtnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`

const ChangeBtn = styled.div<{left: string}>`
  position: absolute;
  left: ${({ left }) => (left ? left : '100px')};
  background: #FCF0DC;
  border-radius: 4px;
  color: #FF8212;
  font-size: 14px;
  cursor: pointer;
  height: 24px;
  line-height: 24px;
  width: 58px;
  text-align: center;
`
const RecentTransactionWrapper = styled.div`
  margin-top: 20px;
`

const TextGrey = styled.span`
  font-size: 16px;
  font-family: Helvetica-Light, Helvetica;
  font-weight: 300;
  color: #666F83;
`

 const TitleWrapper = styled.div``

 const RecentTransactionContentWrapper = styled(Column)`
  background: #F9FAFB;
  border-radius: 8px;
  margin-top: 8px;
  padding: 10px 16px;
 `

 const TransactionItem = styled(RowBetween)`
  align-items: center;
  padding: 6px 0;
 `

 const TransLeft = styled(Row)`
 `
 const ItemText = styled.div`
  font-size: 14px;
  font-family: Helvetica;
  color: #41485D;
  line-height: 14px;
 `

 const TransLink = styled.a`
  height: 15px;
  font-size: 15px;
  color: #C5CAD5;
  line-height: 15px;
  cursor: pointer;
  margin-left: 4px;

  &:hover {
    color: #C5CAD5;
    text-decoration: none;
  }
`
const ResultIcon = styled.div`
  height: 16px;
  font-size: 16px;
  color: #56CB8F;
  line-height: 16px;
`

interface AssetDialogPropTypes {
  account: AccountInfo,
  wallet?: WalletType,
  onClose: () => void,
  open: boolean
}

export default function AssetDialog({ account, wallet, onClose, open }: AssetDialogPropTypes): React.ReactElement {
  const { tokenAmounts } = account
  const [positionLeft, setPositionLeft] = useState('0')

  const recentTransactions = useRecentTransaction()
  const tokenTypes = useTokenTypes()
  const accountInfo = useAccountInfo();

  const updateRecentTransaction = useRecentTransactionUpdate()

  const handleClose = () => {
    onClose();
  };

  const addressRef = useCallback(node => {
    if (node !== null) {
      const leftPosition = 30 + node.getBoundingClientRect().width - 58
      setPositionLeft(leftPosition + 'px')
    }
  }, []);
  const showData = useMemo(() => {
    return _.map(tokenAmounts, (tokenAmount: TokenAmount) => {
      if (tokenAmount.tokenType.name === 'CLV' || tokenAmount.tokenType.name === 'DOT') {
        return {...tokenAmount, convertTo: ''}
      } else {
        return {
          ...tokenAmount, convertTo: tokenAmount.tokenType.name.substring(1)
        }
      }
    })
  }, [tokenAmounts])

  useEffect(() => {
    if (_.isEmpty(accountInfo.address) || !open) {
      return
    }

    const loadRecentTrasaction = async () => {
      const recentTransactions = await getRecentTransaction(accountInfo.address)
      const records: TransactionRecord[] = _.map(recentTransactions, ({ data, method, $blockHash }) => {
        return {
          method: method.toString(),
          data: _.map(data, (d) => d.toString()),
          $blockHash
        }
      })

      // console.log(`${JSON.stringify(records)}`)

      updateRecentTransaction(records)
    }

    loadRecentTrasaction()
  }, [accountInfo, updateRecentTransaction, open])

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr)
    // toast(t('copySuccess'))
  }

  const customStyle = 'border-radius: 16px; max-width: 530px; width: 528px;'
  return (
    <Modal isOpen={open} onDismiss={handleClose} maxHeight={90} customStyle={customStyle}>
      <BodyWrapper>
        <div className="content-width">
          <div>My account</div>
          <div className="wallet-dia-close-btn" onClick={() => handleClose()}><i className="fa fo-x"></i></div>
        </div>
        <div className="asset-account-container">
          <ChangeBtnWrapper>
            <div className="asset-change-left">Conneted with {wallet?.showName}</div>
            <ChangeBtn left={positionLeft}>Change</ChangeBtn>
          </ChangeBtnWrapper>
          <AddressWrapper>
            <AddressImg src={_.get(wallet, 'icon', '')}></AddressImg>
            <AddressText ref={addressRef}>{getAddress(account.address)}</AddressText>
          </AddressWrapper>
          <div className="asset-change-container asset-copy">
            <div className="asset-copy-margin" onClick={() => copyAddress(account.address)}>Copy Address</div>
            <div className="asset-copy-right">View on Subscan</div>
          </div>
        </div>
        <ContentWrapper>
          <div className="asset-token-title">My assets</div>
          <div className="asset-token-list">
            {
              showData.map((tokenAmount: {tokenType: TokenType, amount: string, amountBN: SerializableBigNum, convertTo: string}, index: number) => (
                <div className='asset-token-amount-item' key={index}>
                  <div className="row-container">
                    <img alt={''} src={tokenAmount.tokenType.logo}></img>
                    <div className="margin-left-9">
                      <div className="asset-token-name">{tokenAmount.tokenType.name}</div>
                      <div className="asset-deposit-name">
                        <span>Deposit</span> 
                        {
                          !_.isEmpty(tokenAmount.convertTo) && <span className="margin-left-15">{`Convert to ${tokenAmount.convertTo}`}</span>

                        }
                      </div>
                    </div>
                  </div>
                  <div className="asset-amount-text">{BigNum.fromBigNum(tokenAmount.amount).realNum}</div>
                </div>
              ))
              }
          </div>

          {
            !_.isEmpty(recentTransactions) &&
            <RecentTransactionWrapper>
              <TitleWrapper>
                <TextGrey>Recent Transactions</TextGrey>
              </TitleWrapper>
              <RecentTransactionContentWrapper>
                {
                  _.map(recentTransactions, (trans, index) => {
                    return (
                    <TransactionItem key={index}>
                      <TransLeft>
                        <ItemText>
                          {transShowTextFromTransRecord(trans, tokenTypes)}
                        </ItemText>
                        <TransLink href={getBlockBrowserAddress(trans.$blockHash)} target="_blank"><i className={'fa fo-external-link'}></i></TransLink>
                      </TransLeft>
                      
                      <ResultIcon><i className={'fa fo-check-circle'}></i></ResultIcon>
                    </TransactionItem>)
                    
                  })
                }
              </RecentTransactionContentWrapper>
            </RecentTransactionWrapper>
          }
          
        </ContentWrapper>
      </BodyWrapper>
    </Modal>
  );
}
