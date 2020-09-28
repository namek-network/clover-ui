import React, { useState } from 'react';
import styled from 'styled-components';
import './index.css'
import { useTranslation } from 'react-i18next'
import Modal from '../../components/Modal'
import Column from '../../components/Column'
import {WalletType} from '../../utils/AccountUtils'

const Wrapper = styled.div`
  overflow: auto;
`

interface WalletSelectDialogPropTypes {
  onClose: (value?: WalletType) => void,
  open: boolean,
  walletTypes: WalletType[]
}

export default function WalletSelectDialog({ onClose, open, walletTypes }: WalletSelectDialogPropTypes): React.ReactElement {
  const [hoverValue, setHoverValue] = useState({});

  const { t } = useTranslation()
  const handleClose = () => {
    setHoverValue({})
    onClose();
  };

  const handleListItemClick = (value: WalletType) => {
    setHoverValue({})
    onClose(value);
  };

  const customStyle = 'border-radius: 16px; max-width: 470px; width: 469px;'
  return (
    <Modal isOpen={open} onDismiss={handleClose} maxHeight={90} customStyle={customStyle}>
      <Column>
        <div className="content-width">
          <div>{t('connectToWallet')}</div>
          <div className="wallet-dia-close-btn" onClick={() => handleClose()}><i className="fa fo-x"></i></div>
        </div>
        <Wrapper>
          <div className='list-container'>
            {
                walletTypes.map((account: WalletType, index: number) => (
                  <div className='item-container' key={index}
                  onMouseEnter={() => setHoverValue(account)}
                  onMouseLeave={() => setHoverValue({})}
                  onClick={() => handleListItemClick(account)}>
                      <div className='dialog-item-text-left'>
                        <img alt={account.icon} src={account.icon}></img>
                        {account.name}
                      </div>
                      <div className={'dialog-item-text-right ' + (account === hoverValue ? 'dialog-item-text-right-hover' : '')}><i className="fa fo-chevron-right"></i></div>
                  </div>
                ))
              }
          </div>
          <div className="bottom-text">
            By connecting, I accept bithumb’s <span className="bottom-text-right">Terms of Service</span>
          </div>
        </Wrapper>
        
      </Column>
    </Modal>
  );
}
