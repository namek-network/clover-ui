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
import {getAddress} from './utils'
import {getApi} from './pApi'
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import { useTranslation } from 'react-i18next'
import { getTokenTypes, getTokenAmount } from '../../utils/httpServices';
import { TokenType } from '../../state/token/types'
import { useTokenTypes, useTokenTypesUpdate } from '../../state/token/hooks'
import { TypePredicateKind } from 'typescript';

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

  const [accountAddress, setAccountAddress] = useState('');
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [selectedAccount, setSelectedAccount] = useState<any>({})

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
    loadTokenTypes()
  }, []);

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
    console.log(myInfo)
    setAssetOpen(true)
  }

  const handleAssetClose = () => {
    setAssetOpen(false)
  }

  async function loadAllTokenAmount(addr: string) {
    const ret = await getTokenAmount(addr)
    
    const types =  _.map(ret.result, (arr) => {
      const t = _.find(myTokenTypes, (tokenType) => tokenType.name === arr[0])
      return {
        tokenType: t ?? {
          id: -1,
          name: ''
        },
        amount: arr[1]
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

    setAccounts(mathAccounts)
    setSelectedAccount(mathAccounts[0])
    setAccountAddress(getAddress(mathAccounts[0].address))

    // let api = await getApi()

    const tokenAmounts = await loadAllTokenAmount(mathAccounts[0].address)
    const info = {
      address: allAccounts[0].address,
      walletName: '' + _.get(wallet, 'name', ''),
      tokenAmounts
    }
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
