import React, { useRef, useState, useEffect } from "react";
import {Button, Card, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const emailRef = useRef('')
  const firstNameRef = useRef('')
  const lastNameRef = useRef('')
  const addressRef = useRef('')
  const cityRef = useRef('')
  const zipCodeRef = useRef('')
  const passRef = useRef('')
  const passConfRef = useRef('')


  const { signup, logout } = useAuth()
  const [error, setError] = useState('');
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    logout()
  }, [])

  async function handleSignup(e) {
    e.preventDefault();
    setError('')
    setInfo('')

    if (emailRef.current.value === '' || firstNameRef.current.value === '' ||
        cityRef.current.value === '' || addressRef.current.value === '' || zipCodeRef.current.value === '' ) {
      setError('Please provide all the required information')
      return
    }

    if (passRef.current.value === '' || passConfRef.current.value === '') {
      setError('Please provide a password and a confirmation')
      return
    }

    if (passRef.current.value !== passConfRef.current.value) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    let user = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      address: addressRef.current.value,
      city: cityRef.current.value,
      zip_code: zipCodeRef.current.value,
      email: emailRef.current.value,
      password: passRef.current.value,
      confirm_password: passConfRef.current.value
    }
    const [success, data] = await signup(user)
    setLoading(false)

    if (success) {
      setInfo('New user created successfully')
    } else {
      if (data["email"] != undefined) {
        setError("Email: " + data["email"])
        return
      }
      if (data["password"] != undefined) {
        setError("Password: " + data["password"])
        return
      }
      if (data["zip_code"] != undefined) {
        setError("Zip Code: " + data["zip_code"])
        return
      }
    }
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-start">
        <Col xs xxl="4" xl="7" lg="8" md="10" sm="10">
          <Card className="text-center"
                style={{ marginTop: 100}}>
            <Card.Header as="h5"> Sign Up </Card.Header>
            <Card.Body>
              { error && <Alert variant="danger">{error}</Alert> }
              { info && <Alert variant="success">{info}</Alert> }
              <div className="gap-2">
                <Form onSubmit={handleSignup}>
                  <Row className="mb-3">
                    <Form.Group>
                      <Form.Label style={{ color: "red" }}>*</Form.Label><Form.Label>Email</Form.Label>
                      <Form.Control ref={emailRef} placeholder={'example@email.com'} />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3" style={{ marginTop: 10 }} >
                    <Form.Group as={Col}>
                      <Form.Label style={{ color: "red" }}>*</Form.Label><Form.Label> First name</Form.Label>
                      <Form.Control ref={firstNameRef}  />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Last name</Form.Label>
                      <Form.Control ref={lastNameRef}  />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} xs="5">
                      <Form.Label style={{ color: "red" }}>*</Form.Label><Form.Label>Address</Form.Label>
                      <Form.Control ref={addressRef}  />
                    </Form.Group>
                    <Form.Group as={Col} xs="4">
                      <Form.Label style={{ color: "red" }}>*</Form.Label><Form.Label>City</Form.Label>
                      <Form.Control ref={cityRef} />
                    </Form.Group>
                    <Form.Group as={Col} xs="3">
                      <Form.Label style={{ color: "red" }}>*</Form.Label><Form.Label>Zip</Form.Label>
                      <Form.Control ref={zipCodeRef} />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label style={{ color: "red" }}>*</Form.Label><Form.Label>Password</Form.Label>
                      <Form.Control type="password" ref={passRef} />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label style={{ color: "red" }}>*</Form.Label><Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password" ref={passConfRef} />
                    </Form.Group>
                  </Row>
                </Form>
                <div className="d-grid gap-2">
                <Button variant="success" size="lg" style={{ marginTop: 15 }}
                        disabled={loading} onClick={handleSignup} >
                  Create account
                </Button>
                <div className="w-100 text-center mt-2">
                  Already have an account? <Link to="/login">Log In</Link>
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