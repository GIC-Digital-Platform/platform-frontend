import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend responded with an error — use the sanitised message from our error handler
    if (error.response) {
      const message = error.response.data?.error || 'Something went wrong. Please try again.';
      return Promise.reject(new Error(message));
    }
    // No response received — network or timeout issue
    if (error.request) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timed out. Please check your connection and try again.'));
      }
      return Promise.reject(new Error('Unable to reach the server. Please check your connection.'));
    }
    // Anything else
    return Promise.reject(new Error('An unexpected error occurred.'));
  },
);

export default api;
