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
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/user/profile');
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur:', err);
      setError('Impossible de charger les données utilisateur');
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return true;
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.response?.data?.message || 'Erreur de connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
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
