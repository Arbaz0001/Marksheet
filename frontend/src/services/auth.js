const TOKEN_KEY = 'reportCardAdminToken';
const ADMIN_KEY = 'reportCardAdminProfile';

export const saveAuthSession = (token, admin) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin || null));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY) || '';

export const getAdminProfile = () => {
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getAuthToken());