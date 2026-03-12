import axios from 'axios';

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

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
