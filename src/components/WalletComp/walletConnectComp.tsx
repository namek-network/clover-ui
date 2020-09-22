import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.css'
import { useTranslation } from 'react-i18next'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import styled from 'styled-components';
import { supportedWalletTypes, loadAccount } from '../../utils/AccountUtils'
import WalletSelectDialog from './walletSelectDialog'
import _ from 'lodash'
import { toast } from 'react-toastify';
import { useAccountInfoUpdate } from '../../state/wallet/hooks'
import { useTokenTypes } from '../../state/token/hooks';
import { darken } from 'polished';

export const StyledButton = styled(RebassButton)`
  color: white;
  border: 0;
  background: #FF6E12;
  border-radius: 8px;
  font-size: 18px;
  outline: none;
  height: 49px;
  width: 100%;
  margin-top: 12px;

  &:focus {
    outline: none;
  }
  &:hover {
    background-color: ${({ disabled }) => !disabled && darken(0.08, '#FF6E12')};
  }
  :disabled {
    opacity: 0.4;
  }
}`


export default function WalletConnectComp(props: any) {
  const [isOpen, setOpen] = useState(false)

  const { t } = useTranslation()

  const updateAccountInfo = useAccountInfoUpdate()
  const myTokenTypes = useTokenTypes()

  const handleClick = () => {
    setOpen(true)
  }

  const handleWalletClose = (value: any) => {
    setOpen(false)
    if (_.isEmpty(value)) {
      return
    }

    async function getAcount() {
      const msg = await loadAccount(value, myTokenTypes, updateAccountInfo);
      if (msg !== 'ok') {
        toast(t(msg))
      }
    }

    getAcount()
  };

  return (
    <div>
      <StyledButton onClick={handleClick} >{t('connectToWallet')}</StyledButton>
      <WalletSelectDialog 
            accountTypes={supportedWalletTypes} 
            open={isOpen} 
            onClose={handleWalletClose}></WalletSelectDialog> 
    </div>
  )
  
}
