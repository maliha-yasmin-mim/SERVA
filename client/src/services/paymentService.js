import apiClient from './apiClient';

const paymentService = {
  // Initiate payment (bKash / Nagad / Rocket / SSLCommerz / COD)
  initiatePayment: async (paymentData) => {
    const response = await apiClient.post('/payments/initiate', paymentData);
    return response.data;
  },

  // Get user's payment records
  getMyPayments: async (params = {}) => {
    const response = await apiClient.get('/payments/my-payments', { params });
    return response.data;
  },

  // Get single payment details
  getPaymentById: async (id) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  // Release escrow funds
  releaseEscrow: async (id) => {
    const response = await apiClient.post(`/payments/${id}/release-escrow`);
    return response.data;
  }
};

export default paymentService;

