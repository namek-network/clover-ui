import React, { useCallback, useState } from 'react';
import './index.css'
import { useTranslation } from 'react-i18next'
import { BottomButton, TopConnectButton } from '../Button'
import styled from 'styled-components';
import { supportedWalletTypes, loadAccount } from '../../utils/AccountUtils'
import WalletSelectDialog from './walletSelectDialog'
import _ from 'lodash'
import { toast } from 'react-toastify';
import { useAccountInfoUpdate } from '../../state/wallet/hooks'
import { useTokenTypes } from '../../state/token/hooks';
import { useApiInited } from '../../state/api/hooks'
import { WalletType } from '../../utils/AccountUtils'

export const Wrapper = styled.div`
  width: 100%;
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
        toast('Api is not ready, please try later!')
        return 
      }
      const msg = await loadAccount(value, myTokenTypes, updateAccountInfo);
      if (msg !== 'ok') {
        toast(t(msg))
      }
    }

    getAcount()
    onWalletClose && onWalletClose(value)
  }, [apiInited, myTokenTypes]);

  return (
    <Wrapper>
      {
        btnStyle === 'bottom' && <BottomButton onClick={handleClick} >{t('connectToWallet')}</BottomButton>
      } 
      {
        btnStyle === 'top' && <TopConnectButton onClick={handleClick} >{t('connectToWallet')}</TopConnectButton>
      }
      
      <WalletSelectDialog 
            walletTypes={supportedWalletTypes} 
            open={isOpen} 
            onClose={handleWalletClose}></WalletSelectDialog> 
    </Wrapper>
  )
  
}
