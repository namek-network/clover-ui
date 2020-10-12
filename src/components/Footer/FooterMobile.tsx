import React, { ReactElement } from 'react'
import styled from 'styled-components'
import WalletComp from '../WalletComp'
import SettingsComp from '../Settings'
import LanguageComp from '../Language'

const FooterWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;

  padding: 12px 16px;
  background: #FFFFFF;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default function FooterMobile(): ReactElement {

  return (
    <FooterWrapper>
      <WalletComp></WalletComp>
      <RightWrapper>
        <SettingsComp></SettingsComp>
        <LanguageComp></LanguageComp>
      </RightWrapper>
    </FooterWrapper>
  )
}
