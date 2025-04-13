import api from './api';

export const reservationService = {
  createReservation: async (reservationData) => {
    const response = await api.post('/reservations/create', reservationData);
    return response.data;
  },

  getAllReservations: async () => {
    const response = await api.get('/reservations');
    return response.data;
  },

  getUserReservations: async (userId) => {
    const response = await api.get(`/reservations/user/${userId}`);
    return response.data;
  },

  getReservationById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  updateReservationStatus: async (id, status) => {
    const response = await api.patch(`/reservations/${id}/status`, { status });
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