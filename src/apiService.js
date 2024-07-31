// apiService.js
import axios from 'axios';
import config from './config';

const api = axios.create({
  baseURL: config.apiEndpoint
});

export const getData = async (endpoint, token) => {
  try {
    const response = await api.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const logout = async (endpoint, token) => {
  try {
    const response = await api.post(endpoint, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};


export const postData = async (endpoint, headers={}, payload) => {
  try {
    const response = await api.post(endpoint, payload, { headers });
    console.log('Response:', response.data);
    return response.data; // Optionally return the response data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error; // Optionally rethrow the error
  }
};

// export default postData;
