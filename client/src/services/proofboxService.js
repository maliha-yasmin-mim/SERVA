import apiClient from './apiClient';

export const proofboxService = {
  getProofByJobId: async (jobId) => {
    const res = await apiClient.get(`/proofbox/job/${jobId}`);
    return res.data;
  },

  updateChecklistItem: async (proofId, itemId, isCompleted) => {
    const res = await apiClient.patch(`/proofbox/${proofId}/checklist`, { itemId, isCompleted });
    return res.data.checklist;
  },

  addChecklistItem: async (proofId, itemData) => {
    const res = await apiClient.post(`/proofbox/${proofId}/checklist`, itemData);
    return res.data.checklist;
  },

  uploadProofMedia: async (proofId, formData) => {
    const res = await apiClient.post(`/proofbox/${proofId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  addProgressUpdate: async (proofId, data) => {
    const res = await apiClient.post(`/proofbox/${proofId}/progress`, data);
    return res.data.progressUpdates;
  },

  submitForApproval: async (proofId) => {
    const res = await apiClient.post(`/proofbox/${proofId}/submit`);
    return res.data;
  },

  clientApprovalAction: async (proofId, data) => {
    const res = await apiClient.post(`/proofbox/${proofId}/approval`, data);
    return res.data;
  },

  getReportPdfUrl: (proofId) => {
    return `/api/proofbox/${proofId}/report.pdf`;
  }
};

export default proofboxService;
