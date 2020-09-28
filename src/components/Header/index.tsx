import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import WalletComp from '../WalletComp'
import SettingsComp from '../Settings'
import LanguageComp from '../Language'
import './index.css';
import ImgLogo from '../../assets/images/logo.svg';

export default class Header extends Component {
  render(): React.ReactElement {
    return (
      <Navbar variant="light">
        <Navbar.Brand href="#/swap">
          <img
            src={ImgLogo}
            className="d-inline-block align-top"
            alt="Bithumb logo"
          />
        </Navbar.Brand>

        <Nav variant="pills" defaultActiveKey="swap" className="ml-auto mr-auto">
          <Nav.Item>
            <Nav.Link href="#/swap" eventKey="swap">Swap</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#/lending" eventKey="lending">Lending</Nav.Link>
          </Nav.Item>
          <Nav.Item> 
            <Nav.Link href="#/aggregator" eventKey="aggregator">Aggregator</Nav.Link>
          </Nav.Item>
          <Nav.Item><Nav.Link disabled>|</Nav.Link></Nav.Item>
          <Nav.Item>
            <Nav.Link href="#/governance" eventKey="governance">Governance</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#/market" eventKey="market">Market</Nav.Link>
          </Nav.Item>
        </Nav>

        <WalletComp></WalletComp>
        <SettingsComp></SettingsComp>
        <LanguageComp></LanguageComp>
      </Navbar>
    );
  }

}
