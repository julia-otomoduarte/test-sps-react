import axios from 'axios';

// ----------------------------------------------------------------------

const api = axios.create({
  baseURL: 'http://localhost:3000',
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

// ----------------------------------------------------------------------
// Autenticação

export const loginApi = (email: string, password: string) =>
  api.post<LoginResponse>('/login', { email, password });

// ----------------------------------------------------------------------
// Usuários

/** POST /users — cria usuário (sem autenticação) */
export const registerApi = (name: string, email: string, password: string) =>
  api.post('/users', { name, email, password });

/** GET /users — lista todos os usuários (autenticado) */
export const getUsersApi = () =>
  api.get<User[]>('/users');

/** GET /users/:id — retorna usuário pelo ID (autenticado) */
export const getUserApi = (id: string) =>
  api.get<User>(`/users/${id}`);

/** PATCH /users/:id — atualiza nome e/ou email (autenticado) */
export const updateUserApi = (id: string, data: { name?: string; email?: string }) =>
  api.patch<User>(`/users/${id}`, data);

/** PATCH /users/:id/password — altera senha (autenticado) */
export const updatePasswordApi = (id: string, oldPassword: string, newPassword: string) =>
  api.patch(`/users/${id}/password`, { oldPassword, newPassword });

/** DELETE /users/:id — remove usuário (autenticado) */
export const deleteUserApi = (id: string) =>
  api.delete(`/users/${id}`);
