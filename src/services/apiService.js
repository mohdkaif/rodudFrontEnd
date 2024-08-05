// apiService.js
import axios from 'axios';
import config from '../config';

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


export const profileGet = async (endpoint, token) => {
  try {
    // Ensure token is a string and not undefined
    if (typeof token !== 'string' || !token.trim()) {
      throw new Error('Invalid token');
    }

    const response = await api.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the response data directly
    return response.data;
  } catch (error) {
    // Log the error and rethrow it for further handling
    console.error('Error fetching data:', error.message || error);
    // Optionally, handle different status codes or error types
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};


// api.js

// export const profileGet = async (endpoint, token) => {
//   try {
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Failed to fetch data:', error);
//     throw error; // Re-throw the error to be caught in the calling component
//   }
// };


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



export const postData = async (endpoint, payload, headers = {}) => {
  try {
    // Add Authorization header if token is available
    const token = localStorage.getItem('Authorization');
    if (token) {
      headers['Authorization'] = token;
    }

    // Perform the POST request
    const response = await api.post(endpoint, payload, { headers });

    // Log the response data for debugging
    console.log('Response:', response.data);

    // Return the response data
    return response.data;
  } catch (error) {
    // Log the error with additional information
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
    } else {
      console.error('Error Message:', error.message);
    }

    // Optionally rethrow the error to be handled by the calling function
    throw error;
  }
};

