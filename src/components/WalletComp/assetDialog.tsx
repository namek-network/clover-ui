import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import {getAddress, tokenTypes} from './utils'
import _ from 'lodash'
import { TokenAmount } from '../../state/wallet/types'

import './index.css'

const accountTypes = ['Math Wallet', 'ImToken Wallet', 'Lunie Wallet'];

export default function AssetDialog(props: any) {
  const { account, assets, wallet, transactions, onClose, open } = props;

  const assetListTemp = _.map(tokenTypes, (tt: any) => {return {...tt, amount: '1.132'}})

  const { tokenAmounts } = account

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} classes={{paper: "dialog-custom"}}>
      <div className="content-width asset-content-width">
        <div>My account</div>
        <div className="wallet-dia-close-btn" onClick={() => handleClose()}>x</div>
      </div>
      <div className="asset-account-container">
        <div className="asset-change-container">
          <div className="asset-change-left">Conneted with {wallet.showName}</div>
          <div className="asset-change-btn">Change</div>
        </div>
        <div className="asset-addr-container">
          <img src={_.get(wallet, 'icon')}></img>
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
            tokenAmounts.map((tokenAmount: TokenAmount, key: any) => (
              <div className='asset-token-amount-item' key={key}>
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
                <div className="asset-amount-text">{tokenAmount.amount}</div>
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
    </Dialog>
  );
}

AssetDialog.propTypes = {
  account: PropTypes.object.isRequired,
  assets: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  transactions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
