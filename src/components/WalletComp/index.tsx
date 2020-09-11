import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import Dialog from '@material-ui/core/Dialog';
import './index.css'
import _ from 'lodash'
import WalletSelectDialog from './walletSelectDialog'
import AssetDialog from './assetDialog'
import MathIcon from '../../assets/images/icon-math.svg'
import LunieIcon from '../../assets/images/icon-lunie.svg'
import ImTokenIcon from '../../assets/images/icon-imtoken.svg'
import BxbIcon from '../../assets/images/icon-bxb.svg';
import BethIcon from '../../assets/images/icon-beth.svg';
import BusdIcon from '../../assets/images/icon-busd.svg';
import BdotIcon from '../../assets/images/icon-dot.svg';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import 'react-toastify/dist/ReactToastify.css';
import {getAddress} from './utils'
import {getApi} from './pApi'
import { useBalance, useBalanceUpdate, useAddressUpdate, useAddress } from '../../state/application/hooks';
import { useTranslation } from 'react-i18next'

const accountTypes = [
  {
    name: 'Math Wallet',
    showName: 'Math',
    icon: MathIcon
  }, {
    name: 'ImToken Wallet',
    showName: 'ImToken',
    icon: ImTokenIcon
  }, {
    name: 'Lunie Wallet',
    showName: 'Lunie',
    icon: LunieIcon
  }];
const tokenTypes = [
  {
    name: 'BXB',
    icon: BxbIcon
  }, {
    name: 'BUSD',
    icon: BusdIcon
  }, {
    name: 'DOT',
    icon: BdotIcon
  }, {
    name: 'BETH',
    icon: BethIcon
  }
];

export default function WalletComp() {
  const [open, setOpen] = useState(false);

  const [assetOpen, setAssetOpen] = useState(false)

  const [selectedWallet, setSelectedWallet] = useState({});

  const [accountAddress, setAccountAddress] = useState('');
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [selectedAccount, setSelectedAccount] = useState<any>({})

  const myBalance = useBalance()
  const myAddress = useAddress()
  const updateBalance = useBalanceUpdate()
  const updateAddress = useAddressUpdate()

  const { t } = useTranslation()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: any) => {
    setOpen(false);
    if (_.isEmpty(value)) {
      return
    }
    setSelectedWallet(value);
    loadAccount();
  };

  const handleAssetOpen = () => {
    setAssetOpen(true)
  }

  const handleAssetClose = () => {
    setAssetOpen(false)
  }
  
  async function loadAccount() {
    const injected = await web3Enable('bxb');

    if (!injected.length) {
      toast(t("notFoundWallet"));
      return;
    }

    const mathWallet = _.find(injected, (w: any) => w.isMathWallet === true)
    if (_.isEmpty(mathWallet)) {
      toast(t("notFoundWallet"));
      return;
    }

    const allAccounts = await web3Accounts();

    if (!allAccounts.length) {
      toast(t("addWallet"));
      return;
    }

    setAccounts(allAccounts)
    setSelectedAccount(allAccounts[0])
    setAccountAddress(getAddress(allAccounts[0].address))

    let api = await getApi()
    const { nonce, data: balance } = await api.getAccount(allAccounts[0].address)
    updateBalance({
      bxb: `${balance.free}`,
      busd: '200000000000',
      beth: '3200000000000',
      dot: '200000000000'
    })
    updateAddress(allAccounts[0].address)
  }

    return (
      <div>
        {
          accountAddress === '' ? <button className="btn-custom" onClick={handleClickOpen}>
          {t('connectToWallet')}</button> : <div className="addr-container" onClick={handleAssetOpen}>
              <span>{accountAddress}</span>
              <img src={_.get(selectedWallet, 'icon', accountTypes[0].icon)}></img>
            </div>
        }
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          transition={Slide}
          React-toastify
          hideProgressBar={true}/>
        <AssetDialog 
          account={selectedAccount} 
          assets={[]}
          wallet={selectedWallet}
          transactions={[]}
          onClose={handleAssetClose}
          open={assetOpen}></AssetDialog>
        <WalletSelectDialog 
          accountTypes={accountTypes} 
          open={open} 
          onClose={handleClose}></WalletSelectDialog>
      </div>
    );

}
