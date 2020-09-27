import React from 'react';
import {getAddress} from './utils'
import _ from 'lodash'
import { TokenAmount, AccountInfo } from '../../state/wallet/types'
import { convertToShow } from '../../utils/balanceUtils'
import Modal from '../../components/Modal'
import Column from '../../components/Column'

import './index.css'
import { WalletType } from '../../utils/AccountUtils';

interface AssetDialogPropTypes {
  account: AccountInfo,
  wallet?: WalletType,
  onClose: () => void,
  open: boolean
}

export default function AssetDialog({ account, wallet, onClose, open }: AssetDialogPropTypes): React.ReactElement {
  const { tokenAmounts } = account

  const handleClose = () => {
    onClose();
  };

  const customStyle = 'border-radius: 16px; max-width: 530px; width: 528px;'
  return (
    <Modal isOpen={open} onDismiss={handleClose} maxHeight={90} customStyle={customStyle}>
      <Column>
        <div className="content-width asset-content-width">
          <div>My account</div>
          <div className="wallet-dia-close-btn" onClick={() => handleClose()}><i className="fa fo-x"></i></div>
        </div>
        <div className="asset-account-container">
          <div className="asset-change-container">
            <div className="asset-change-left">Conneted with {wallet?.showName}</div>
            <div className="asset-change-btn">Change</div>
          </div>
          <div className="asset-addr-container">
            <img src={_.get(wallet, 'icon', '')}></img>
            <span>{getAddress(account.address)}</span>
          </div>
          <div className="asset-change-container asset-copy">
            <div className="asset-copy-margin">Copy Address</div>
            <div className="asset-copy-right">View on Subscan</div>
          </div>
        </div>
        <div className="asset-token-container">
          <div className="asset-token-title">My assets</div>
          <div className="asset-token-list">
            {
              tokenAmounts.map((tokenAmount: TokenAmount, index: number) => (
                <div className='asset-token-amount-item' key={index}>
                  <div className="row-container">
                    <img src={tokenAmount.tokenType.logo}></img>
                    <div className="margin-left-9">
                      <div className="asset-token-name">{tokenAmount.tokenType.name}</div>
                      <div className="asset-deposit-name">
                        <span>Deposit</span>
                        <span className="margin-left-15">Convert to ETH</span>
                      </div>
                    </div>
                  </div>
                  <div className="asset-amount-text">{convertToShow(tokenAmount.amount)}</div>
                </div>
              ))
              }
          </div>

          <div className="asset-token-title margin-top-20">Recent Transactions</div>
          <div className="asset-token-list asset-trans-text padding-16 margin-bottom-16 ">
            <div className='asset-trans-item'>
              <span>Swap 14 BxETH for 12.6743553 DOT</span>
            </div>
            <div className='asset-trans-item margin-top-10'>
              <span>Swap 14 BxETH for 12.6743553 DOT</span>
            </div>
            <div className='asset-trans-item margin-top-10'>
              <span>Swap 14 BxETH for 12.6743553 DOT</span>
            </div>
          </div>
        </div>
      </Column>
    </Modal>
  );
}
