import React, { Component } from 'react';
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

export default class Footer extends Component {
  render() {
    return (
      <Navbar variant="light" className="justify-content-center">
        <Nav>
          <Link href="#/home">Home</Link>
          <Link href="#/developers">Developers</Link>
          <Link href="#/network">Network</Link>
          <Link href="#/community">Community</Link>
          <Link href="#/info">Info</Link>
        </Nav>
      </Navbar>
    );
  }

}
