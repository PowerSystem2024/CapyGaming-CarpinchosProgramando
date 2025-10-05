import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Configurar axios para incluir token automáticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const cartAPI = {
  // Obtener carrito del servidor
  getCart: async () => {
    const response = await axios.get(`${API_BASE_URL}/cart`);
    return response.data;
  },

  // Agregar producto al carrito
  addToCart: async (producto_id, cantidad, precio_unitario) => {
    const response = await axios.post(`${API_BASE_URL}/cart`, {
      producto_id,
      cantidad,
      precio_unitario
    });
    return response.data;
  },

  // Actualizar cantidad de producto
  updateCartItem: async (producto_id, cantidad) => {
    const response = await axios.put(`${API_BASE_URL}/cart`, {
      producto_id,
      cantidad
    });
    return response.data;
  },

  // Eliminar producto del carrito
  removeFromCart: async (producto_id) => {
    const response = await axios.delete(`${API_BASE_URL}/cart/${producto_id}`);
    return response.data;
  },

  // Vaciar carrito
  clearCart: async () => {
    const response = await axios.delete(`${API_BASE_URL}/cart`);
    return response.data;
  },

  // Sincronizar carrito local con servidor
  syncCart: async (localCart) => {
    const response = await axios.post(`${API_BASE_URL}/cart/sync`, {
      localCart
    });
    return response.data;
  }
};

export const paymentAPI = {
  // Crear preferencia de pago
  createPreference: async (orderData) => {
    const response = await axios.post(`${API_BASE_URL}/payments/create-preference`, orderData);
    return response.data;
  },

  // Obtener estado del pedido
  getOrderStatus: async (orderId) => {
    const response = await axios.get(`${API_BASE_URL}/payments/order/${orderId}`);
    return response.data;
  },

  // Obtener todos los pedidos del usuario
  getUserOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/payments/orders`);
    return response.data;
  }
};