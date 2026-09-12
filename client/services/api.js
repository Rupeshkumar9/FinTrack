import axios from 'axios';

const getBaseURL = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || '/api';
  const clean = raw.replace(/\/+$/, '');
  if (clean === '/api' || clean.endsWith('/api')) {
    return clean;
  }
  return `${clean}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.clear();
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
