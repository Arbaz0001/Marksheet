 
import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://marksheet-vzmp.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
  