import api from './axiosInstance';

export const getCafes = async (location = '') => {
  const params = location ? { location } : {};
  const { data } = await api.get('/cafes', { params });
  return data.data;
};

export const getCafeById = async (id) => {
  const { data } = await api.get(`/cafes/${id}`);
  return data.data;
};

export const createCafe = async (formData) => {
  const { data } = await api.post('/cafes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const updateCafe = async ({ id, formData }) => {
  const { data } = await api.put(`/cafes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const deleteCafe = async (id) => {
  const { data } = await api.delete(`/cafes/${id}`);
  return data;
};
