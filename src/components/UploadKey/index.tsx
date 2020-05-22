import React from 'react';
import { Typography } from '@material-ui/core';
import './style.css';
import { showMessage } from '../Toast';
import { wallet } from '../../services/wallet';

export interface Props {};

const UploadKey: React.FC<Props> = () => {
  const [addr, setAddr] = React.useState<string>('');
  const [balance, setBalance] = React.useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function(evt) {
        const txt = evt?.target?.result;
        if (typeof txt === 'string') {
          wallet.setJwk(JSON.parse(txt));
          wallet.getAddress()
            .then(addr => {
              setAddr(addr);

              wallet.getBalance()
                .then(_balance => {
                  setBalance(_balance);
                })
            });
        } else {
          showMessage('Invalid wallet key');
        }
      }
      reader.onerror = function () {
        showMessage('Can not load your wallet, please make sure the wallet key is valid');
      }
    }
  }


  return (
    <div
      className='UploadKey'
    >
      {
        addr
          ? (
            <>
              <Typography>Your address wallet: {addr}</Typography>
              <Typography>Balance: {balance} AR</Typography>
            </>
          )
          : (
            <>
              <Typography>Import your wallet to store the result on chain</Typography>
              <input
                type="file"
                accept=".json"
                onChange={handleUpload}
              />
            </>
          )
      }
      
    </div>
  );
};

export default UploadKey;