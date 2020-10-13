import React, { useCallback, useState } from 'react';
import './index.css'
import { useTranslation } from 'react-i18next'
import { PrimitiveButton, SecondaryLittleButton } from '../Button'
import styled from 'styled-components';
import { supportedWalletTypes, loadAccount } from '../../utils/AccountUtils'
import WalletSelectDialog from './walletSelectDialog'
import _ from 'lodash'
import { useAccountInfoUpdate } from '../../state/wallet/hooks'
import { useTokenTypes } from '../../state/token/hooks';
import { useApiInited, useApiConnected } from '../../state/api/hooks'
import { WalletType } from '../../utils/AccountUtils'

export const Wrapper = styled.div`
  width: 100%;
`

const LittleConnectButton = styled(SecondaryLittleButton)`
  padding: 6px 10px;
  line-height: 16px;

  &:disabled {
    color: #F99E3C;
    border: 1px solid #F99E3C;
    background-color: transparent;
  }
`

interface WalletConnectCompProps {
  btnStyle?: string,
  onButtonClick?: () => void,
  onWalletClose?: (value?: WalletType) => void
}
export default function WalletConnectComp({
  btnStyle = 'bottom',
  onButtonClick,
  onWalletClose
}: WalletConnectCompProps): React.ReactElement {
  const [isOpen, setOpen] = useState(false)

  const { t } = useTranslation()

  const updateAccountInfo = useAccountInfoUpdate()
  const myTokenTypes = useTokenTypes()

  const apiInited = useApiInited()
  const apiConnected = useApiConnected()

  const handleClick = () => {
    setOpen(true)
    onButtonClick && onButtonClick()
  }

  const handleWalletClose = useCallback((value?: WalletType) => {
    setOpen(false)
    if (_.isEmpty(value)) {
      return
    }

    async function getAcount() {
      if (!apiInited) {
        // toast('Api is not ready, please try later!')
        return 
      }
      const msg = await loadAccount(value, myTokenTypes, updateAccountInfo);
      if (msg !== 'ok') {
        // toast(t(msg))
      }
    }

    getAcount()
    onWalletClose && onWalletClose(value)
  }, [apiInited, myTokenTypes, onWalletClose, updateAccountInfo]);

  return (
    <Wrapper>
      {
        btnStyle === 'bottom' && <PrimitiveButton onClick={handleClick} disabled={!apiInited || !apiConnected}>{t('connectToWallet')}</PrimitiveButton>
      } 
      {
        btnStyle === 'top' && <LittleConnectButton onClick={handleClick} disabled={!apiInited}>{apiInited ? t('connectToWallet') : t('connecting')}</LittleConnectButton>
      }
      
      <WalletSelectDialog 
            walletTypes={supportedWalletTypes} 
            open={isOpen} 
            onClose={handleWalletClose}></WalletSelectDialog> 
    </Wrapper>
  )
  
}
