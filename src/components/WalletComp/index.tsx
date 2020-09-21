import React, { Component, useEffect, useState } from 'react'
import _ from 'lodash'
import WalletSelectDialog from './walletSelectDialog'
import AssetDialog from './assetDialog'
import { ToastContainer, toast, Slide } from 'react-toastify';
import {getAddress, createAccountInfo, createEmptyAccountInfo} from './utils'
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import { useTranslation } from 'react-i18next'
import { getTokenTypes } from '../../utils/httpServices';
import { TokenType } from '../../state/token/types'
import { useTokenTypes, useTokenTypesUpdate } from '../../state/token/hooks'
import { loadAccount, supportedWalletTypes, loadAllTokenAmount } from '../../utils/AccountUtils'
import { api } from '../../utils/apiUtils'

import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { useApiInited } from '../../state/api/hooks';

export default function WalletComp() {
  const [open, setOpen] = useState(false);

  const [assetOpen, setAssetOpen] = useState(false)

  const [selectedWallet, setSelectedWallet] = useState({});

  const myInfo = useAccountInfo()
  const updateAccountInfo = useAccountInfoUpdate()

  const myTokenTypes = useTokenTypes()
  const updateTokenTypeList = useTokenTypesUpdate()

  const apiInited = useApiInited()

  const { t } = useTranslation()

  useEffect(() => {
    updateAccountInfo(createEmptyAccountInfo())
  }, []);

  useEffect(() => {
    if (_.isEmpty(myInfo.walletName)) {
      return
    }

    const wallet = _.find(supportedWalletTypes, (w) => w.name === myInfo.walletName)
    if (_.isEmpty(wallet)) {
      return
    }

    setSelectedWallet(wallet ?? {id: -1, showName: '', icon: ''})
  }, [myInfo])
  
  // useEffect(() => {
  //   if (!apiInited || _.isEmpty(myInfo.address)) {
  //     return
  //   }

  //   const subscribeBalance = async (addr: string, callback: (params: any) => void) => {
  //     return await api.getBalanceSubscribe(addr, callback)
  //   }

  //   const unsubscribe = subscribeBalance(myInfo.address, (params: any) => {
  //     console.log(`p:${params}`)
  //   })

  //   return () => {
  //     unsubscribe.then((f) => {
  //       f()
  //     });
  //   }
  // }, [myInfo, myTokenTypes, apiInited])
  useEffect(() => {
    const listenToBalance = async () => {
      if (_.isEmpty(myInfo.address)) {
        return
      }

      const tokenAmounts = await loadAllTokenAmount(myInfo.address, myTokenTypes)
      // const tokenAmounts = await api.getBalance(myInfo.address)

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
    async function getAcount() {
      const msg = await loadAccount(value, myTokenTypes, updateAccountInfo);
      if (msg !== 'ok') {
        toast(t(msg))
      }
    }

    getAcount()
  };

  const handleAssetOpen = () => {
    setAssetOpen(true)
  }

  const handleAssetClose = () => {
    setAssetOpen(false)
  }

    return (
      <div>
        {
          myInfo.address === '' ? <button className="btn-custom" onClick={handleClickOpen}>
          {t('connectToWallet')}</button> : <div className="addr-container" onClick={handleAssetOpen}>
              <span>{getAddress(myInfo.address)}</span>
              <img src={_.get(selectedWallet, 'icon', supportedWalletTypes[0].icon)}></img>
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
          accountTypes={supportedWalletTypes} 
          open={open} 
          onClose={handleClose}></WalletSelectDialog>
      </div>
    );

}
