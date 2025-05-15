import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { getAuthToken } from './auth-actions';

/**
 * Get GitHub analytics for the current user or a specific user
 * @param {string} userId - Optional user ID for admin/mentor access
 * @returns {Promise} - GitHub analytics data
 */
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

/**
 * Force refresh of GitHub analytics data
 * @returns {Promise} - Updated GitHub analytics data
 */
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

/**
 * Disconnect GitHub account from OpenElevate
 * @returns {Promise} - Disconnection result
 */
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

/**
 * Get GitHub user profile data
 * @returns {Promise} - GitHub user profile data
 */
export const getGitHubProfile = () => {
  return getGitHubAnalytics().then(data => data.profileData);
};

/**
 * Get GitHub repositories data
 * @returns {Promise} - GitHub repositories data
 */
export const getGitHubRepositories = () => {
  return getGitHubAnalytics().then(data => data.repositories);
};

/**
 * Get GitHub contributions data
 * @returns {Promise} - GitHub contributions data
 */
export const getGitHubContributions = () => {
  return getGitHubAnalytics().then(data => data.contributions);
};

/**
 * Get GitHub pull requests data
 * @returns {Promise} - GitHub pull requests data
 */
export const getGitHubPullRequests = () => {
  return getGitHubAnalytics().then(data => data.pullRequests);
};

/**
 * Get GitHub issues data
 * @returns {Promise} - GitHub issues data
 */
export const getGitHubIssues = () => {
  return getGitHubAnalytics().then(data => data.issues);
};

/**
 * Get GitHub stars data
 * @returns {Promise} - GitHub stars data
 */
export const getGitHubStars = () => {
  return getGitHubAnalytics().then(data => data.stars);
};
