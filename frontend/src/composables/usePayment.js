import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import mercadopagoService from '../services/mercadopagoService';
import { getCart, getCartTotal, clearCart } from '../utils/cartUtils';

export function usePayment() {
  const router = useRouter();
  const isProcessing = ref(false);
  const error = ref(null);
  const preferenceId = ref(null);
  const loading = ref(false);
  const paymentStatus = ref(null);

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
          id: item.id,
          title: item.nombre,
          quantity: item.quantity,
          unit_price: parseFloat(item.precio),
          picture_url: item.imagen || '',
          description: item.descripcion || item.nombre  //  Ya está correcto
        })),
        payer: {
          name: formData.nombre,
          surname: formData.apellidos,
          email: formData.email,
          dni: formData.dni || null
        }
      };

      console.log('Enviando orden a MercadoPago:', orderData);

      // Crear preferencia
      const response = await mercadopagoService.createPreference(orderData);
      preferenceId.value = response.preferenceId;

      console.log('Preferencia creada:', response);

      // Redirigir a MercadoPago
      if (response.success && response.initPoint) {
        localStorage.setItem('currentOrderId', response.orderId);  //  Ya está correcto

        console.log('Preferencia creada:', response);
        // Limpiar carrito
        clearCart();

        // Redirigir a MercadoPago
        window.location.href = response.initPoint;
      } else {
        throw new Error('No se recibió init point');
      }

    } catch (err) {
      console.error('Error al procesar pago:', err);
      error.value = err.message || 'Error al procesar el pago';
      isProcessing.value = false;
    }
  };

  /**
   * Verificar estado de un pago
   */
  async function checkPaymentStatus(orderId) {  //  Ya usa orderId correctamente
    try {
      loading.value = true;                      //  Ahora sí existe loading
      error.value = null;

      console.log('Consultando estado del pago, orderId:', orderId);
      const status = await mercadopagoService.getPaymentStatus(orderId);

      paymentStatus.value = status;              //  Ahora sí existe paymentStatus
      return status;
    } catch (err) {
      error.value = err.message || 'Error al consultar el estado del pago';
      console.error('Error en checkPaymentStatus:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    isProcessing,
    error,
    preferenceId,
    loading,              // ← AGREGAR ESTA LÍNEA
    paymentStatus,        // ← AGREGAR ESTA LÍNEA
    processPayment,
    checkPaymentStatus
  };
}