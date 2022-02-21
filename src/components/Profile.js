import React, { useEffect, useRef, useState } from "react";
import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";

import { loadToken } from '../services/Storage'
import { requestUserInfo, requestEditUserInfo, requestEditUserPassword, requestEditUserImage, requestGetUserImage }
  from '../services/api/Backend'

export default function Profile() {
  const [initData, setInitData] = useState({email: "", first_name: "", last_name: "",
                                                     address: "", city: "", zip_code: ""})
  const emailRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const addressRef = useRef()
  const cityRef = useRef()
  const zipCodeRef = useRef()

  const newPassRef = useRef()
  const newPassConfRef = useRef()
  const curPassRef = useRef()

  const [imageUploadFile, setImageUploadFile] = useState(null)
  const [dispImageFile, setDispImageFile] = useState(null)

  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const fetchUserImage = async (token) => {
    let request = requestGetUserImage(token)
    const [success, data] = await request
    if (success) {
      setDispImageFile(data)
    } else {
      setError("Error when downloading profile picture")
    }
  }

  const fetchUserInfo = async (token) => {
    let request = requestUserInfo(token)
    const [success, data] = await request
    if (success) {
      setInitData(data)
      emailRef.current.value = ''
      firstNameRef.current.value = ''
      lastNameRef.current.value = ''
      addressRef.current.value = ''
      cityRef.current.value = ''
      zipCodeRef.current.value = ''
    }
  }

  useEffect(() => {
    let token = loadToken()
    fetchUserInfo(token)
    fetchUserImage(token)
  }, [])

  async function handleUpdateAccountInfo(e) {
    e.preventDefault()
    setInfo('')
    setError('')
    let user = {
      email: (emailRef.current.value === '') ? initData.email : emailRef.current.value,
      first_name: (firstNameRef.current.value === '') ? initData.first_name : firstNameRef.current.value,
      last_name: (lastNameRef.current.value === '') ? initData.last_name : lastNameRef.current.value,
      address: (addressRef.current.value === '') ? initData.address : addressRef.current.value,
      city: (cityRef.current.value === '') ? initData.city : cityRef.current.value,
      zip_code: (zipCodeRef.current.value === '') ? initData.zip_code : zipCodeRef.current.value,
    }
    let token = loadToken()
    let request = requestEditUserInfo(user, token)
    const [success, data] = await request
    if (success) {
      let token = loadToken()
      fetchUserInfo(token)
      setInfo('Updated user info!')
    } else {
      if (data["first_name"] != undefined) {
        setError("First name: " + data["first_name"])
        return
      }
      if (data["last_name"] != undefined) {
        setError("Last name: " + data["last_name"])
        return
      }
      if (data["email"] != undefined) {
        setError("Email: " + data["email"])
        return
      }
      if (data["zip_code"] != undefined) {
        setError("Zip Code: " + data["zip_code"])
        return
      }
      if (data["address"] != undefined) {
        setError("Address: " + data["address"])
        return
      }
      if (data["city"] != undefined) {
        setError("City: " + data["city"])
        return
      }
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault()
    setInfo('')
    setError('')

    let token = loadToken()
    let request = requestEditUserPassword(newPassRef.current.value, newPassConfRef.current.value,
                                          curPassRef.current.value, token)
    const [success, data] = await request
    if (success) {
      setInfo("Updated user password!")
      curPassRef.current.value = ''
      newPassRef.current.value = ''
      newPassConfRef.current.value = ''
    } else {
      if (data["non_field_errors"] != undefined) {
        setError(data["non_field_errors"])
        return
      }
      if (data["current_password"] != undefined) {
        setError("Invalid current password.")
        return
      }
      if (data["new_password"] != undefined) {
        setError(data["new_password"])
        return
      }
    }
  }

  async function handleUpdateImage(e) {
    e.preventDefault()
    setInfo('')
    setError('')

    if (imageUploadFile == null) {
      setError("Please select a file.")
      return
    }
    const type_parsed = imageUploadFile.type.split('/')
    if (type_parsed[0] !== 'image') {
      setError("Non-image files are not accepted.")
      return
    }
    let reader = new FileReader()
    reader.onerror = () => {
      setError("Error when loading file: " + reader.error)
    }
    reader.onload = async() => {
      let token = loadToken()
      let request = requestEditUserImage(reader.result, type_parsed[1], token)
      const [success, data] = await request
      if (success) {
        setInfo()
        window.location.reload(false)
      } else {
        setError("Error when updating profile image")
      }
    }
    reader.readAsDataURL(imageUploadFile)
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-start">
        <Col xs xxl="6" xl="7" lg="8" md="10" sm="10">
          <Card className=""
                style={{marginTop: 100}}>
            <Card.Header className="text-center" as="h3"> Profile </Card.Header>
            <Card.Body>
              <Card.Text as="h5">Account information</Card.Text>
              <Row>
              <Col>
                <Card.Img style={{ width: 640/2, height: 480/2, borderRadius: 5 }} variant="right"
                          src={dispImageFile} />
              </Col>
              <Col>
                <Form>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file"
                                  onChange={(e) => setImageUploadFile(e.target.files[0]) } />
                  </Form.Group>
                  <Button variant="primary" type="submit" onClick={handleUpdateImage}>
                    Upload
                  </Button>
                </Form>
              </Col>
              </Row>
              <Form>
                <Row className="mb-3" style={{ marginTop: 10}} >
                  { error && <Alert variant="danger">{error}</Alert> }
                  { info && <Alert variant="success">{info}</Alert> }
                  <Form.Group as={Col}>
                    <Form.Label>First name</Form.Label>
                    <Form.Control ref={firstNameRef} placeholder={initData.first_name} />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control ref={lastNameRef} placeholder={initData.last_name} />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control ref={emailRef} placeholder={initData.email} />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} xs="5">
                    <Form.Label>Address</Form.Label>
                    <Form.Control ref={addressRef} placeholder={initData.address} />
                  </Form.Group>
                  <Form.Group as={Col} xs="4">
                    <Form.Label>City</Form.Label>
                    <Form.Control ref={cityRef} placeholder={initData.city} />
                  </Form.Group>
                  <Form.Group as={Col} xs="3">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control ref={zipCodeRef} placeholder={initData.zip_code} />
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit" onClick={handleUpdateAccountInfo}>
                  Save
                </Button>
              </Form>
              <Card.Text  style={{ marginTop: 15 }}
                          as="h5">Change Password</Card.Text>
              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Current password</Form.Label>
                    <Form.Control type="password" ref={curPassRef} />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>New password</Form.Label>
                    <Form.Control type="password" ref={newPassRef} />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Confirm new password</Form.Label>
                    <Form.Control type="password" ref={newPassConfRef} />
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit" onClick={handleUpdatePassword}>
                  Save
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
