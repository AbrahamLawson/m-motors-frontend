import React, { useState, useEffect } from 'react';
import { reservationService } from '../../services/reservationService';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getAllReservations();
      setReservations(data);
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await reservationService.updateReservationStatus(reservationId, newStatus);
      loadReservations(); // Recharger la liste après la mise à jour
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'refused':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Gestion des Réservations</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Véhicule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.user_email}</div>
                  <div className="text-sm text-gray-500">{reservation.user_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.vehicule_name}</div>
                  <div className="text-sm text-gray-500">
                    {reservation.contract_type === 'rent' ? 'Location' : 'Achat'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{new Date(reservation.start_date).toLocaleDateString()}</div>
                  {reservation.end_date && (
                    <div>- {new Date(reservation.end_date).toLocaleDateString()}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={reservation.status}
                    onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="in_progress">En cours</option>
                    <option value="accepted">Accepté</option>
                    <option value="refused">Refusé</option>
                  </select>
                  <button
                    onClick={() => window.open(`/reservations/${reservation.id}/documents`, '_blank')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    Voir documents
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}