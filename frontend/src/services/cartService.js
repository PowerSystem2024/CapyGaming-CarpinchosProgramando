const API_BASE = 'http://localhost:3001/api';

class CartService {
  // Obtener el carrito del usuario desde el backend
  async getCart() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE}/carrito`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el carrito');
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Error en getCart:', error);
      throw error;
    }
  }

  // Agregar producto al carrito en el backend
  async addToCart(id_producto, cantidad = 1) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE}/carrito`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_producto, cantidad })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar al carrito');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en addToCart:', error);
      throw error;
    }
  }

  // Actualizar cantidad de un producto en el carrito
  async updateCartItem(id_producto, cantidad) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE}/carrito/${id_producto}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cantidad })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el carrito');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateCartItem:', error);
      throw error;
    }
  }

  // Eliminar producto del carrito
  async removeFromCart(id_producto) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE}/carrito/${id_producto}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar del carrito');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en removeFromCart:', error);
      throw error;
    }
  }

  // Sincronizar carrito del localStorage con el backend
  async syncCart(items) {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE}/carrito/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al sincronizar el carrito');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en syncCart:', error);
      throw error;
    }
  }

  // Limpiar carrito completo
  async clearCart() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_BASE}/carrito`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al limpiar el carrito');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en clearCart:', error);
      throw error;
    }
  }
}

export default new CartService();
