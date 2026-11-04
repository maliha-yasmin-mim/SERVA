import axios from 'axios';

// Dynamically determine the API base URL from environment variables or default to relative '/api'
const rawApiUrl = (import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || '').trim();
const baseURL = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`)
  : '/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    // Automatically attach Bearer token if user is signed in
    const token = localStorage.getItem('serva_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('serva_token');
        localStorage.removeItem('serva_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
