import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

export default function NavigationBar() {
  const { currentUser, logout } = useAuth()

  const navigate = useNavigate();

  async function handleLogout() {
    let success = await logout()
    if (success) {
      navigate('/')
    }
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand> SureFire Electrics </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
            {currentUser != null ?
            <Nav>
              <Nav.Link href="/profile">Profile</Nav.Link>
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
            :
            <Nav>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Signup</Nav.Link>
            </Nav>
            }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}