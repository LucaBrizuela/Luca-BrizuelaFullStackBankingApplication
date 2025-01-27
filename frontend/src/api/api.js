import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/users' });

// Add token to request headers (Add Later)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createUser = (data) => API.post('/create', data);
export const loginUser = (data) => API.post('/login', data);
export const logoutUser = (data) => API.post('/logout', data);
export const deposit = (id, amount) => API.put(`/${id}/deposit`, { amount });
export const withdraw = (id, amount) => API.put(`/${id}/withdraw`, { amount });
export const getUser = (id) => API.get(`/${id}`);
export const loginWithOAuth = (provider, token) => API.post('/oauth', { provider, token });
