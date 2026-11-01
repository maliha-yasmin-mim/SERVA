import apiClient from './apiClient';

export const serviceService = {
  getServices: async (params) => {
    const res = await apiClient.get('/services', { params });
    return res.data;
  },

  getServiceById: async (id) => {
    const res = await apiClient.get(`/services/${id}`);
    return res.data.service;
  },

  createService: async (serviceData) => {
    const res = await apiClient.post('/services', serviceData);
    return res.data.service;
  },

  updateService: async (id, serviceData) => {
    const res = await apiClient.put(`/services/${id}`, serviceData);
    return res.data.service;
  },

  deleteService: async (id) => {
    const res = await apiClient.delete(`/services/${id}`);
    return res.data;
  },

  getMyServices: async () => {
    const res = await apiClient.get('/services/my');
    return res.data.services;
  },

  // Quotes
  requestQuote: async (data) => {
    const res = await apiClient.post('/quotes', data);
    return res.data.quote;
  },

  getMySentQuotes: async () => {
    const res = await apiClient.get('/quotes/my-requests');
    return res.data.quotes;
  },

  getIncomingQuotes: async () => {
    const res = await apiClient.get('/quotes/incoming');
    return res.data.quotes;
  },

  respondQuote: async (id, data) => {
    const res = await apiClient.patch(`/quotes/${id}/respond`, data);
    return res.data.quote;
  }
};

export default serviceService;
