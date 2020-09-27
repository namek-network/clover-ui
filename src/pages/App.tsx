import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { initApi } from '../utils/apiUtils'
import { loadCurrencyPair, loadTokenTypes } from '../utils/tokenUtils'
import { useTokenTypesUpdate, useCurrencyPairUpdate } from '../state/token/hooks'
import { ToastContainer, Slide } from 'react-toastify';

import {useApiConnectedUpdate, useApiInited, useApiInitedUpdate} from '../state/api/hooks'

import Header from '../components/Header';
import Footer from '../components/Footer';

import Swap from './Swap';
import Pool from './Pool'
import Lending from './Lending';

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
  z-index: 1;
`;

export default function App(): React.ReactElement {
  const apiInited = useApiInited()
  const apiInitedUpdate = useApiInitedUpdate()
  const updateApiConnected = useApiConnectedUpdate()

  const onApiInited = () => {
    apiInitedUpdate(true)
    updateApiConnected(true)
  }

  const updateTokenTypeList = useTokenTypesUpdate()
  const updateCurrencyPair = useCurrencyPairUpdate()

  const initPolkaApi = async () => {
    await initApi(onApiInited, () => {updateApiConnected(true)}, () => {updateApiConnected(false)})
  }

  useEffect(() => {
    initPolkaApi()
  }, [])

  useEffect(() => {
    if (!apiInited) {
      return
    }

    loadTokenTypes(updateTokenTypeList)
    loadCurrencyPair(updateCurrencyPair)
  }, [apiInited])
  
  return (
    <Suspense fallback={null}>
      <HashRouter>
        <AppWrapper>
          <Header />
          <BodyWrapper>
            <Switch>
              <Route exact strict path="/" component={Swap} />
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/lending" component={Lending} />
            </Switch>
          </BodyWrapper>
          <Footer />
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
