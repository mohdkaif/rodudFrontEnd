import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavBar from './pages/NavBar';
import TruckRequestForm from './pages/TruckRequestForm';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      setUser({ token });
    }
  }, []);

  const addRequest = (request) => {
    setRequests(prevRequests => [...prevRequests, request]);
  };

  return (
    <Router>
      <NavBar user={user} />
      <Container className="mt-5 pt-4">
        <Routes>
          {user ? (
            <>
              <Route path="/truckRequestForm" element={<TruckRequestForm addRequest={addRequest} />} />
              <Route path="/dashboard" element={<Dashboard requests={requests} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/logout" element={<Logout setUser={setUser} />} />
              <Route path="/" element={<Home />} /> 
            </>
          ) : (
            <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<Home />} /> 
              <Route path="*" element={<Navigate to="/login" />} /> 
            </>
          )}
        </Routes>
      </Container>
      <ToastContainer />
    </Router>
  );
};

export default App;
