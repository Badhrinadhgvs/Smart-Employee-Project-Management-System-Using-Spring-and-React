import axiosClient from './axiosClient';

// POST /api/auth/login -> LoginResponse { token, id, username, firstName, lastName, roles[] }
export const login = (username, password) =>
  axiosClient.post('/auth/login', { username, password }).then((res) => res.data);

// POST /api/auth/register -> success string
export const register = (payload) =>
  axiosClient.post('/auth/register', payload).then((res) => res.data);
