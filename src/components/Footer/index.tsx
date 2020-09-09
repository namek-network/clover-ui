import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';

export default class Footer extends Component {

  render() {
    return (
      <Navbar fixed="bottom" variant="light" className="justify-content-center">
        <Nav>
          <Nav.Link href="#/home">Home</Nav.Link>
          <Nav.Link href="#/developers">Developers</Nav.Link>
          <Nav.Link href="#/network">Network</Nav.Link>
          <Nav.Link href="#/community">Community</Nav.Link>
          <Nav.Link href="#/info">Info</Nav.Link>
        </Nav>
      </Navbar>
    );
  }

}
