import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';

function Navbar() {
  const { currentUser } = useContext(UserContext);

  return (
    <BootstrapNavbar bg="light" expand="lg" >
      <BootstrapNavbar.Brand href="/">Banking App</BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle />
      <BootstrapNavbar.Collapse>
        <Nav>
          <Nav.Link as={NavLink} to="/">Home</Nav.Link>
          
          {!currentUser ? (
            <>
              <Nav.Link as={NavLink} to="/create-account">Create Account</Nav.Link>
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={NavLink} to="/deposit">Deposit</Nav.Link>
              <Nav.Link as={NavLink} to="/withdraw">Withdraw</Nav.Link>
              <Nav.Link as={NavLink} to="/all-data">All Data</Nav.Link>
              <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
            </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}

export default Navbar;