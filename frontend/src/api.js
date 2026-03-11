<<<<<<< HEAD
import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://marksheet-vzmp.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
=======
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
>>>>>>> ed0cc00c47b55670134b48d0f5650fb644776df4
