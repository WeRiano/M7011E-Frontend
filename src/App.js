import React from 'react'
import {Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavigationBar from './components/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Admin from './components/Admin'
import Profile from './components/Profile'
import PrivateRoute from './components/PrivateRoute'

import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <NavigationBar />
        <Routes>
          <Route path="/" exact element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin/></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App