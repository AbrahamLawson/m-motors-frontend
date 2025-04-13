import api from './api';

export const getDossiers = async () => {
  try {
    const response = await api.get('/api/dossiers');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers:', error);
    throw error;
  }
};

export const getReservations = async () => {
  try {
    const response = await api.get('/api/reservations');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    throw error;
  }
};

export const uploadDossier = async (formData) => {
  try {
    const response = await api.post('/api/dossiers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'upload du dossier:', error);
    throw error;
  }
};

export const getDossierStatus = async (dossierId) => {
  try {
    const response = await api.get(`/api/dossiers/${dossierId}/status`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du statut du dossier:', error);
    throw error;
  }
}; 