import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';
import WalletComp from '../WalletComp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css';
import ImgLogo from '../../assets/images/logo.svg';

const NavbarWrapper = styled(Navbar)`
  // align-self: stretch
`;

export default class Header extends Component {
  render() {
    return (
      <NavbarWrapper variant="light">
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
        <Nav>
          <Navbar.Brand href="#/settings">
            <FontAwesomeIcon icon="cog" color="#F78408" size="sm" />
          </Navbar.Brand>
        </Nav>
      </NavbarWrapper>
    );
  }

}
