import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Vérifier si le lien est actif
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          M-Motors
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
            Accueil
          </Link>
          
          {!isAuthenticated ? (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-button login">
                Connexion
              </Link>
              <Link to="/signup" className="navbar-button signup">
                Inscription
              </Link>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link 
                to="/dashboard" 
                className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
              >
                Profil
              </Link>
              <button 
                onClick={handleLogout} 
                className="navbar-button signup"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 