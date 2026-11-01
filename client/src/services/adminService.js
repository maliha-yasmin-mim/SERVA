import apiClient from './apiClient';

export const adminService = {
  getOverview: async () => {
    const res = await apiClient.get('/admin/overview');
    return res.data;
  },

  getUsers: async (params) => {
    const res = await apiClient.get('/admin/users', { params });
    return res.data;
  },

  getVerifications: async () => {
    const res = await apiClient.get('/admin/verifications');
    return res.data.users;
  },

  getVerificationDocument: async (userId) => {
    const res = await apiClient.get(`/admin/verifications/${userId}/document`, {
      responseType: 'blob'
    });
    return res.data;
  },

  reviewVerification: async (userId, data) => {
    const res = await apiClient.patch(`/admin/verifications/${userId}`, data);
    return res.data.user;
  },

  getReports: async () => {
    const res = await apiClient.get('/admin/reports');
    return res.data.reports;
  },

  resolveReport: async (id, data) => {
    const res = await apiClient.patch(`/admin/reports/${id}`, data);
    return res.data.report;
  },

  getAuditLogs: async (params) => {
    const res = await apiClient.get('/admin/audit-logs', { params });
    return res.data.logs;
  }
};
