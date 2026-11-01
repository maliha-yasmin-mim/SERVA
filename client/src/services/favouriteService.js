import apiClient from './apiClient';

export const favouriteService = {
  // Toggle favourite
  toggleFavourite: async (postId, postType) => {
    const res = await apiClient.post('/favourites/toggle', { postId, postType });
    return res.data;
  },

  // Get all user favourites
  getMyFavourites: async (params = {}) => {
    const res = await apiClient.get('/favourites', { params });
    return res.data;
  },

  // Get map of favorited IDs
  getMyFavouriteIds: async () => {
    const res = await apiClient.get('/favourites/ids');
    return res.data;
  },

  // Remove favourite by record ID
  removeFavourite: async (id) => {
    const res = await apiClient.delete(`/favourites/${id}`);
    return res.data;
  }
};

export default favouriteService;

