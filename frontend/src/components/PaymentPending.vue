<template>
  <div class="payment-status pending">
    <div class="status-card">
      <!-- Estado de carga -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <h2>Verificando pago...</h2>
        <p>Por favor espera mientras confirmamos tu pago</p>
      </div>

      <!-- Estado de error -->
      <div v-else-if="error" class="error-container">
        <div class="icon-container error">
          <span class="icon">✗</span>
        </div>
        <h1>Error al verificar pago</h1>
        <p>{{ error }}</p>
        <div class="actions">
          <button @click="goToHome" class="btn-primary">Volver al inicio</button>
        </div>
      </div>

      <!-- Estado pendiente confirmado -->
      <div v-else class="pending-container">
        <div class="icon-container pending">
          <span class="icon">⏱</span>
        </div>
        <h1>Pago pendiente</h1>
        <p>Tu pago está siendo procesado. Te notificaremos cuando se complete.</p>
        <div class="payment-info">
          <p v-if="paymentId"><strong>ID de pago:</strong> {{ paymentId }}</p>
          <p>Este proceso puede tardar algunos minutos.</p>
        </div>
        <div class="actions">
          <button @click="goToHome" class="btn-primary">Volver al inicio</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { clearCart } from '../utils/cartUtils';
import { usePayment } from '../composables/usePayment';

export default {
  name: 'PaymentPending',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { checkPaymentStatus } = usePayment();

    const loading = ref(true);
    const error = ref(null);
    const paymentId = ref(route.query.payment_id || null);

    onMounted(async () => {
      try {
        const orderId = localStorage.getItem('currentOrderId');

        if (!orderId) {
          throw new Error('No se encontró el ID de la orden');
        }

        console.log('Verificando estado del pago para orden:', orderId);

        // Intentar obtener el estado con polling
        let paymentStatus = null;
        let attempts = 0;
        const maxAttempts = 15; // 15 intentos = 30 segundos máximo

        while (attempts < maxAttempts) {
          paymentStatus = await checkPaymentStatus(orderId);

          console.log(`Intento ${attempts + 1}: Estado del pago:`, paymentStatus.status);

          // Si el pago cambió a aprobado o rechazado, redirigir
          if (paymentStatus.status === 'approved') {
            console.log('Pago aprobado, redirigiendo a /payment/success');
            router.replace('/payment/success');
            return;
          } else if (paymentStatus.status === 'rejected' || paymentStatus.status === 'cancelled') {
            console.log('Pago rechazado, redirigiendo a /payment/failure');
            router.replace('/payment/failure');
            return;
          }

          // Si sigue pendiente, continuar polling
          if ((paymentStatus.status === 'pending' || paymentStatus.status === 'in_process') && attempts < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
          } else {
            break;
          }
        }

        // Si después del polling sigue pendiente, mostrar la vista de pending
        const paymentResult = {
          status: 'pending',
          orderId: orderId,
          paymentId: paymentId.value
        };

        localStorage.setItem('paymentResult', JSON.stringify(paymentResult));
        localStorage.removeItem('paymentInProgress');

        // Limpiar carrito ya que el pago está iniciado
        clearCart();
        localStorage.removeItem('currentOrderId');

        loading.value = false;
      } catch (err) {
        console.error('Error al verificar el pago:', err);
        error.value = err.message || 'Error al verificar el estado del pago';
        loading.value = false;
        localStorage.removeItem('paymentInProgress');
      }
    });

    const goToHome = () => {
      router.push('/');
    };

    return {
      loading,
      error,
      paymentId,
      goToHome
    };
  }
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

.payment-status {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--color-background);
}

