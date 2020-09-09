import React, { Component, Suspense } from 'react';
import Container from 'react-bootstrap/Container';
import styled from 'styled-components';

import Header from '../components/Header';
import Footer from '../components/Footer';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
`;

export default class App extends Component {
  render() {
    return (
      <Suspense fallback={null}>
        <AppWrapper>
          <Header />

          <Footer />
        </AppWrapper>
      </Suspense>
    );
  }
}
