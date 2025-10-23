const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// 🔴 MODO MOCK - Cambiá esto a false cuando el backend esté listo
const USE_MOCK = false;

class MercadoPagoService {
  /**
   * Crear preferencia de pago
   * @param {Object} orderData - Datos del pedido
   * @returns {Promise<Object>} - Preference ID e init point
   */
  async crearPreferencia(orderData) {
    if (USE_MOCK) {
      // 🎭 MOCK - Simular respuesta del backend
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            preferenceId: `MOCK-${Date.now()}`,
            initPoint: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=MOCK-${Date.now()}`
          });
        }, 1000); // Simular delay de red
      });
    }

    // 🌐 REAL - Llamar al backend (usar cuando esté listo)
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/mercadopago/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear preferencia');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating preference:', error);
      throw error;
    }
  }

  /**
   * Obtener estado de un pago
   * @param {string} paymentId - ID del pago
   * @returns {Promise<Object>} - Estado del pago
   */
  async getPaymentStatus(paymentId) {
    if (USE_MOCK) {
      // 🎭 MOCK - Simular respuesta
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 'approved',
            statusDetail: 'accredited',
            paymentId: paymentId,
            amount: 50000
          });
        }, 500);
      });
    }

    // 🌐 REAL
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/mercadopago/payment/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener estado del pago');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }
}

export default new MercadoPagoService();