import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const NavBar = ({ user }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Rodud App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {user ? (
            <>
              <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={NavLink} to="/truckRequestForm">Truck Request</Nav.Link>
              <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
              <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              <Nav.Link as={NavLink} to="/forgot-password">Forgot Password</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
