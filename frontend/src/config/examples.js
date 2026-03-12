/**
 * API Usage Examples
 *
 * This file demonstrates the recommended patterns for making API calls
 * in the React application using the centralized API configuration.
 */

// ════════════════════════════════════════════════════════════════════════════
// OPTION 1: Using Axios (Recommended for this project)
// ════════════════════════════════════════════════════════════════════════════
//
// The axios instance is already configured in src/api.js
// It automatically uses the correct API base URL for each environment
//

import api from '../api';

// GET request
export const getSchools = () => api.get('/schools');

// GET with query parameters
export const getMarksheets = (query = '') =>
  api.get('/marksheets', { params: { query } });

// POST request
export const createSchool = (data) => api.post('/schools', data);

// PUT request
export const updateSchool = (id, data) => api.put(`/schools/${id}`, data);

// DELETE request
export const deleteSchool = (id) => api.delete(`/schools/${id}`);

// ════════════════════════════════════════════════════════════════════════════
// OPTION 2: Using Fetch API with Centralized Config
// ════════════════════════════════════════════════════════════════════════════
//
// If you prefer fetch over axios, import the config directly
//

import API_BASE_URL from './api';

// GET request
async function getSchoolsWithFetch() {
  const response = await fetch(`${API_BASE_URL}/schools`);
  if (!response.ok) throw new Error('Failed to fetch schools');
  return response.json();
}

// POST request
async function createSchoolWithFetch(data) {
  const response = await fetch(`${API_BASE_URL}/schools`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create school');
  return response.json();
}

// GET with query parameters
async function getMarksheetsWithFetch(query = '') {
  const params = new URLSearchParams({ query });
  const response = await fetch(`${API_BASE_URL}/marksheets?${params}`);
  if (!response.ok) throw new Error('Failed to fetch marksheets');
  return response.json();
}

// ════════════════════════════════════════════════════════════════════════════
// USAGE IN COMPONENTS
// ════════════════════════════════════════════════════════════════════════════
//
// Always import from src/api.js (which uses the config automatically)
// Never hardcode base URLs in components
//

// ✅ CORRECT: Uses centralized config
import { getSchools, createSchool } from '../api';

useEffect(() => {
  getSchools()
    .then((res) => setSchools(res.data))
    .catch((err) => console.error(err));
}, []);

const handleCreate = async (schoolData) => {
  await createSchool(schoolData);
};

// ✅ CORRECT: If using fetch, import config
import API_BASE_URL from '../config/api';

fetch(`${API_BASE_URL}/schools`)
  .then((res) => res.json())
  .then((data) => setSchools(data));

// ❌ WRONG: Hardcoded URL (avoid this)
// fetch('http://localhost:5001/api/schools')

// ❌ WRONG: Referencing old variable name
// import { API_BASE } from '../api'; // Use API_BASE_URL from config instead

// ════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT BEHAVIOR
// ════════════════════════════════════════════════════════════════════════════
//
// npm run dev:
//   - Loads .env.development
//   - VITE_API_URL = http://localhost:5001/api
//   - API requests go to: http://localhost:5001/api/schools
//
// npm run build:
//   - Loads .env.production
//   - VITE_API_URL = /api
//   - API requests go to: /api/schools (relative to domain)
//   - On marksheet.coinpay0.com -> https://marksheet.coinpay0.com/api/schools
//
// Nginx Configuration (production):
//   location /api/ {
//     proxy_pass http://backend-server:5001;
//   }
//

export {};
