import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pourriez implémenter la logique pour mettre à jour les informations du profil
    console.log("Données du profil à mettre à jour:", formData);
    
    // Simuler une mise à jour réussie
    setTimeout(() => {
      setIsEditing(false);
      alert("Profil mis à jour avec succès !");
    }, 1000);
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Profil non disponible</h1>
          <p>Veuillez vous connecter pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">Mon Profil</h1>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="edit-button"
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="first_name">Prénom</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Nom</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
              <small>L'email ne peut pas être modifié</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="save-button">
              Enregistrer les modifications
            </button>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <span className="info-label">Prénom</span>
              <span className="info-value">{user.first_name || 'Non renseigné'}</span>
            </div>

            <div className="info-group">
              <span className="info-label">Nom</span>
              <span className="info-value">{user.last_name || 'Non renseigné'}</span>
            </div>

            <div className="info-group">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>

            <div className="info-group">
              <span className="info-label">Téléphone</span>
              <span className="info-value">{user.phone || 'Non renseigné'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
