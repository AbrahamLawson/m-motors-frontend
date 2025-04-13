import api from './api';
import { API_ROUTES } from '../config/routes';

export const reservationService = {
  getAll: async () => {
    const response = await api.get(API_ROUTES.RESERVATIONS.LIST);
    return response.data;
  },

  create: async (reservationData) => {
    const response = await api.post(API_ROUTES.RESERVATIONS.CREATE, reservationData);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(API_ROUTES.RESERVATIONS.DETAIL.replace(':reservation_id', id));
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(
      API_ROUTES.RESERVATIONS.UPDATE_STATUS.replace(':reservation_id', id),
      { status },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  },

  getUserReservations: async (userId) => {
    const response = await api.get(`/reservations/user/${userId}`);
    return response.data;
  },

  uploadDocuments: async (reservationId, documents) => {
    const formData = new FormData();
    documents.forEach(doc => {
      formData.append('documents', doc);
    });

    const response = await api.post(
      `/reservations/${reservationId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getReservationDocuments: async (reservationId) => {
    const response = await api.get(`/reservations/${reservationId}/documents`);
    return response.data;
  }
};