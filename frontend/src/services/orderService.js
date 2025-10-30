const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

class OrderService {
  /**
   * Obtener pedidos del usuario actual
   * @returns {Promise<Array>} Lista de pedidos
   */
  async getUserOrders() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/pedidos/mis-pedidos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener pedidos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  /**
   * Obtener detalle de un pedido específico
   * @param {string} orderId - ID del pedido
   * @returns {Promise<Object>} Detalle del pedido
   */
  async getOrderById(orderId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/pedidos/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener detalle del pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order detail:', error);
      throw error;
    }
  }
}

export default new OrderService();
