import api from './api';
import { API_ROUTES } from '../config/routes';

export const authService = {
  login: async (email, password) => {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, { 
      username: email, 
      password: password 
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(API_ROUTES.AUTH.REGISTER, userData);
    return response.data;
  },

  verifyToken: async () => {
    try {
      const response = await api.get(API_ROUTES.AUTH.VERIFY);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getProfile: async () => {
    const response = await api.get(API_ROUTES.AUTH.PROFILE);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
