import apiClient from './apiClient';

export const authService = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    localStorage.setItem('serva_user', JSON.stringify(res.data.user));
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    localStorage.setItem('serva_user', JSON.stringify(res.data.user));
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data.user;
  },

  updateProfile: async (data) => {
    const res = await apiClient.put('/auth/profile', data);
    localStorage.setItem('serva_user', JSON.stringify(res.data.user));
    return res.data.user;
  },

  updateAvailability: async (data) => {
    const res = await apiClient.put('/auth/availability', data);
    return res.data;
  },

  submitVerification: async (formData) => {
    const res = await apiClient.post('/auth/verify-submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('serva_user');
  }
};
