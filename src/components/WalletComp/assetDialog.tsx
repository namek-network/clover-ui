import React, {useCallback, useState, useMemo} from 'react';
import {getAddress} from './utils'
import styled from 'styled-components'
import _ from 'lodash'
import { TokenAmount, AccountInfo } from '../../state/wallet/types'
import Modal from '../../components/Modal'
import Column from '../../components/Column'
import BigNum from '../../types/bigNum'
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'

import './index.css'
import { WalletType } from '../../utils/AccountUtils';
import { TokenType } from '../../state/token/types';
import {SerializableBigNum} from '../../types/bigNum';

const BodyWrapper = styled(Column)`
`

const ContentWrapper = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  margin-right: 24px;
  margin-top: 20px;
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

interface AssetDialogPropTypes {
  account: AccountInfo,
  wallet?: WalletType,
  onClose: () => void,
  open: boolean
}

export default function AssetDialog({ account, wallet, onClose, open }: AssetDialogPropTypes): React.ReactElement {
  const { tokenAmounts } = account
  const [positionLeft, setPositionLeft] = useState('0')

  const {t} = useTranslation()

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

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr)
    toast(t('copySuccess'))
  }

  const customStyle = 'border-radius: 16px; max-width: 530px; width: 528px;'
  return (
    <Modal isOpen={open} onDismiss={handleClose} maxHeight={90} customStyle={customStyle}>
      <BodyWrapper>
        <div className="content-width asset-content-width">
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

          <div className="asset-token-title margin-top-20">Recent Transactions</div>
          <div className="asset-token-list asset-trans-text padding-16 margin-bottom-16 ">
            <div className='asset-trans-item'>
              <span>Swap 14 CLV for 12.6743553 DOT</span>
            </div>
            <div className='asset-trans-item margin-top-10'>
              <span>Swap 14 CLV for 12.6743553 DOT</span>
            </div>
            <div className='asset-trans-item margin-top-10'>
              <span>Swap 14 CLV for 12.6743553 DOT</span>
            </div>
          </div>
        </ContentWrapper>
      </BodyWrapper>
    </Modal>
  );
}
