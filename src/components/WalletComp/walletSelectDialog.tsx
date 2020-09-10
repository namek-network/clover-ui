import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import './index.css'

const accountTypes = ['Math Wallet', 'ImToken Wallet', 'Lunie Wallet'];

export default function WalletSelectDialog(props: any) {
  const { onClose, selectedValue, open, accountTypes } = props;
  const [hoverValue, setHoverValue] = useState({});

  const handleClose = () => {
    setHoverValue({})
    onClose(selectedValue);
  };

  const handleListItemClick = (value: any) => {
    setHoverValue({})
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} classes={{paper: "dialog-custom"}}>
      <div className="content-width">
        <div>Connect to a wallet</div>
        <div className="wallet-dia-close-btn" onClick={() => handleClose()}>x</div>
      </div>
      <div className='list-container'>
        {
            accountTypes.map((account: any, key: any) => (
              <div className='item-container' key={key}
              onMouseEnter={() => setHoverValue(account)}
              onMouseLeave={() => setHoverValue({})}
              onClick={() => handleListItemClick(account)}>
                  <div className='dialog-item-text-left'>
                    <img src={account.icon}></img>
                    {account.name}
                  </div>
                  <div className={'dialog-item-text-right ' + (account === hoverValue ? 'dialog-item-text-right-hover' : '')}>{'>'}</div>
              </div>
            ))
          }
      </div>
      <div className="bottom-text">
        By connecting, I accept bithumb’s <span className="bottom-text-right">Terms of Service</span>
      </div>
    </Dialog>
  );
}

WalletSelectDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.object.isRequired,
  accountTypes: PropTypes.array.isRequired
};
