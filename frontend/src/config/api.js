/**
 * Centralized API Base URL Configuration
 *
 * Development  → http://localhost:5001/api
 * Production   → /api  (handled by nginx reverse proxy)
 */

const isDevelopment = import.meta.env.MODE === "development";

const API_BASE_URL = isDevelopment
  ? "http://localhost:5001/api"
  : "/api";

// Development logging (helps debugging)
if (isDevelopment) {
  console.log("🌐 API Mode: Development");
  console.log("🔗 API Base URL:", API_BASE_URL);
} else {
  console.log("🌐 API Mode: Production");
}

export default API_BASE_URL;