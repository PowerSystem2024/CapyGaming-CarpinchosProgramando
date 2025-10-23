import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import mercadopagoService from '../services/mercadopagoService';
import { getCart, getCartTotal, clearCart } from '../utils/cartUtils';

export function usePayment() {
  const router = useRouter();
  const isProcessing = ref(false);
  const error = ref(null);
  const preferenceId = ref(null);

  /**
   * Procesar el pago
   * @param {Object} formData - Datos del formulario de checkout
   */
  const processPayment = async (formData) => {
    isProcessing.value = true;
    error.value = null;

    try {
      const cartItems = getCart();
      const total = getCartTotal();

      // Preparar datos para MercadoPago
const orderData = {
  items: cartItems.map(item => ({
    id: item.id,                         // ← Cambio: id_producto → id
    title: item.nombre,                  // ← Cambio: nombre → title
    quantity: item.quantity,             // ← OK, no cambiar
    unit_price: parseFloat(item.precio), // ← Cambio: precio → unit_price
    picture_url: item.imagen || ''       // ← Agregar: URL de imagen del producto
  })),
  payer: {
    name: formData.nombre,
    surname: formData.apellidos,
    email: formData.email,
    dni: formData.dni || null            // ← Agregar: DNI del usuario
  }
};

      console.log('Enviando orden a MercadoPago:', orderData);

      // Crear preferencia
      const response = await mercadopagoService.createPreference(orderData);
      preferenceId.value = response.preferenceId;

      console.log('Preferencia creada:', response);

      // Redirigir a MercadoPago
      if (response.initPoint) {
        window.location.href = response.initPoint;
      } else {
        throw new Error('No se recibió init point');
      }

    } catch (err) {
      console.error(' Error al procesar pago:', err);
      error.value = err.message || 'Error al procesar el pago';
      isProcessing.value = false;
    }
  };

  /**
   * Verificar estado de un pago
   */
  const checkPaymentStatus = async (paymentId) => {
    try {
      const status = await mercadopagoService.getPaymentStatus(paymentId);
      return status;
    } catch (err) {
      console.error('Error al verificar estado:', err);
      throw err;
    }
  };

  return {
    isProcessing,
    error,
    preferenceId,
    processPayment,
    checkPaymentStatus
  };
}