import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDossiers, getReservations, uploadDossier } from '../services/dossierService';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dossiersData, reservationsData] = await Promise.all([
        getDossiers(),
        getReservations()
      ]);
      setDossiers(dossiersData);
      setReservations(reservationsData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', user.id);

      await uploadDossier(formData);
      await fetchData();
      setSelectedFile(null);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'upload du dossier');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Afficher le nom de l'utilisateur en tenant compte des différentes structures possibles
  const userName = () => {
    if (user) {
      // Priorité au prénom seulement (first_name)
      if (user.first_name) {
        return user.first_name;
      } 
      // Sinon firstName
      else if (user.firstName) {
        return user.firstName;
      }
      // Essayer de prendre le début de l'email comme nom d'utilisateur
      else if (user.email) {
        const username = user.email.split('@')[0];
        return username;
      } 
      // En dernier recours
      else {
        return "utilisateur";
      }
    }
    return "utilisateur";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Bienvenue, {userName()}
        </h1>
        <p className="dashboard-email">Email: {user?.email || 'Non disponible'}</p>
      </div>

      {/* Section Upload de Dossier */}
      <div className="dashboard-section">
        <h2 className="section-title">
          Déposer un nouveau dossier
        </h2>
        <form onSubmit={handleUpload} className="upload-form">
          <div>
            <label className="file-input-label">
              Sélectionner un fichier PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className="dashboard-button"
          >
            {loading ? 'Upload en cours...' : 'Uploader le dossier'}
          </button>
        </form>
      </div>

      {/* Section Dossiers */}
      <div className="dashboard-section">
        <h2 className="section-title">
          Mes dossiers
        </h2>
        {dossiers.length === 0 ? (
          <p className="empty-message">Aucun dossier déposé</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dossiers.map((dossier) => (
                  <tr key={dossier.id}>
                    <td>
                      {new Date(dossier.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        dossier.status === 'approved' ? 'status-approved' :
                        dossier.status === 'pending' ? 'status-pending' :
                        'status-rejected'
                      }`}>
                        {dossier.status}
                      </span>
                    </td>
                    <td>
                      <a
                        href={dossier.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dashboard-link"
                      >
                        Voir le dossier
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section Réservations */}
      <div className="dashboard-section">
        <h2 className="section-title">
          Mes réservations
        </h2>
        {reservations.length === 0 ? (
          <p className="empty-message">Aucune réservation</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Véhicule</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      {reservation.vehicle.model}
                    </td>
                    <td>
                      {new Date(reservation.startDate).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(reservation.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        reservation.status === 'confirmed' ? 'status-confirmed' :
                        reservation.status === 'pending' ? 'status-pending' :
                        'status-cancelled'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
