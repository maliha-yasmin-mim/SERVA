import apiClient from './apiClient';

export const productService = {
  getProducts: async (params) => {
    const res = await apiClient.get('/products', { params });
    return res.data;
  },

  getProductById: async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.product;
  },

  createProduct: async (data) => {
    const res = await apiClient.post('/products', data);
    return res.data.product;
  },

  updateProductStatus: async (id, status, buyerId) => {
    const res = await apiClient.patch(`/products/${id}/status`, { status, buyerId });
    return res.data.product;
  },

  deleteProduct: async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },

  getMyProducts: async () => {
    const res = await apiClient.get('/products/my');
    return res.data.products;
  }
};

export default productService;