.status-card {
  background: var(--color-card);
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.icon-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.icon-container.pending {
  background: #ff9800;
}

.icon-container.error {
  background: #f44336;
}

.icon {
  font-size: 3rem;
  color: white;
}

.loading-container, .error-container, .pending-container {
  text-align: center;
  padding: 20px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top: 4px solid #ff9800;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  color: var(--color-foreground);
  margin-bottom: 10px;
  font-size: 1.5rem;
}

h1 {
  color: var(--color-foreground);
  margin-bottom: 10px;
  font-size: 1.8rem;
}

p {
  color: var(--color-muted-foreground);
  margin-bottom: 20px;
}

.payment-info {
  background: var(--color-accent);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid var(--color-border);
}

.payment-info p {
  margin: 10px 0;
  color: var(--color-foreground);
}

.actions {
  margin-top: 30px;
}

.btn-primary {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

.btn-primary:hover {
  background: var(--sidebar-ring);
  transform: translateY(-2px);
}

/* Media Queries para Responsive */

/* Pantallas grandes (desktops, 1200px en adelante) */
@media (min-width: 1200px) {
  .payment-status {
    height: 85vh;
  }
  
  .status-card {
    padding: 50px;
    max-width: 550px;
  }
  
  .icon-container {
    width: 100px;
    height: 100px;
    margin-bottom: 25px;
  }
  
  .icon {
    font-size: 3.5rem;
  }
  
  h1 {
    font-size: 2.2rem;
    margin-bottom: 15px;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 25px;
  }
  
  .payment-info {
    padding: 25px;
    margin: 25px 0;
  }
  
  .payment-info p {
    font-size: 1rem;
    margin: 12px 0;
  }
  
  .actions {
    margin-top: 35px;
  }
  
  .btn-primary {
    padding: 15px 25px;
    font-size: 1.1rem;
  }
}

/* Pantallas medianas (tablets, 768px a 1199px) */
@media (max-width: 1199px) and (min-width: 768px) {
  .payment-status {
    padding: 30px;
  }
  
  .status-card {
    padding: 35px;
    max-width: 480px;
  }
  
  .icon-container {
    width: 90px;
    height: 90px;
    margin-bottom: 18px;
  }
  
  .icon {
    font-size: 2.8rem;
  }
  
  h1 {
    font-size: 1.7rem;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 1rem;
    margin-bottom: 18px;
  }
  
  .payment-info {
    padding: 18px;
    margin: 18px 0;
  }
  
  .payment-info p {
    font-size: 0.95rem;
    margin: 8px 0;
  }
  
  .actions {
    margin-top: 25px;
  }
  
  .btn-primary {
    padding: 14px 20px;
    font-size: 1rem;
  }
}

/* Pantallas pequeñas (móviles, hasta 767px) */
@media (max-width: 767px) {
  .payment-status {
    padding: 15px;
    align-items: flex-start;
    min-height: 90vh;
  }
  
  .status-card {
    padding: 30px 25px;
    margin-top: 20px;
    border-radius: 10px;
  }
  
  .icon-container {
    width: 70px;
    height: 70px;
    margin-bottom: 15px;
  }
  
  .icon {
    font-size: 2.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 0.95rem;
    margin-bottom: 15px;
    line-height: 1.4;
  }
  
  .payment-info {
    padding: 15px;
    margin: 15px 0;
    border-radius: 6px;
  }
  
  .payment-info p {
    font-size: 0.9rem;
    margin: 8px 0;
  }
  
  .actions {
    margin-top: 20px;
  }
  
  .btn-primary {
    padding: 12px 20px;
    font-size: 1rem;
    border-radius: 6px;
  }
}

/* Pantallas muy pequeñas (móviles pequeños, hasta 480px) */
@media (max-width: 480px) {
  .payment-status {
    padding: 10px;
    min-height: 85vh;
  }
  
  .status-card {
    padding: 25px 20px;
    margin-top: 15px;
    border-radius: 8px;
  }
  
  .icon-container {
    width: 60px;
    height: 60px;
    margin-bottom: 12px;
  }
  
  .icon {
    font-size: 2rem;
  }
  
  h1 {
    font-size: 1.3rem;
  }
  
  p {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }
  
  .payment-info {
    padding: 12px;
    margin: 12px 0;
  }
  
  .payment-info p {
    font-size: 0.85rem;
    margin: 6px 0;
  }
  
  .actions {
    margin-top: 18px;
  }
  
  .btn-primary {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
</style>