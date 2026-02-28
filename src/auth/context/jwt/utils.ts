import api from 'src/services/api';

const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const EXPIRY_DURATION = 24 * 60 * 60 * 1000; // 24 horas


export const isValidToken = (token: string): boolean => {
  if (!token) return false;

  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return false;

  return Date.now() < parseInt(expiry, 10);
};


export const setSession = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + EXPIRY_DURATION));

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem('user');

    delete api.defaults.headers.common.Authorization;
  }
};
