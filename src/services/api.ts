import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const api = axios.create({
  baseURL: HOST_API,
});

// Injeta o token automaticamente em todas as requisições autenticadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// ----------------------------------------------------------------------
// Tipos

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'user';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const loginApi = (email: string, password: string) =>
  api.post<LoginResponse>('/login', { email, password });

export const registerApi = (name: string, email: string, password: string, type?: string) =>
  api.post('/users', { name, email, password, ...(type && { type }) });


export const getUsersApi = () =>
  api.get<User[]>('/users');


export const getUserApi = (id: string) =>
  api.get<User>(`/users/${id}`);


export const updateUserApi = (id: string, data: { name?: string; email?: string; type?: string }) =>
  api.patch<User>(`/users/${id}`, data);


export const updatePasswordApi = (id: string, oldPassword: string, newPassword: string) =>
  api.patch(`/users/${id}/password`, { oldPassword, newPassword });


export const deleteUserApi = (id: string) =>
  api.delete(`/users/${id}`);
