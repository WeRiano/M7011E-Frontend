import React, {useState, useRef, useEffect} from "react";
import {Container, Table, Row, Card, Col, Button, Modal, Alert, Form, ListGroup, ProgressBar} from "react-bootstrap";
import { useNavigate } from 'react-router-dom'

import { requestEditBufferSettings, requestEditDelta, requestGetSimCond, requestResetSim } from '../services/api/Simulation'
import { loadToken, storeUser } from "../services/Storage"
import { useAuth } from '../contexts/AuthContext'
import { requestGetAllUsers, requestUserInfo, requestDeleteUser } from "../services/api/Backend"

export default function Admin() {
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isLoading, setLoading] = useState(false)

  const [selectedUser, setSelectedUser] = useState(null)
  const [simCond, setSimCond] = useState({storing: 50, using: 50})
  const [storing, setStoring] = useState(50)
  const [using, setUsing] = useState(50)
  const [allUsers, setAllUsers] = useState([])
  const [delConf, setDelConf] = useState(false)
  const newDeltaRef = useRef()

  let navigate = useNavigate()

  const authorizeAndFetch = async (token) => {
    let request = requestUserInfo(token)
    const [success, data] = await request
    if (success) {
      if (data['admin'] !== true) {
        // Successfully fetched user but it's not an admin user
        navigate('/dashboard')
      } else {
        // Successfully fetched user and it's an admin!
        fetchAllUsers(token)
      }
    } else {
      // Error fetching user info
      navigate('/dashboard')
    }
  }

  const fetchAllUsers = async (token) => {
    let request = requestGetAllUsers(token)
    const [success, data] = await request
    if (success) {
      setAllUsers(data['users'])
    } else {
      setError('Error when fetching users from backend service.')
    }
  }

  useEffect(() => {
    let token = loadToken()
    authorizeAndFetch(token)
  }, [])

  async function handleDeleteAccount() {
    setError('')
    setInfo('')
    setLoading(true)
    let token = loadToken()
    let request = requestDeleteUser(token, selectedUser.id)
    const [success, data] = await request
    if (success) {
      setInfo(data["Success"])
      fetchAllUsers(token)
      setSelectedUser(null)
    } else {
      setError(data["Error"])
    }
    setLoading(false)
    setDelConf(false)
  }

  async function handleResetSimulation() {
    setError('')
    setInfo('')
    setLoading(true)
    let token = loadToken()
    let request = requestResetSim(selectedUser.id, token)
    const [success, data] = await request
    if (success) {
      setInfo(data["success"])
    } else {
      setError(data["error"])
    }
    setLoading(false)
    setDelConf(false)
  }

  let getSimConIntervalId;
  useEffect(() => {
    if (selectedUser != null && !getSimConIntervalId) {
      fetchSimConditions()
      getSimConIntervalId = setInterval(() => {
        fetchSimConditions()
      }, 5000);
      return () => clearInterval(getSimConIntervalId);
      // This will clear the interval when the component
      // unmounts so that we don't call on other pages
    } else {
      if (selectedUser == null && getSimConIntervalId) {
        clearInterval(getSimConIntervalId);
      }
    }
  }, [selectedUser])

  async function fetchSimConditions() {
    let token = loadToken()
    let request = await requestGetSimCond(token, selectedUser.id)
    const [success, data] = await request
    if (success) {
      let cond = {}
      cond.ws = Math.round(data["wind_speed"] * 1000) / 1000
      cond.temp = Math.round(data["temperature"] * 1000) / 1000
      cond.mp = Math.round(data["market_price"] * 1000) / 1000
      cond.pp = Math.round(data["prod_power"] * 10000) / 10000
      cond.bc = Math.round(data["buffer_capacity"] * 1000) / 1000
      cond.delta = data["delta"]
      cond.date_time = data["date_time"]
      cond.con = Math.round(data["consumption"] * 1000) / 1000
      cond.bank = Math.round(data["bank"] * 1000) / 1000
      cond.net = Math.round((cond.pp - cond.con) * 10000) / 10000
      cond.storing = data["saving"] * 100
      cond.using = data["using"] * 100
      setSimCond(cond)
    } else {
      setError('Error when fetching simulation conditions')
    }
  }

  async function handleUpdateDelta(e) {
    e.preventDefault()
    setInfo('')
    setError('')
    let delta = newDeltaRef.current.value
    if (isNaN(delta)) {
      setError("Simulation update frequency must be an number.")
      return
    }
    let token = loadToken()
    let request = requestEditDelta(delta, token, selectedUser.id)
    const [success, data] = await request
    if (success) {
      setInfo('Simulation update frequency was updated successfully')
      selectedUser.delta = delta
    } else {
      setError(data["error"])
    }
  }

  async function handleUpdateRatios(e) {
    e.preventDefault()
    setInfo('')
    setError('')
    let token = loadToken()
    let request = requestEditBufferSettings(storing/100, using/100,
      token, selectedUser.id)
    const [success, data] = await request
    if (!success) {
      setError(data["error"])
    }
  }

  return (
    <Container>
      { delConf &&
        <Modal show={delConf} backdrop="static" onHide={() => { setDelConf(false) }}>
          <Modal.Header closeButton>
          <Modal.Title> Confirm Deletion </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user account? This cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setDelConf(false) }}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="danger" onClick={handleDeleteAccount}>
            Delete account
          </Button>
        </Modal.Footer>
      </Modal>
      }
      {selectedUser == null ?
        <Row className="justify-content-center align-items-start">
          <Col xs xxl="6" xl="7" lg="8" md="10" sm="10">
            <Card>
              {error && <Alert variant="danger">{error}</Alert>}
              {info && <Alert variant="success">{info}</Alert>}
              <Table borderer="true" hover="true">
                <thead>
                <tr>
                  <th> ID</th>
                  <th> Full name</th>
                </tr>
                </thead>
                <tbody>
                {
                  allUsers.map((user, key) => (
                    <tr key={key} onClick={() => {
                      setSelectedUser(user);
                    }}>
                      <td> {user.id} </td>
                      <td> {user.first_name + " " + user.last_name} </td>
                    </tr>
                  ))
                }
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        :
        <Container>
        <Row className="justify-content-center" style={{marginTop: 50}}>
          <Col xs lg="6" className="justify-content-center">
            <Card>
              {error && <Alert variant="danger">{error}</Alert>}
              {info && <Alert variant="success">{info}</Alert>}
              <Table striped="true" bordered="true">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Category</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Temperature</td>
                  <td>{simCond.temp}</td>
                  <td>°C</td>
                  <td>Weather</td>
                </tr>
                <tr>
                  <td>Wind Speed</td>
                  <td>{simCond.ws}</td>
                  <td>m/s</td>
                  <td>Weather</td>
                </tr>
                <tr>
                  <td>Production</td>
                  <td>{simCond.pp}</td>
                  <td>kWh</td>
                  <td>Electricity</td>
                </tr>
                <tr>
                  <td>Consumption</td>
                  <td>{simCond.con}</td>
                  <td>kWh</td>
                  <td>Electricity</td>
                </tr>
                <tr>
                  <td>Market Price</td>
                  <td>{simCond.mp}</td>
                  <td>kr/kWh</td>
                  <td>Economy</td>
                </tr>
                <tr>
                  <td>Wallet</td>
                  <td>{simCond.bank}</td>
                  <td>kr</td>
                  <td>Economy</td>
                </tr>
                <tr>
                  <td>Sim date & time</td>
                  <td>{simCond.date_time}</td>
                  <td>day/month hour/min/sec</td>
                  <td>Simulation</td>
                </tr>
                <tr>
                  <td>Update Frequency</td>
                  <td>{simCond.delta}</td>
                  <td>Seconds</td>
                  <td>Simulation</td>
                </tr>
                </tbody>
              </Table>
              <Form>
                <Row style={{marginTop: -16}}>
                  <Form.Group as={Col} xs xxl="3">
                    <Form.Control ref={newDeltaRef} placeholder={simCond.delta}/>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Button variant="primary" type="submit" onClick={handleUpdateDelta}>
                      Change simulation update frequency
                    </Button>
                  </Form.Group>
                </Row>
              </Form>
            </Card>
            <Card style={{ marginTop: 25 }}>
              <Card.Header className="text-center">User Information</Card.Header>
              <Table striped="true" bordered="true"  style={{ overflowWrap: 'anywhere'}}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>{ selectedUser.id }</td>
                  </tr>
                  <tr>
                    <td>Full name</td>
                    <td>{ selectedUser.first_name + " " + selectedUser.last_name }</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{ selectedUser.email }</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{ selectedUser.address }</td>
                  </tr>
                <tr>
                    <td>City</td>
                    <td>{ selectedUser.city }</td>
                  </tr>
                  <tr>
                    <td>Zip code</td>
                    <td>{ selectedUser.zip_code }</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xs lg="6">
            <Card>
              <Card.Header className="text-center">Power Management</Card.Header>
              <ListGroup>
                <ListGroup.Item>
                  <Card.Text className="text-center" as="h5">
                    Your SureFire Electrics SuperTurbine™ is currently
                    {simCond.net >= 0 ? " over-producing " : " under-producing "}
                    with a net production of:
                  </Card.Text>
                  { simCond.net > 0 ?
                    <Card.Text className="text-center" as="h3" style={{ color: 'green' }}>
                      {simCond.net} kWh!
                    </Card.Text>
                    :
                    <Card.Text className="text-center" as="h3" style={{ color: 'red' }}>
                      {simCond.net} kWh!
                    </Card.Text>
                  }
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Text className="text-center" as="h5">
                    SureFire Electrics PowerBuffer™ capacity
                  </Card.Text>
                  <ProgressBar now={simCond.bc} min={0} max={13.5} label={simCond.bc + " kWh"}
                               style={{height: 50}} animated/>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form>
                    <Form.Label>
                      In the case of excessive production,
                      choose the amount of excessive power that should be stored in your
                      Surefire Electric PowerBuffer™.
                      The remaining power will be sold on the market.
                    </Form.Label>
                    <Form.Range value={storing} min={0} max={100} step={1}
                                onChange={(e) => {
                                  setStoring(e.target.value)
                                  handleUpdateRatios(e)
                                }}
                                variant="secondary"/>
                  </Form>
                  <Card.Text className="text-center">
                    Current storing {storing}%
                    { simCond.net > 0 ? " (" + (Math.round((
                      simCond.net * (storing / 100)) * 1000) / 1000) + " kWh) " : " " }
                    of excessive production.
                  </Card.Text>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form>
                    <Form.Label>
                      In the case of under-production,
                      choose the amount of power that should be taken from your Surefire Electric
                      PowerBuffer™. The remaining power will be bought from the market at the
                      given market price.
                    </Form.Label>
                    <Form.Range value={using} min={0} max={100} step={1}
                                onChange={(e) => {
                                  setUsing(e.target.value)
                                  handleUpdateRatios(e)
                                }}
                                variant="secondary"/>
                  </Form>
                  <Card.Text className="text-center">
                    Current using {using}%
                    { simCond.net < 0 ? " (" + (Math.abs(Math.round((
                      simCond.net * (using / 100)) * 1000) / 1000)) + " kWh) "  : " " }
                    of stored power.
                  </Card.Text>
                </ListGroup.Item>
              </ListGroup>
            </Card>
            <Row className="justify-content-center" style={{ marginTop: 30 }}>
              <Button style={{ width: 150, height: 50, margin: 10 }} variant="primary" onClick={() => {
                                                setSelectedUser(null)
                                              }} >
              Back
            </Button>
            <Button style={{ width: 150, height: 50, margin: 10 }} variant="warning" onClick={handleResetSimulation} >
              Reset Simulation
            </Button>
            <Button style={{ width: 150, height: 50, margin: 10 }} variant="danger" onClick={handleDeleteAccount} >
              Delete Account
            </Button>
          </Row>
          </Col>
        </Row>
      </Container>
      }
    </Container>
  );
}