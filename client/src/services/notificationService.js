import apiClient from './apiClient';

export const notificationService = {
  getMyNotifications: async () => {
    const res = await apiClient.get('/notifications');
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data.notification;
  },

  markAllAsRead: async () => {
    const res = await apiClient.patch('/notifications/read-all');
    return res.data;
  }
};
