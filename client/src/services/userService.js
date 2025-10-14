import api from './api';

const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  getTechnicians: async () => {
    try {
      const response = await api.get('/users/technicians');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch technicians' };
    }
  }
};

export default userService;
