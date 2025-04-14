import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const token = localStorage.getItem('token');
    if (token) {
      // Nous n'avons pas de route de profil, donc nous ne pouvons pas récupérer les données utilisateur
      // Nous allons simplement vérifier que le token existe et mettre un utilisateur générique
      setUser({ isLoggedIn: true });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Utiliser la méthode oauth pour les requêtes OAuth2
      const response = await api.oauth('/api/auth/login', {
        username: email,
        password: password
      });
      
      console.log('Réponse de login:', response.data);
      
      if (response.data) {
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        
        // Puisque nous n'avons pas d'informations détaillées sur l'utilisateur,
        // nous allons juste définir un utilisateur générique
        setUser({ 
          email: email,
          isLoggedIn: true
        });
        
        setError(null);
        return true;
      } else {
        setError('Réponse de connexion invalide');
        return false;
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      const errorMessage = typeof err.response?.data?.detail === 'string' 
        ? err.response.data.detail 
        : 'Erreur de connexion';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/signup', userData);
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      setUser(user || { 
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        isLoggedIn: true
      });
      setError(null);
      return true;
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.response?.data?.message || 'Erreur d\'inscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
