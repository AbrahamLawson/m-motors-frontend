import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Méthode spécifique pour les requêtes OAuth2
api.oauth = async (url, data) => {
  try {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      params.append(key, value);
    });

    const response = await axios({
      method: 'post',
      url: `${api.defaults.baseURL}${url}`,
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;