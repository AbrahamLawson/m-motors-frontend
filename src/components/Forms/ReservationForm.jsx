import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../../services/reservationService';

export default function ReservationForm({ vehicleId, contractType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    documents: [],
    message: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('vehicule_id', vehicleId);
      formDataToSend.append('start_date', formData.startDate);
      if (contractType === 'rent') {
        formDataToSend.append('end_date', formData.endDate);
      }
      formDataToSend.append('message', formData.message);
      
      Array.from(formData.documents).forEach(doc => {
        formDataToSend.append('documents', doc);
      });

      await reservationService.createReservation(formDataToSend);
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">
        {contractType === 'rent' ? 'Réserver ce véhicule' : 'Demande d\'achat'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de début
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        {contractType === 'rent' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de fin
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Documents justificatifs
            <input
              type="file"
              onChange={(e) => setFormData({...formData, documents: e.target.files})}
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Formats acceptés : PDF, JPG, PNG
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message (optionnel)
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
      </button>
    </form>
  );
}