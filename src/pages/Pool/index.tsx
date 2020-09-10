import React, { Component } from 'react';
import styled from 'styled-components';
import { SwapPoolTabs } from '../../components/NavigationTabs'

const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 460px;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
  border-radius: 16px;
  padding: 1rem;
`;

export default class Pool extends Component {
  render() {
    return (
      <BodyWrapper>
        <SwapPoolTabs active={'pool'} />
      </BodyWrapper>
    );
  }
}
