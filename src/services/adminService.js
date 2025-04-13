import api from './api';

export const getAllDossiers = async () => {
  try {
    const response = await api.get('/api/admin/dossiers');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers:', error);
    throw error;
  }
};

export const updateDossierStatus = async (dossierId, status) => {
  try {
    const response = await api.put(`/api/admin/dossiers/${dossierId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/admin/users');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    throw error;
  }
};

export const sendNotification = async (userId, message) => {
  try {
    const response = await api.post('/api/admin/notifications', {
      userId,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    throw error;
  }
}; 