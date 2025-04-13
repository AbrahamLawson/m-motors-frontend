import api from './api';

export const filterService = {
  getFilteredVehicles: async (filters) => {
    const response = await api.get('/vehicles/filter', { params: filters });
    return response.data;
  },

  getAvailableVehicles: async (startDate, endDate) => {
    const response = await api.get('/vehicles/available', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  getVehiclesByType: async (type) => {
    // type peut être 'rent' ou 'buy'
    const response = await api.get(`/vehicles/type/${type}`);
    return response.data;
  },

  getPriceRange: async () => {
    const response = await api.get('/vehicles/price-range');
    return response.data;
  }
};