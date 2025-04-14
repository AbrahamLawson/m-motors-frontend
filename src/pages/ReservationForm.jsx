import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import axios from 'axios';

const API_BASE = "http://localhost:8000";

const ReservationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    contractType: '',
    additionalInfo: '',
    documents: []
  });

  useEffect(() => {
    // Récupérer les détails du véhicule
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/vehicules/${id}`);
        setVehicle(response.data);
        
        // Extraire les paramètres de l'URL
        const searchParams = new URLSearchParams(location.search);
        const startDate = searchParams.get('startDate') || '';
        const endDate = searchParams.get('endDate') || '';
        
        // Mettre à jour les données du formulaire
        setFormData(prev => ({
          ...prev,
          startDate,
          endDate,
          contractType: response.data.contract_type
        }));
        
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement du véhicule:", err);
        setError("Impossible de charger les détails de ce véhicule.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      documents: e.target.files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: location, message: "Veuillez vous connecter pour réserver un véhicule" } });
      return;
    }
    
    try {
      setLoading(true);
      
      // Préparer les données à envoyer
      const formDataToSend = new FormData();
      formDataToSend.append('vehicule_id', id);
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('start_date', formData.startDate);
      
      // Si c'est une location, ajouter la date de fin
      if (vehicle.contract_type === "LOCATION") {
        formDataToSend.append('end_date', formData.endDate);
        formDataToSend.append('is_rental', 'true');
      } else {
        formDataToSend.append('is_rental', 'false');
      }
      
      // Ajouter les informations supplémentaires
      formDataToSend.append('additional_info', formData.additionalInfo);
      
      // Ajouter les documents
      if (formData.documents.length > 0) {
        Array.from(formData.documents).forEach(doc => {
          formDataToSend.append('documents', doc);
        });
      }
      
      // Envoyer la demande
      await api.post('/reservations/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      // Rediriger vers le dashboard après succès
      navigate('/dashboard', { 
        state: { 
          success: true, 
          message: vehicle.contract_type === "ACHAT" 
            ? "Votre demande d'achat a été enregistrée avec succès" 
            : "Votre réservation a été effectuée avec succès"
        }
      });
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      setError("Une erreur est survenue lors de la soumission. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {vehicle?.contract_type === "ACHAT" ? "Demande d'achat" : "Réservation"}
          </h2>
          
          {/* Détails du véhicule */}
          {vehicle && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-gray-600">Année: {vehicle.year} - {vehicle.kilometers} km</p>
              <p className="font-medium mt-2">
                {vehicle.contract_type === "ACHAT" 
                  ? `Prix d'achat: ${vehicle.sell_price} €` 
                  : `Prix de location: ${vehicle.location_price} €/jour`}
              </p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dates pour la location */}
            {vehicle?.contract_type === "LOCATION" && (
              <>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {/* Documents requis */}
            <div>
              <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                Documents requis
              </label>
              <p className="text-xs text-gray-500 mb-2">
                {vehicle?.contract_type === "ACHAT" 
                  ? "Pièce d'identité, justificatif de domicile" 
                  : "Pièce d'identité, permis de conduire, justificatif de domicile"}
              </p>
              <input
                type="file"
                name="documents"
                id="documents"
                multiple
                required
                onChange={handleFileChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-700"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="mt-1 text-xs text-gray-500">Formats acceptés: PDF, JPG, PNG</p>
            </div>

            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                Informations supplémentaires
              </label>
              <textarea
                name="additionalInfo"
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Précisez ici toute information complémentaire concernant votre demande..."
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Traitement en cours...' : vehicle?.contract_type === "ACHAT" ? 'Soumettre la demande d\'achat' : 'Confirmer la réservation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
