import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';
import { darken } from 'polished';

const Link = styled.a`
  margin: 5px 15px;
  font-size: 16px;
  font-family: Roboto-Light, Roboto;
  font-weight: 300;
  color: #666F83;

  :hover {
    color: ${darken(0.1, '#666F83')};
    text-decoration: none;
  }
`;

export default function Footer(): ReactElement {
  const { t } = useTranslation();

  return (
    <Navbar variant="light" className="justify-content-center">
      <Nav>
        <Link href="#/home">{t('footerHome')}</Link>
        <Link href="#/developers">{t('footerDevelopers')}</Link>
        <Link href="#/network">{t('footerNetwork')}</Link>
        <Link href="#/community">{t('footerCommunity')}</Link>
        <Link href="#/info">{t('footerInfo')}</Link>
      </Nav>
    </Navbar>
  )
}
