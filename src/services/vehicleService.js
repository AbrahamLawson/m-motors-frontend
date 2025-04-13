import api from './api';
import { API_ROUTES } from '../config/routes';

export const vehicleService = {
  getAll: async () => {
    const response = await api.get(API_ROUTES.VEHICLES.LIST);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(API_ROUTES.VEHICLES.DETAIL.replace(':vehicule_id', id));
    return response.data;
  },

  create: async (vehicleData) => {
    const response = await api.post(API_ROUTES.VEHICLES.CREATE, vehicleData);
    return response.data;
  },

  update: async (id, vehicleData) => {
    const response = await api.put(
      API_ROUTES.VEHICLES.UPDATE.replace(':vehicule_id', id),
      vehicleData
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(API_ROUTES.VEHICLES.DELETE.replace(':vehicule_id', id));
    return response.data;
  }
};