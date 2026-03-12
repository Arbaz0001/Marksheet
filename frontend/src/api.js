import axios from 'axios';
import API_BASE_URL from './config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Export for legacy compatibility
export { API_BASE_URL as API_BASE };
export { API_BASE_URL };

// ── School APIs ─────────────────────────────────────────────────────────────
export const getSchools = () => api.get('/schools');
export const getSchoolById = (id) => api.get(`/schools/${id}`);
export const createSchool = (data) => api.post('/schools', data);

// ── Marksheet APIs ───────────────────────────────────────────────────────────
export const getMarksheets = (query = '') =>
  api.get('/marksheets', { params: { query } });
export const getMarksheetById = (id) => api.get(`/marksheets/${id}`);
export const createMarksheet = (data) => api.post('/marksheets', data);

// ── Legacy report-cards ──────────────────────────────────────────────────────
export const getReportCards = (query = '') =>
  api.get('/report-cards', { params: { query } });

export default api;
