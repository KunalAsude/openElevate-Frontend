import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Save auth credentials to localStorage
export const saveAuthCredentials = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
};

// Redirect to GitHub OAuth login
export const loginWithGithub = () => {
  if (typeof window !== 'undefined') {
    window.location.href = `${API_BASE_URL}/auth/github`;
  }
};

// Redirect to Google OAuth login
export const loginWithGoogle = () => {
  if (typeof window !== 'undefined') {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Get auth token from localStorage
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Logout user by clearing localStorage
export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};


export const registerUser = async (userData) => {
  console.log("Registering user:", userData)
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: 'No response from server. Please try again later.' };
    } else {
      throw { success: false, message: error.message || 'An unexpected error occurred' };
    }
  }
}

export const loginUser = async (credentials) => {
  console.log("Logging in user:", credentials)
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: 'No response from server. Please try again later.' };
    } else {
      throw { success: false, message: error.message || 'An unexpected error occurred' };
    }
  }
}