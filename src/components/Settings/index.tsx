import React, { useEffect, useState, MouseEvent } from 'react';
import { useSlippageTol, useSlippageTolUpdate, useTransDeadline, useTransDeadlineUpdate } from '../../state/settings/hooks';
import './index.css'
import '../../assets/vendors/font-bxb/bxb-font.css'
import SlippageChoiceComp from './slippageChoiceComp'
import TranDeadlineComp from './tranDeadlineComp';
import InfoHelper from '../InfoHelper'
import styled from 'styled-components';

const SettingWrapper = styled.div`
  position: relative;
  font-size: 20px;
  color: #F78408;
  cursor: pointer;
  font-weight: 400;
  height: 32px;
  width: 38px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;

  &:hover {
    background: #FCF0DC;
  }
`

export default function SettingsComp(): React.ReactElement {
  const [open, setOpen] = useState(false)

  const spt = useSlippageTol()
  const sptUpdate = useSlippageTolUpdate()
  const td = useTransDeadline()
  const tdUpdate = useTransDeadlineUpdate()

  const handleClick = (e: MouseEvent) => {
    setOpen(!open)
    e.nativeEvent.stopImmediatePropagation()
  }

  const stopPropagation = (e: MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation()
  }

  useEffect(() => {
    const listener = () => {
      setOpen(false)
    }
    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('click', listener)
    }
  })
    return (
      <SettingWrapper onClick={handleClick}>
        <i className="fa fo-settings"></i>
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
      </SettingWrapper>
    );

}
