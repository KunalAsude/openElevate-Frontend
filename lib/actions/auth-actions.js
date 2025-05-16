import axios from 'axios';
import { API_BASE_URL } from '../constants';
import Cookies from 'js-cookie';

// Save auth credentials to localStorage and cookies
export const saveAuthCredentials = (data) => {
  if (typeof window !== 'undefined') {
    // Save to localStorage for client-side access
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Save to cookies for middleware access
    // Set auth token cookie with path and expiration (7 days)
    Cookies.set('authToken', data.token, { path: '/', expires: 7 });
  }
};

// Fetch current user profile data
export const fetchUserProfile = async () => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    return axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching user profile:', error);
      throw error;
    });
  }
  return Promise.reject('Cannot run in server environment');
};

// Redirect to GitHub OAuth login
export const loginWithGithub = () => {
  if (typeof window !== 'undefined') {
    // Use the proper backend endpoint for GitHub OAuth
    window.location.href = `${API_BASE_URL}/auth/github`;
  }
};

// Handle GitHub OAuth callback
export const handleGitHubCallback = (token) => {
  if (typeof window !== 'undefined' && token) {
    // Store the token in localStorage
    localStorage.setItem('authToken', token);
    
    // Fetch user info using the token
    return axios.get(`${API_BASE_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    })
    .catch(error => {
      console.error('Error fetching user after GitHub auth:', error);
      return null;
    });
  }
  return Promise.resolve(null);
};

// Get GitHub analytics
export const getGitHubAnalytics = (userId = null) => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    const endpoint = userId 
      ? `${API_BASE_URL}/github/analytics/${userId}` 
      : `${API_BASE_URL}/github/analytics`;
    
    return axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching GitHub analytics:', error);
      throw error;
    });
  }
  return Promise.reject('Cannot run in server environment');
};

// Refresh GitHub analytics
export const refreshGitHubAnalytics = () => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    return axios.post(`${API_BASE_URL}/github/analytics/refresh`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error refreshing GitHub analytics:', error);
      throw error;
    });
  }
  return Promise.reject('Cannot run in server environment');
};

// Disconnect GitHub account
export const disconnectGitHub = () => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    return axios.post(`${API_BASE_URL}/github/disconnect`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error disconnecting GitHub account:', error);
      throw error;
    });
  }
  return Promise.reject('Cannot run in server environment');
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

// Get auth token from localStorage and cookies
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || Cookies.get('authToken');
  }
  return null;
};

// Logout user by clearing localStorage and cookies
export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear cookies
    Cookies.remove('authToken', { path: '/' });
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

// Update user profile
export const updateUserProfile = async (profileData) => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    return axios.put(`${API_BASE_URL}/auth/update-profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (response.data.success && response.data.data) {
        // Update localStorage with updated user data
        localStorage.setItem('user', JSON.stringify(response.data.data));
        // Trigger storage event for cross-tab updates
        window.dispatchEvent(new Event('storage'));
      }
      return response.data;
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data) {
        throw error.response.data;
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please try again later.' };
      } else {
        throw { success: false, message: error.message || 'An unexpected error occurred' };
      }
    });
  }
  return Promise.reject('Cannot run in server environment');
};

// Change user password
export const changePassword = async (passwordData) => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    return axios.put(`${API_BASE_URL}/auth/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error changing password:', error);
      if (error.response && error.response.data) {
        throw error.response.data;
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please try again later.' };
      } else {
        throw { success: false, message: error.message || 'An unexpected error occurred' };
      }
    });
  }
  return Promise.reject('Cannot run in server environment');
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: 'No response from server. Please try again later.' };
    } else {
      throw { success: false, message: error.message || 'An unexpected error occurred' };
    }
  }
}

// Fetch application settings
export const fetchSettings = async () => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    return axios.get(`${API_BASE_URL}/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching settings:', error);
      throw error;
    });
  }
  return Promise.reject('Cannot run in server environment');
};

// Update user settings (for user-specific settings only)
export const updateUserSettings = async (settingsData) => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    return axios.put(`${API_BASE_URL}/users/settings`, settingsData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating user settings:', error);
      if (error.response && error.response.data) {
        throw error.response.data;
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please try again later.' };
      } else {
        throw { success: false, message: error.message || 'An unexpected error occurred' };
      }
    });
  }
  return Promise.reject('Cannot run in server environment');
}

// Fetch user analytics data
export const getUserAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) return Promise.reject('No authentication token found');
    
    return axios.get(`${API_BASE_URL}/users/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching user analytics:', error);
      if (error.response && error.response.data) {
        throw error.response.data;
      } else if (error.request) {
        throw { success: false, message: 'No response from server. Please try again later.' };
      } else {
        throw { success: false, message: error.message || 'An unexpected error occurred' };
      }
    });
  }
  return Promise.reject('Cannot run in server environment');
}