import React, {useContext, useState, useEffect} from 'react'

import { requestCreateAuthToken, requestDestroyAuthToken, requestCreateUser } from '../services/api/Backend'
import { loadUser, storeUser, loadToken } from '../services/Storage'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadUser())

  useEffect(() => {
    storeUser(currentUser)
  })

  async function signup(user) {
    let request = requestCreateUser(user)
    return await request
  }

  async function login(email, password) {
    let request = requestCreateAuthToken(email, password)
    let [success, data] = await request
    if (success) {
      let user = {}
      storeUser(user, data["auth_token"])
      setCurrentUser(user)
    }
    return success
  }

  async function logout() {
    let token = loadToken()
    if (token != null) {
      let request = requestDestroyAuthToken(token)
      const [success, data] = await request
    }
    setCurrentUser(null)
    storeUser(currentUser)
  }

  const value = {
    currentUser,
    setCurrentUser,
    signup,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}