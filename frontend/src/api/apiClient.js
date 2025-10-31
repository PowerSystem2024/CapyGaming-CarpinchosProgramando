import axios from 'axios';

// Configurar la baseURL desde la variable de entorno VITE_API_URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
