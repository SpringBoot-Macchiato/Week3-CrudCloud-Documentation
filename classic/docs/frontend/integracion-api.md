# Integración con API Backend

## Configuración Base (api.js)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Servicios por Módulo

### authService.js
```javascript
import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: (token) => api.post('/auth/google', { token }),
  logout: () => {
    localStorage.removeItem('token');
  }
};
```

### instanceService.js
```javascript
import api from './api';

export const instanceService = {
  getAll: () => api.get('/instances'),
  getById: (id) => api.get(`/instances/${id}`),
  create: (data) => api.post('/instances', data),
  update: (id, data) => api.put(`/instances/${id}`, data),
  delete: (id) => api.delete(`/instances/${id}`)
};
```

### planService.js
```javascript
import api from './api';

export const planService = {
  getAll: () => api.get('/plans'),
  getById: (id) => api.get(`/plans/${id}`),
  subscribe: (planId) => api.post('/plans/subscribe', { planId })
};
```

### paymentService.js
```javascript
import api from './api';

export const paymentService = {
  createPreference: (planId) => api.post('/payments/create-preference', { planId }),
  getPaymentHistory: () => api.get('/payments/history')
};
```

## Manejo de Errores

Errores se capturan en componentes mediante try-catch:

```javascript
try {
  const response = await instanceService.getAll();
  setInstances(response.data);
} catch (error) {
  console.error('Error fetching instances:', error);
  setError(error.response?.data?.message || 'Error desconocido');
}
```

## Custom Hook - useApi

```javascript
import { useState } from 'react';

export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
```