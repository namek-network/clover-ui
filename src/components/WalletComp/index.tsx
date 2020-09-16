import React, { Component, useEffect, useState } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

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
import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import 'react-toastify/dist/ReactToastify.css';
import {getAddress, createAccountInfo, createEmptyAccountInfo} from './utils'
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import { useTranslation } from 'react-i18next'
import { getTokenTypes, getTokenAmount } from '../../utils/httpServices';
import { TokenType } from '../../state/token/types'
import { useTokenTypes, useTokenTypesUpdate } from '../../state/token/hooks'

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
const tokenTypes = {
    BXB: BxbIcon,
    BUSD: BusdIcon,
    DOT: BdotIcon,
    BETH: BethIcon
  };


export default function WalletComp() {
  const [open, setOpen] = useState(false);

  const [assetOpen, setAssetOpen] = useState(false)

  const [selectedWallet, setSelectedWallet] = useState({});

  const myInfo = useAccountInfo()
  const updateAccountInfo = useAccountInfoUpdate()

  const myTokenTypes = useTokenTypes()
  const updateTokenTypeList = useTokenTypesUpdate()

  const { t } = useTranslation()

  async function loadTokenTypes() {
    const ret = await getTokenTypes()

    if (_.isEmpty(ret)) {
      return
    }

    ret.result = ret.result || []
    const tokenTypeList = _.map(ret.result, (tokenType: TokenType) => {
      tokenType.logo = _.get(tokenTypes, tokenType.name, '')
      return tokenType
    })

    updateTokenTypeList(tokenTypeList)
  }

  useEffect(() => {
    updateAccountInfo(createEmptyAccountInfo())
    loadTokenTypes()
  }, []);

  
  useEffect(() => {
    const listenToBalance = async () => {
      if (_.isEmpty(myInfo.address)) {
        return
      }

      const tokenAmounts = await loadAllTokenAmount(myInfo.address)

      if (_.isEmpty(tokenAmounts)) {
        return
      }

      if (!_.isEqual(tokenAmounts, myInfo.tokenAmounts)) {
        const info = {
          address: myInfo.address,
          walletName: myInfo.walletName,
          tokenAmounts: tokenAmounts ?? []
        }
        updateAccountInfo(createAccountInfo(myInfo.address, myInfo.name, myInfo.walletName, tokenAmounts ?? []))
      }
    }

    const unsub = setInterval(listenToBalance, 3000)

    return () => {
      clearInterval(unsub)
    }
  }, [myInfo, myTokenTypes])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: any) => {
    setOpen(false);
    if (_.isEmpty(value)) {
      return
    }
    setSelectedWallet(value);
    loadAccount(value);
  };

  const handleAssetOpen = () => {
    setAssetOpen(true)
  }

  const handleAssetClose = () => {
    setAssetOpen(false)
  }

  async function loadAllTokenAmount(addr: string) {
    const ret = await getTokenAmount(addr).catch(e => null)

    if (_.isEmpty(ret)) {
      return null
    }
    
    const types =  _.map(ret.result, (arr) => {
      const [type, amount] = arr
      return {
        tokenType: _.find(myTokenTypes, (tokenType) => tokenType.name === type) ?? {
          id: -1,
          name: ''
        },
        amount
      }
    })

    return _.filter(types, (t) => t.tokenType.id >= 0)
  }
  
  async function loadAccount(wallet: any) {
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

    const mathAccounts: any = await findMathAccount(allAccounts)
    if (_.isEmpty(mathAccounts)) {
      toast(t("addWallet"));
      return;
    }

    const tokenAmounts = await loadAllTokenAmount(mathAccounts[0].address)
    if (tokenAmounts === null) {
      return
    }

    const info = createAccountInfo(mathAccounts[0].address, 
      mathAccounts[0].meta?.name ?? '', 
      '' + _.get(wallet, 'name', ''), 
      tokenAmounts ?? [])
      
    updateAccountInfo(info)
  }

  async function findMathAccount(allAccounts: InjectedAccountWithMeta[]) {
    return Promise.all(_.map(allAccounts, async (acc) => {
      return await web3FromAddress(acc.address)
    })).then((wallets: InjectedExtension[]) => {
      return _.filter(_.zipWith(allAccounts, wallets, (a: InjectedAccountWithMeta, w: any) => {
        if (w && w.isMathWallet) {
          return a
        } else {
          return {}
        }
      }), (x) => !_.isEmpty(x))
    })
  }

    return (
      <div>
        {
          myInfo.address === '' ? <button className="btn-custom" onClick={handleClickOpen}>
          {t('connectToWallet')}</button> : <div className="addr-container" onClick={handleAssetOpen}>
              <span>{getAddress(myInfo.address)}</span>
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
          account={myInfo} 
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
