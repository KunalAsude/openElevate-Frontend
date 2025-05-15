import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { Octokit } from '@octokit/rest';

// Initialize Octokit for GitHub API calls
const octokit = new Octokit();

// Fetch trending projects from GitHub
export const fetchTrendingProjects = async (language = '', since = 'daily') => {
  try {
    // In a real app, you might have your own backend API for this
    // For now, we'll directly use GitHub's search API
    const response = await octokit.search.repos({
      q: `stars:>100 ${language ? `language:${language}` : ''}`,
      sort: 'stars',
      order: 'desc',
      per_page: 20
    });

    return response.data.items.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      language: repo.language,
      tags: [repo.language].filter(Boolean),
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
        url: repo.owner.html_url
      },
      createdAt: repo.created_at,
      updatedAt: repo.updated_at
    }));
  } catch (error) {
    console.error('Error fetching trending projects:', error);
    throw error;
  }
};

// Fetch project details from our backend
export const fetchProjectDetails = async (fullName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${fullName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

// Fetch project recommendations based on user skills
export const fetchRecommendedProjects = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/recommended?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended projects:', error);
    // Fallback to trending projects if recommendation fails
    return fetchTrendingProjects();
  }
};

// Search projects by query
export const searchProjects = async (query, filters = {}) => {
  try {
    const { language, minStars, maxIssues, tags } = filters;
    
    let q = query;
    if (language) q += ` language:${language}`;
    if (minStars) q += ` stars:>=${minStars}`;
    if (maxIssues) q += ` issues:<=${maxIssues}`;
    
    const response = await octokit.search.repos({
      q,
      sort: 'stars',
      order: 'desc',
      per_page: 20
    });

    return response.data.items.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      language: repo.language,
      tags: [repo.language].filter(Boolean),
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
        url: repo.owner.html_url
      },
      createdAt: repo.created_at,
      updatedAt: repo.updated_at
    }));
  } catch (error) {
    console.error('Error searching projects:', error);
    throw error;
  }
};
