import api from './api';
import { API_ROUTES } from '../config/routes';

export const getDossiers = async () => {
  try {
    const response = await api.get(API_ROUTES.DOSSIERS.LIST);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers:', error);
    throw error;
  }
};

export const getReservations = async () => {
  try {
    const response = await api.get(API_ROUTES.RESERVATIONS.LIST);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    throw error;
  }
};

export const uploadDossier = async (formData) => {
  try {
    const response = await api.post(API_ROUTES.DOSSIERS.UPLOAD, formData, {
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
    const response = await api.get(API_ROUTES.DOSSIERS.STATUS.replace(':id', dossierId));
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du statut du dossier:', error);
    throw error;
  }
}; 