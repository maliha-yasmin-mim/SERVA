import apiClient from './apiClient';

export const freeItemService = {
  getFreeItems: async (params) => {
    const res = await apiClient.get('/free-items', { params });
    return res.data;
  },

  getFreeItemById: async (id) => {
    const res = await apiClient.get(`/free-items/${id}`);
    return res.data.item;
  },

  createFreeItem: async (data) => {
    const res = await apiClient.post('/free-items', data);
    return res.data.item;
  },

  requestFreeItem: async (id, note) => {
    const res = await apiClient.post(`/free-items/${id}/request`, { note });
    return res.data;
  },

  updateFreeItemStatus: async (id, status, recipientId) => {
    const res = await apiClient.patch(`/free-items/${id}/status`, { status, recipientId });
    return res.data.item;
  },

  getMyFreeItems: async () => {
    const res = await apiClient.get('/free-items/my');
    return res.data.items;
  }
};

export default freeItemService;
