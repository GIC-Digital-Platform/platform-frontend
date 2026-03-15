import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

export default api;
