import api from './axiosInstance';

export const getEmployees = async (cafe = '') => {
  const params = cafe ? { cafe } : {};
  const { data } = await api.get('/employees', { params });
  return data.data;
};

export const getEmployeeById = async (id) => {
  // Fetch from list since there's no single-employee endpoint
  const { data } = await api.get('/employees');
  return data.data.find((e) => e.id === id) || null;
};

export const createEmployee = async (payload) => {
  const { data } = await api.post('/employees', payload);
  return data.data;
};

export const updateEmployee = async ({ id, ...payload }) => {
  const { data } = await api.put(`/employees/${id}`, payload);
  return data.data;
};

export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/employees/${id}`);
  return data;
};
