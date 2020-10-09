import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import WalletComp from '../WalletComp'
import SettingsComp from '../Settings'
import LanguageComp from '../Language'
import './index.css'
import ImgLogo from '../../assets/images/logo.svg'

export default function Header(): ReactElement {
  const { t } = useTranslation();

  return (
    <Navbar variant="light">
      <Navbar.Brand href="#/swap">
        <img
          src={ImgLogo}
          className="d-inline-block align-top"
          alt="clover logo"
        />
      </Navbar.Brand>

      <Nav variant="pills" defaultActiveKey="swap" className="ml-auto mr-auto">
        <Nav.Item>
          <Nav.Link href="#/swap" eventKey="swap">{t('headerSwap')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/lending" eventKey="lending">{t('headerLending')}</Nav.Link>
        </Nav.Item>
        <Nav.Item> 
          <Nav.Link href="#/aggregator" eventKey="aggregator">{t('headerAggregator')}</Nav.Link>
        </Nav.Item>
        <Nav.Item><Nav.Link disabled>|</Nav.Link></Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/governance" eventKey="governance">{t('headerGovernance')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#/market" eventKey="market">{t('headerMarket')}</Nav.Link>
        </Nav.Item>
      </Nav>

      <WalletComp></WalletComp>
      <SettingsComp></SettingsComp>
      <LanguageComp></LanguageComp>
    </Navbar>
  )
}
