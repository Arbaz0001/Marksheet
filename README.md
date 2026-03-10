# Report Card Generator (Full Stack)

Project structure:

- `backend/` -> Express + MongoDB API
- `frontend/` -> React + Vite + Tailwind client

## Backend

```bash
cd backend
npm install
npm run dev
```

Backend API base URL:

- `http://localhost:5000/api`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend API config:

- `frontend/src/api.js`
- Default base URL: `http://localhost:5000/api`
- Optional override in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
