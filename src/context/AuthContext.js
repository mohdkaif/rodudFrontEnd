// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = ({ token }) => {
    // Implement login logic, e.g., set user and save token
    setUser({ token }); // Simplified example
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('Authorization');
  };

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      // Simulate fetching user from token
      setUser({ token }); // Simplified example
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
