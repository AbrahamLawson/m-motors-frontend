import api from './api';
import { API_ROUTES } from '../config/routes';

export const getAllDossiers = async () => {
  try {
    const response = await api.get(API_ROUTES.ADMIN.DOSSIERS.LIST);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers:', error);
    throw error;
  }
};

export const updateDossierStatus = async (dossierId, status) => {
  try {
    const response = await api.put(
      API_ROUTES.ADMIN.DOSSIERS.UPDATE_STATUS.replace(':id', dossierId),
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get(API_ROUTES.ADMIN.USERS.LIST);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(
      API_ROUTES.ADMIN.USERS.UPDATE_ROLE.replace(':id', userId),
      { role }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    throw error;
  }
};

export const sendNotification = async (userId, message) => {
  try {
    const response = await api.post(API_ROUTES.ADMIN.NOTIFICATIONS.SEND, {
      userId,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    throw error;
  }
}; 