import axios from 'axios';
import { API_BASE_URL } from '../constants';


/**
 * Service to handle all analytics-related API calls
 */
export const AnalyticsService = {
  /**
   * Get overall platform metrics
   */
  getPlatformMetrics: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/analytics/platform`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching platform metrics:', error);
      throw error;
    }
  },

  /**
   * Get dashboard summary data
   */
  getDashboardSummary: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  /**
   * Get user-specific analytics
   */
  getUserAnalytics: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/analytics/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  },

  /**
   * Get project analytics
   */
  getProjectAnalytics: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/analytics/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching project analytics:', error);
      throw error;
    }
  },

  /**
   * Get badge statistics
   */
  getBadgeStatistics: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/analytics/badges`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching badge statistics:', error);
      throw error;
    }
  },

  /**
   * Get contribution metrics
   */
  getContributionMetrics: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/analytics/contributions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contribution metrics:', error);
      throw error;
    }
  },

  /**
   * Get geographic data for visualizations
   */
  getGeographicData: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/analytics/geographic`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      throw error;
    }
  },

  /**
   * Refresh all analytics data
   */
  refreshAnalytics: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/analytics/refresh`,
        {},
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      if (error.response?.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      throw error;
    }
  }
};
