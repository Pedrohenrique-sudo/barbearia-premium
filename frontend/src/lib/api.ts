import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só redireciona para login se NÃO for um modal (verifica se não é uma requisição silenciosa)
    if (error.response?.status === 401) {
      const isModalRequest = error.config?.url?.includes('appointments') || 
                            error.config?.url?.includes('clients');
      
      // Se for modal, apenas retorna o erro para o modal tratar
      if (isModalRequest) {
        return Promise.reject(error);
      }
      
      // Se for página principal, redireciona para login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
