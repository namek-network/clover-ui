import React, { Suspense, useEffect, useCallback } from 'react'
import _ from 'lodash'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import { initApi } from '../utils/apiUtils'
import { loadAllPools, loadCurrencyPair, loadTokenTypes, subscribeToEvents } from '../utils/tokenUtils'
import { useTokenTypes, useTokenTypesUpdate, useCurrencyPairUpdate } from '../state/token/hooks'
import { useStakePoolItemsUpdate } from '../state/farm/hooks'
import { ToastContainer, Slide } from 'react-toastify';

import { useApiConnectedUpdate, useApiInited, useApiInitedUpdate } from '../state/api/hooks'
import { useAccountInfo, useAccountInfoUpdate } from '../state/wallet/hooks'

import Header from '../components/Header'
import Footer from '../components/Footer'
import FooterMobile from '../components/Footer/FooterMobile'

import Swap from './Swap'
import Pool from './Pool'
import Farm from './Farm'
import Lending from './Lending'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: stretch;
  height: 100vh;
  min-height: 650px;
  overflow: auto;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 20px;
  align-items: center;

  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding-top: 0;
  `};

  z-index: 1;
`;

export default function App(): React.ReactElement {
  const apiInited = useApiInited()
  const apiInitedUpdate = useApiInitedUpdate()
  const updateApiConnected = useApiConnectedUpdate()
  const accountInfo = useAccountInfo();
  const tokenTypes = useTokenTypes()

  const onApiInited = useCallback(() => {
    apiInitedUpdate(true)
    updateApiConnected(true)
  }, [apiInitedUpdate, updateApiConnected])

  const updateTokenTypeList = useTokenTypesUpdate()
  const updateCurrencyPair = useCurrencyPairUpdate()
  const udateStakePoolItems = useStakePoolItemsUpdate()
  const updateAccountInfo = useAccountInfoUpdate()


  const initPolkaApi = useCallback(async () => {
    await initApi(onApiInited, () => {updateApiConnected(true)}, () => {updateApiConnected(false)})
  }, [onApiInited, updateApiConnected])

  useEffect(() => {
    initPolkaApi()
  }, [initPolkaApi])

  useEffect(() => {
    if (!apiInited) {
      return
    }

    loadTokenTypes(updateTokenTypeList)
    loadCurrencyPair(updateCurrencyPair)
    loadAllPools(udateStakePoolItems)
  }, [apiInited, updateCurrencyPair, updateTokenTypeList, udateStakePoolItems])

  useEffect(() => {
    if (!apiInited) {
      return
    }
    
    subscribeToEvents(udateStakePoolItems, apiInited, accountInfo, tokenTypes, updateAccountInfo).catch((e) => {console.log(e)})
  }, [apiInited, udateStakePoolItems, accountInfo, tokenTypes, updateAccountInfo])

  useEffect(() => {
    if (_.isEmpty(accountInfo.address)) {
      return
    }
    
  }, [accountInfo])
  
  return (
    <Suspense fallback={null}>
      <HashRouter>
        <AppWrapper>
          {!isMobile &&
            <Header />
          }
          <BodyWrapper>
            <Switch>
              <Route exact strict path="/" component={Swap} />
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/farm" component={Farm} />
              <Route exact strict path="/lending" component={Lending} />
            </Switch>
          </BodyWrapper>
          {isMobile ? <FooterMobile /> : <Footer />}
          <ToastContainer 
            position="top-center"
            autoClose={3000}
            transition={Slide}
            React-toastify
            hideProgressBar={true}/>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  );
}
