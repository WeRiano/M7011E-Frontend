import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'

import { loadToken } from '../services/Storage'
import { useAuth } from '../contexts/AuthContext'
import { requestUserInfo } from '../services/api/Backend'

export default function NavigationBar() {
  const { currentUser, logout } = useAuth()
  const [isAdmin, setAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (currentUser) {
        let token = loadToken()
        let request = requestUserInfo(token)
        const [success, data] = await request
        if (success) {
          setAdmin(data["admin"])
        } else {
          setAdmin(false)
        }
      }
    })()
  })

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand> SureFire Electrics </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
            {currentUser != null ?
            <Nav>
              {isAdmin &&
                <Nav.Link href="/admin">Admin</Nav.Link>
              }
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