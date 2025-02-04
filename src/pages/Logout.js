import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/apiService'; 
import { getToken } from '../utils/authUtils';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const token = getToken();
        const data = await logout('/logout',token);
        localStorage.removeItem('Authorization'); 
        
        window.location.href='/login'
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    handleLogout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
