const API_BASE = 'http://localhost:3001/api';

class OrderService {
  // Crear un nuevo pedido
  async createOrder(orderData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_BASE}/pedidos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createOrder:', error);
      throw error;
    }
  }

  // Obtener historial de pedidos del usuario
  async getUserOrders() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_BASE}/pedidos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener los pedidos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getUserOrders:', error);
      throw error;
    }
  }

  // Obtener detalle de un pedido específico
  async getOrderById(orderId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_BASE}/pedidos/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener el pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getOrderById:', error);
      throw error;
    }
  }

  // Cancelar un pedido
  async cancelOrder(orderId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${API_BASE}/pedidos/${orderId}/cancelar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cancelar el pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en cancelOrder:', error);
      throw error;
    }
  }
}

export default new OrderService();
