import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../apiService';
import { Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../logo.svg'; 

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Arial, sans-serif';
`;

const Logo = styled.img`
  width: 100px;
  margin-bottom: 20px;
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

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await postData('forgot-password',{}, {
        email,
        password,
      });
      const { access_token } = response.data;

      setUser({ email, token: access_token });
      localStorage.setItem('Authorization', access_token);
      console.log('MESSAGE',response.data)
     
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError('Invalid email or password');
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
          
          <Button type="submit">Forgot Password</Button>
        </form>
        <LinkText>
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            Login?
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
