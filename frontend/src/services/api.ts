import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach appropriate auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Admin routes use token from localStorage (separate from regular user Firebase session)
    if (config.url?.startsWith('/apis/admin/')) {
      const adminToken = localStorage.getItem('admin_access_token');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
        return config;
      }
    }

    // Regular routes use Firebase Auth token
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      let detail = error.response.data?.detail;
      if (Array.isArray(detail)) {
        detail = detail.map((e: any) => `${e.loc?.join('.') || ''}: ${e.msg}`).join('; ');
      }
      const msg = detail || error.response.data?.message || 'Request failed';
      return Promise.reject(new Error(msg));
    }
    if (error.request) {
      return Promise.reject(new Error('Network error - server unreachable'));
    }
    return Promise.reject(error);
  },
);

export default api;
