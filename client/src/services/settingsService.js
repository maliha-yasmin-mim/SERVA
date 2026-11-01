import apiClient from './apiClient';

export const settingsService = {
  // Public settings
  getPublicSettings: async () => {
    const res = await apiClient.get('/settings/public');
    return res.data;
  },

  // Admin: Get all settings
  getAdminSettings: async () => {
    const res = await apiClient.get('/settings/admin');
    return res.data;
  },

  // Admin: Upload logo or favicon
  uploadAsset: async (formData) => {
    const res = await apiClient.post('/settings/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Admin: Verify password and save settings
  verifyAndSave: async (password, settingsData) => {
    const res = await apiClient.post('/settings/admin/verify-and-save', {
      password,
      settingsData
    });
    return res.data;
  }
};

export default settingsService;

