import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAllDossiers,
  updateDossierStatus,
  getAllUsers,
  updateUserRole,
  sendNotification
} from '../services/adminService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dossiersData, usersData] = await Promise.all([
        getAllDossiers(),
        getAllUsers()
      ]);
      setDossiers(dossiersData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (dossierId, newStatus) => {
    try {
      setLoading(true);
      await updateDossierStatus(dossierId, newStatus);
      await fetchData();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      await updateUserRole(userId, newRole);
      await fetchData();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du rôle');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (userId) => {
    if (!notificationMessage.trim()) return;

    try {
      setLoading(true);
      await sendNotification(userId, notificationMessage);
      setNotificationMessage('');
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'envoi de la notification');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Tableau de bord administrateur
          </h1>
          <p className="text-gray-600">Connecté en tant que: {user.email}</p>
        </div>

        {/* Section Dossiers */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des dossiers
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                {dossiers.map((dossier) => (
                  <tr key={dossier.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dossier.user.firstName} {dossier.user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(dossier.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={dossier.status}
                        onChange={(e) => handleStatusChange(dossier.id, e.target.value)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${dossier.status === 'approved' ? 'bg-green-100 text-green-800' :
                            dossier.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvé</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setSelectedDossier(dossier)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Voir le dossier
                      </button>
                      <button
                        onClick={() => handleSendNotification(dossier.user.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Notifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Utilisateurs */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des utilisateurs
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleSendNotification(user.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Notifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de notification */}
        {selectedDossier && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Envoyer une notification
              </h3>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="w-full h-32 p-2 border rounded-md"
                placeholder="Entrez votre message..."
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedDossier(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    handleSendNotification(selectedDossier.user.id);
                    setSelectedDossier(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
