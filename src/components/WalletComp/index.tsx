import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import styled from 'styled-components';
import AssetDialog from './assetDialog'
import {getAddress, createAccountInfo, createEmptyAccountInfo} from './utils'
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import { useTokenTypes } from '../../state/token/hooks'
import { supportedWalletTypes, loadAllTokenAmount } from '../../utils/AccountUtils'
import WalletConnectComp from './walletConnectComp'
import { WalletType } from '../../utils/AccountUtils'
import Row from '../Row'

import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { useApiInited, useApiConnected } from '../../state/api/hooks';

const ConnectButtonWrapper = styled.div`
  margin-right: 8px;
`

const AccountInfoWrapper = styled(Row)`
  font-size: 14px;
  color: #FF8212;
  font-family: PingFangSC-Regular, PingFang SC;
  cursor: pointer;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;

  &:hover {
    background: #FCF0DC;
  }
`

const AddressText = styled.div`
  
`

const WalletIcon = styled.img`
  width: 20px;
  margin-left: 4px;
`

const WarningWrapper = styled(Row)`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FA5050;
  align-items: center;
  border-radius: 4px;
  background: #FDEDED;
  padding: 6px 4px 5px 4px;
`

const WarningIcon = styled.div`
  height: 20px;
  font-size: 20px;
  line-height: 20px;
  margin-right: 4px;
`

export default function WalletComp(): React.ReactElement {
  const [assetOpen, setAssetOpen] = useState(false)

  const inited = useApiInited()
  const apiConnected = useApiConnected()

  const [selectedWallet, setSelectedWallet] = useState<WalletType>();

  const myInfo = useAccountInfo()
  const updateAccountInfo = useAccountInfoUpdate()

  const myTokenTypes = useTokenTypes()

  const apiInited = useApiInited()

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

    setSelectedWallet(wallet ?? {name: '', showName: '', icon: ''})
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
      if (!apiInited || _.isEmpty(myInfo.address)) {
        return
      }

      const tokenAmounts = await loadAllTokenAmount(myInfo.address, myTokenTypes)
      // const tokenAmounts = await api.getBalance(myInfo.address)

      if (_.isEmpty(tokenAmounts)) {
        return
      }

      if (!_.isEqual(tokenAmounts, myInfo.tokenAmounts)) {
        updateAccountInfo(createAccountInfo(myInfo.address, myInfo.name, myInfo.walletName, tokenAmounts ?? []))
      }
    }

    const unsub = setInterval(listenToBalance, 3000)

    return () => {
      clearInterval(unsub)
    }
  }, [apiInited, myInfo, myTokenTypes])

  const handleAssetOpen = () => {
    setAssetOpen(true)
  }

  const handleAssetClose = () => {
    setAssetOpen(false)
  }

  const onWalletSelectDialogClose = (value?: WalletType) => {
    setSelectedWallet(value);
  }

    return (
      <div>
        {
          (!inited || !apiConnected)? <WarningWrapper><WarningIcon><i className={'fa fo-alert-octagon'}></i></WarningIcon>Wrong Network</WarningWrapper> :
          myInfo.address === '' ? 
            <ConnectButtonWrapper>
              <WalletConnectComp btnStyle='top' onWalletClose={onWalletSelectDialogClose}></WalletConnectComp> 
            </ConnectButtonWrapper>
          : <AccountInfoWrapper onClick={handleAssetOpen}>
              <AddressText>{getAddress(myInfo.address)}</AddressText>
              <WalletIcon src={selectedWallet?.icon ?? ''}></WalletIcon>
            </AccountInfoWrapper>
        }
        <AssetDialog 
          account={myInfo}
          wallet={selectedWallet}
          onClose={handleAssetClose}
          open={assetOpen}></AssetDialog>
      </div>
    );

}
