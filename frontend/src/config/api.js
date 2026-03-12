/**
 * Centralized API Base URL Configuration
 *
 * Development: http://localhost:5001/api
 * Production: /api (relative path, uses current domain)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Validate URL in development
if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.warn('[API Config] VITE_API_URL not set, using fallback:', API_BASE_URL);
}

export default API_BASE_URL;
