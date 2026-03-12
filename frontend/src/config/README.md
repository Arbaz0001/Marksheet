## API Configuration Setup

This guide explains how the API base URL is configured for development and production environments.

### File Structure

```
report-card-generator/
├── .env.development               # Development environment variables
├── .env.production                # Production environment variables
└── frontend/
    └── src/
        ├── api.js                 # Axios instance with centralized base URL
        └── config/
            ├── api.js             # API base URL configuration
            └── examples.js        # Usage examples
```

### Environment Files

#### `.env.development`
```env
VITE_API_URL=http://localhost:5001/api
```
- Used when running `npm run dev`
- API requests go to local backend on port 5001

#### `.env.production`
```env
VITE_API_URL=/api
```
- Used when running `npm run build`
- Uses relative path `/api` which resolves to the current domain
- On production: `https://marksheet.coinpay0.com/api`

### Configuration File

#### `frontend/src/config/api.js`
Centralized configuration that determines the API base URL based on the environment:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export default API_BASE_URL;
```

### API Module

#### `frontend/src/api.js`
Axios instance configured with the environment-specific base URL:

```javascript
import axios from 'axios';
import API_BASE_URL from './config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getSchools = () => api.get('/schools');
export const createSchool = (data) => api.post('/schools', data);
// ... more endpoints
```

### Usage in Components

#### Using Axios (Recommended)

```javascript
import { getSchools, createSchool } from '../api';

// GET request
useEffect(() => {
  getSchools()
    .then((res) => setSchools(res.data))
    .catch((err) => console.error('Failed to fetch schools:', err));
}, []);

// POST request
const handleCreate = async (schoolData) => {
  try {
    const response = await createSchool(schoolData);
    console.log('School created:', response.data);
  } catch (error) {
    console.error('Failed to create school:', error);
  }
};
```

#### Using Fetch API

```javascript
import API_BASE_URL from '../config/api';

// GET request
fetch(`${API_BASE_URL}/schools`)
  .then((res) => res.json())
  .then((data) => setSchools(data))
  .catch((err) => console.error(err));

// POST request
fetch(`${API_BASE_URL}/schools`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(schoolData),
})
  .then((res) => res.json())
  .then((data) => console.log('Created:', data))
  .catch((err) => console.error(err));
```

### How It Works

#### Development Flow

```
npm run dev
  ↓
Vite loads .env.development
  ↓
VITE_API_URL = http://localhost:5001/api
  ↓
Components import from src/api.js
  ↓
Axios makes requests to http://localhost:5001/api/schools
```

#### Production Flow

```
npm run build
  ↓
Vite loads .env.production
  ↓
VITE_API_URL = /api
  ↓
Built app bundles API_BASE_URL = /api
  ↓
Deployed on marksheet.coinpay0.com
  ↓
Browser makes requests to /api/schools
  ↓
Nginx proxy_pass to backend server
  ↓
Backend responds with data
```

### Nginx Configuration (Production)

Add this to your Nginx config to proxy API requests to your backend:

```nginx
server {
    listen 443 ssl;
    server_name marksheet.coinpay0.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Serve static React app
    location / {
        root /var/www/html/marksheet;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Best Practices

✅ **DO**
- Import API functions from `src/api.js`
- Use `API_BASE_URL` from `src/config/api.js` when using fetch
- Let the environment variables control the base URL
- Test locally with `npm run dev` before building for production

❌ **DON'T**
- Hardcode `http://localhost:5001` or `https://marksheet.coinpay0.com` in components
- Import `.env` files directly in components
- Create multiple API base URLs in different files
- Change API URLs without updating the environment files

### Verification

#### Check Development Setup
```bash
cd frontend
npm run dev
# Open browser DevTools → Network tab
# Verify API requests go to http://localhost:5001/api
```

#### Check Production Build
```bash
cd frontend
npm run build
# Open dist/index.html and check network requests
# Or deploy and verify requests go to /api (relative path)
```

### Troubleshooting

**Issue:** API requests fail with CORS errors
- **Solution:** Verify `http://localhost:5001` is running and has CORS enabled

**Issue:** `npm run build` still uses development URL
- **Solution:** Ensure `.env.production` exists and has correct `VITE_API_URL`

**Issue:** Browser shows "Cannot GET /api/schools" on production
- **Solution:** Verify Nginx proxy_pass is configured correctly and backend is reachable

### Additional Notes

- Environment variable names must start with `VITE_` to be exposed to the client
- The fallback in `api.js` is only used if the environment variable is not set
- Your Vite `dev` server automatically reloads when you change `.env.development`
- Build output includes the correct API URL baked into the bundled code
