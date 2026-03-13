import axios from 'axios';
import API_BASE_URL from './config/api';
import { clearAuthSession, getAuthToken } from './services/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      clearAuthSession();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

// Export for legacy compatibility
export { API_BASE_URL as API_BASE };
export { API_BASE_URL };

// ── School APIs ─────────────────────────────────────────────────────────────
export const getSchools = () => api.get('/schools');
export const getSchoolById = (id) => api.get(`/schools/${id}`);
export const createSchool = (data) => api.post('/schools', data);
export const updateSchool = (id, data) => api.put(`/schools/${id}`, data);
export const deleteSchool = (id) => api.delete(`/schools/${id}`);

// ── Auth APIs ───────────────────────────────────────────────────────────────
export const loginAdmin = (data) => api.post('/auth/login', data);

// ── Marksheet APIs ───────────────────────────────────────────────────────────
export const getMarksheets = (query = '') =>
  api.get('/marksheets', { params: { query } });
export const getMarksheetById = (id) => api.get(`/marksheets/${id}`);
export const createMarksheet = (data) => api.post('/marksheets', data);

// ── Legacy report-cards ──────────────────────────────────────────────────────
export const getReportCards = (query = '') =>
  api.get('/report-cards', { params: { query } });

export default api;
