import React, { Component, Suspense, useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { api, initApi } from '../utils/apiUtils'
import { loadCurrencyPair, loadTokenTypes } from '../utils/tokenUtils'
import { useTokenTypesUpdate, useCurrencyPairUpdate } from '../state/token/hooks'

import {useApiInited, useApiReadyUpdate, useApiConnectedUpdate, 
  useApiInitedUpdate, useApiConnected, useApiReady} from '../state/api/hooks'

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

export default function App() {
  const apiInited = useApiInited()
  const apiInitedUpdate = useApiInitedUpdate()

  const onApiInited = () => {
    apiInitedUpdate(true)
  }

  const updateTokenTypeList = useTokenTypesUpdate()
  const updateCurrencyPair = useCurrencyPairUpdate()

  const initPolkaApi = async () => {
    await initApi(onApiInited)
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
        </AppWrapper>
      </HashRouter>
    </Suspense>
  );
}
