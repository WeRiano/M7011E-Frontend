import { Container, Form, Col, Row, Button, Card, Alert } from 'react-bootstrap'
import React, { useState, useEffect, useRef } from "react";

import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const { currentUser, login, logout } = useAuth()

  const navigate = useNavigate();

  useEffect(() => {
    logout()
  }, [])

  useEffect(() => {
    if (currentUser != null) navigate('/dashboard')
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    setLoading(true)
    let success = await login(emailRef.current.value, passwordRef.current.value)
    setLoading(false)

    if (success) {
      navigate('/dashboard')
    } else {
      setError("Wrong username or password")
    }
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-start">
        <Col xs lg="3" md="5" sm="7">
          <Card className="text-center"
                style={{marginTop: 100}}>
            <Card.Header as="h5"> Log In </Card.Header>
            <Card.Body>
              { error && <Alert variant="danger">{error}</Alert> }
              <div className="gap-2">
                <Form>
                  <Form.Group controlId="formEmail">
                    <Form.Label> Email Address </Form.Label>
                    <Form.Control type="email" placeholder="example@email.com"
                                  ref={emailRef} required />
                  </Form.Group>
                  <Form.Group controlId="formPassword"
                              style={{marginTop: 15}}>
                    <Form.Label> Password </Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>
                </Form>
                <div className="d-grid gap-2">
                  <Button type="button" variant="success"
                          disabled={loading}
                          onClick={handleSubmit}
                          size="lg" style={{marginTop: 15}}>
                    Log In
                  </Button>
                  <div className="w-100 text-center mt-2">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}