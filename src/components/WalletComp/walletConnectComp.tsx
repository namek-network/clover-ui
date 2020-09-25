import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import './index.css'
import { useTranslation } from 'react-i18next'
import { BottomButton } from '../Button'
import styled from 'styled-components';
import { supportedWalletTypes, loadAccount } from '../../utils/AccountUtils'
import WalletSelectDialog from './walletSelectDialog'
import _ from 'lodash'
import { toast } from 'react-toastify';
import { useAccountInfoUpdate } from '../../state/wallet/hooks'
import { useTokenTypes } from '../../state/token/hooks';
import { darken } from 'polished';
import { useApiInited } from '../../state/api/hooks'

export const Wrapper = styled.div`
  width: 100%
`


export default function WalletConnectComp(props: any) {
  const [isOpen, setOpen] = useState(false)

  const { t } = useTranslation()

  const updateAccountInfo = useAccountInfoUpdate()
  const myTokenTypes = useTokenTypes()

  const apiInited = useApiInited()

  const handleClick = () => {
    setOpen(true)
  }

  const handleWalletClose = useCallback((value: any) => {
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
  }, [apiInited, myTokenTypes]);

  return (
    <Wrapper>
      <BottomButton onClick={handleClick} >{t('connectToWallet')}</BottomButton>
      <WalletSelectDialog 
            accountTypes={supportedWalletTypes} 
            open={isOpen} 
            onClose={handleWalletClose}></WalletSelectDialog> 
    </Wrapper>
  )
  
}
