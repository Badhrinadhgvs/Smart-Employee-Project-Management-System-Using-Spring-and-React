import api from './axiosClient';

export async function getMyProfile() {
  const { data } = await api.get('/employees/me');
  return data;
}

export async function updateMyProfile(payload) {
  const { data } = await api.put('/employees/me', payload);
  return data;
}
