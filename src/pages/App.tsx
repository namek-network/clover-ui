import React, { Component, Suspense } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

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
  padding-top: 60px;
  align-items: center;

  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
`;

export default class App extends Component {
  render() {
    return (
      <Suspense fallback={null}>
        <HashRouter>
          <AppWrapper>
            <Header />
            <BodyWrapper>
              <Switch>
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
}
