import apiClient from './apiClient';

export const jobService = {
  getJobs: async (params) => {
    const res = await apiClient.get('/jobs', { params });
    return res.data;
  },

  getJobById: async (id) => {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data.job;
  },

  createJob: async (jobData) => {
    const res = await apiClient.post('/jobs', jobData);
    return res.data.job;
  },

  updateJob: async (id, jobData) => {
    const res = await apiClient.put(`/jobs/${id}`, jobData);
    return res.data.job;
  },

  updateJobStatus: async (id, status) => {
    const res = await apiClient.patch(`/jobs/${id}/status`, { status });
    return res.data.job;
  },

  deleteJob: async (id) => {
    const res = await apiClient.delete(`/jobs/${id}`);
    return res.data;
  },

  getMyPostedJobs: async () => {
    const res = await apiClient.get('/jobs/my/posted');
    return res.data.jobs;
  },

  getMyAssignedJobs: async () => {
    const res = await apiClient.get('/jobs/my/assigned');
    return res.data.jobs;
  },

  toggleSaveJob: async (id) => {
    const res = await apiClient.post(`/jobs/${id}/save`);
    return res.data;
  },

  // Applications
  applyForJob: async (jobId, formData) => {
    const res = await apiClient.post(`/applications/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.application;
  },

  getApplicationsForJob: async (jobId) => {
    const res = await apiClient.get(`/applications/job/${jobId}`);
    return res.data.applications;
  },

  getMyApplications: async () => {
    const res = await apiClient.get('/applications/my');
    return res.data.applications;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const res = await apiClient.patch(`/applications/${applicationId}/status`, { status });
    return res.data;
  }
};

export default jobService;
