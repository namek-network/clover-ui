import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import styled from 'styled-components';
import AssetDialog from './assetDialog'
import {getAddress, createEmptyAccountInfo} from './utils'
import { useAccountInfo, useAccountInfoUpdate } from '../../state/wallet/hooks';
import { supportedWalletTypes } from '../../utils/AccountUtils'
import WalletConnectComp from './walletConnectComp'
import { WalletType } from '../../utils/AccountUtils'
import Row from '../Row'

import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { useApiInited, useApiConnected } from '../../state/api/hooks';
import InfoModal from './InfoModal';
import { useWrongNetwork } from '../../state/wallet/hooks';

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
  cursor: pointer;
`

const WarningIcon = styled.div`
  height: 20px;
  font-size: 20px;
  line-height: 20px;
  margin-right: 4px;
`

const WarningInfoComp = (): React.ReactElement => {
  const [open, setOpen] = useState(false)

  const onClose = () => {
    setOpen(false)
  }

  const onClick = () => {
    setOpen(true)
  }
  return (
    <div>
      <WarningWrapper onClick={onClick}>
        <WarningIcon><i className={'fa fo-alert-octagon'}></i>
        </WarningIcon>Wrong Network
      </WarningWrapper>
      <InfoModal isOpen={open} onClose={onClose} title={'Wrong Network'} info={'Please connect to Clover network'}></InfoModal>
    </div>
    )
}

export default function WalletComp(): React.ReactElement {
  const [assetOpen, setAssetOpen] = useState(false)

  const inited = useApiInited()
  const apiConnected = useApiConnected()

  const [selectedWallet, setSelectedWallet] = useState<WalletType>();

  const myInfo = useAccountInfo()
  const updateAccountInfo = useAccountInfoUpdate()

  const wrongNetwork = useWrongNetwork()

  useEffect(() => {
    updateAccountInfo(createEmptyAccountInfo())
  }, [updateAccountInfo]);

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
          ((inited && !apiConnected) || wrongNetwork)? <WarningInfoComp></WarningInfoComp> :
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
