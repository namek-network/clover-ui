import React, { Component, useEffect, useState, useCallback } from 'react';
import { useSlippageTol, useSlippageTolUpdate, useTransDeadline, useTransDeadlineUpdate } from '../../state/settings/hooks';
import './index.css'
import '../../assets/vendors/font-bxb/bxb-font.css'
import SlippageChoiceComp from './slippageChoiceComp'
import TranDeadlineComp from './tranDeadlineComp';
import InfoHelper from '../InfoHelper'

export default function SettingsComp() {
  const [open, setOpen] = useState(false)

  const spt = useSlippageTol()
  const sptUpdate = useSlippageTolUpdate()
  const td = useTransDeadline()
  const tdUpdate = useTransDeadlineUpdate()

  const handleClick = (e: any) => {
    setOpen(!open)
    e.nativeEvent.stopImmediatePropagation()
  }

  const stopPropagation = (e: any) => {
    e.nativeEvent.stopImmediatePropagation()
  }

  useEffect(() => {
    const listener = (e: any) => {
      setOpen(false)
    }
    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('click', listener)
    }
  })
    return (
      <div className="setting-container">
        <div className="setting-btn-container" onClick={handleClick}><i className="fa fo-settings"></i>
        </div>
        {
          open && 
          <div className="panel-container" onClick={stopPropagation}>
            <div className="title">Slippage tolerance
              <InfoHelper 
                className={"fa fo-alert-circle"} 
                customStyle={"margin-left: 4px;"}
                text={'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'}></InfoHelper>
            </div>
            <SlippageChoiceComp 
              slippageTol={spt} 
              setSlippageTol={sptUpdate}></SlippageChoiceComp>
            <div className="title margin-title">Transaction Deadline
              <InfoHelper 
                className={"fa fo-alert-circle"} 
                customStyle={"margin-left: 4px;"}
                text={'Your transaction will revert if it is pending for more than this long.'}></InfoHelper>
            </div>
            <TranDeadlineComp 
              transDeadline={td}
              setTransDeadline={tdUpdate}></TranDeadlineComp>
          </div>
        }
      </div>
    );

}
