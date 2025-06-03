import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    // 'Content-Type': 'application/json', // Removed to allow Axios to set Content-Type automatically (e.g., for FormData)
  },
  withCredentials: true
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Note: Do NOT manually set Content-Type here for FormData requests. Axios handles it.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;