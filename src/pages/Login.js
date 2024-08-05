import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/images/logo.svg';
import { postData } from '../services/apiService';
import { useAuth } from '../context/AuthContext'; 

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial, sans-serif';
`;

const Logo = styled.img`
  width: 150px;
  margin-bottom: 30px;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #007bff;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await postData('login', { email, password });
      const { access_token, token_type } = response;

      if (access_token && token_type) {
        localStorage.setItem('Authorization', `${token_type} ${access_token}`);
        login({ token: access_token });
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      setError('Invalid email or password');
      toast.error('Invalid email or password');
    }
  };

  return (
    <Container>
      <Logo src={logo} alt="Logo" />
      <FormWrapper>
        <Title>Login</Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </form>
        <LinkText>
          <Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>
            Forgot Password?
          </Link>
        </LinkText>
        <LinkText>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </LinkText>
      </FormWrapper>
      <ToastContainer />
    </Container>
  );
};

export default Login;
