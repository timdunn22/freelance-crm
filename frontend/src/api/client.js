import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, password_confirmation, name) => api.post('/auth/register', { email, password, password_confirmation, name }),
  me: () => api.get('/auth/me')
};

export const leads = {
  list: (status) => api.get('/leads', { params: status ? { status } : {} }),
  kanban: () => api.get('/leads/kanban'),
  get: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.patch(`/leads/${id}`, data),
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),
  delete: (id) => api.delete(`/leads/${id}`)
};

export const interactions = {
  list: (leadId) => api.get(`/leads/${leadId}/interactions`),
  create: (leadId, data) => api.post(`/leads/${leadId}/interactions`, data),
  update: (leadId, id, data) => api.patch(`/leads/${leadId}/interactions/${id}`, data),
  delete: (leadId, id) => api.delete(`/leads/${leadId}/interactions/${id}`)
};

export const tasks = {
  list: (params) => api.get('/tasks', { params }),
  upcoming: () => api.get('/tasks/upcoming'),
  overdue: () => api.get('/tasks/overdue'),
  get: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  toggle: (id) => api.patch(`/tasks/${id}/toggle`),
  delete: (id) => api.delete(`/tasks/${id}`)
};

export const tags = {
  list: () => api.get('/tags'),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.patch(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`)
};

export const dashboard = {
  stats: () => api.get('/dashboard/stats')
};

export default api;
