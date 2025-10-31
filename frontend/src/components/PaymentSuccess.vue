<template>
  <div class="payment-status success">
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
          <span class="icon-error">✗</span>
        </div>
        <h1>Error al verificar pago</h1>
        <p>{{ error }}</p>
        <div class="actions">
          <button @click="goToHome" class="btn-primary">Volver al inicio</button>
        </div>
      </div>

      <!-- Estado exitoso -->
      <div v-else-if="paymentInfo" class="container-success">
        <div class="icon-container success">
          <span class="icon-success">✓</span>
        </div>
        <h1>¡Pago exitoso!</h1>
        <p>Tu compra ha sido procesada correctamente.</p>
        <div class="payment-info">
          <p><strong>ID de orden:</strong> {{ paymentInfo.orderId }}</p>
          <p>
            <strong>Estado:</strong>
            <span :class="['status-badge', paymentInfo.status]">
              {{ statusText(paymentInfo.status) }}
            </span>
          </p>
          <p><strong>Monto:</strong> ${{ formatAmount(paymentInfo.transactionAmount) }}</p>
          <p v-if="paymentInfo.paymentMethod">
            <strong>Método de pago:</strong> {{ paymentInfo.paymentMethod }}
          </p>
          <p v-if="paymentInfo.dateApproved">
            <strong>Fecha:</strong> {{ formatDate(paymentInfo.dateApproved) }}
          </p>
        </div>
        <div class="actions">
          <button @click="goToHome" class="btn-primary">Volver al inicio</button>
          <button @click="viewOrders" class="btn-secondary">Ver mis pedidos</button>
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
  name: 'PaymentSuccess',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { checkPaymentStatus } = usePayment();

    const loading = ref(true);
    const error = ref(null);
    const paymentInfo = ref(null);

    onMounted(async () => {
      try {
        const paymentId = route.query.payment_id;
        const status = route.query.status;
        const preferenceId = route.query.preference_id;

        console.log('Parámetros de pago recibidos:', { paymentId, status, preferenceId });

        const orderId = localStorage.getItem('currentOrderId');

        if (!orderId) {
          throw new Error('No se encontró el ID de la orden');
        }

        console.log('Consultando estado del pago para orden:', orderId);

        // Intentar obtener el estado con polling (reintentos cada 2 segundos)
        let paymentStatus = null;
        let attempts = 0;
        const maxAttempts = 15; // 15 intentos = 30 segundos máximo

        while (attempts < maxAttempts) {
          paymentStatus = await checkPaymentStatus(orderId);

          console.log(`Intento ${attempts + 1}: Estado del pago:`, paymentStatus.status);

          // Si el pago está aprobado o rechazado, salir del loop
          if (paymentStatus.status === 'approved' || paymentStatus.status === 'rejected') {
            break;
          }

          // Si sigue pendiente, esperar 2 segundos y reintentar
          if ((paymentStatus.status === 'pending' || paymentStatus.status === 'in_process') && attempts < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
          } else {
            break;
          }
        }

        // Redirigir a la ruta correcta según el estado real del pago
        if (paymentStatus.status === 'pending' || paymentStatus.status === 'in_process') {
          console.log('Pago pendiente, redirigiendo a /payment/pending');
          localStorage.removeItem('paymentInProgress');
          router.replace('/payment/pending');
          return;
        } else if (paymentStatus.status === 'rejected' || paymentStatus.status === 'cancelled') {
          console.log('Pago rechazado, redirigiendo a /payment/failure');
          localStorage.removeItem('paymentInProgress');
          router.replace('/payment/failure');
          return;
        }

        // Si llegamos aquí, el pago fue aprobado
        paymentInfo.value = paymentStatus;

        // Guardar resultado
        const paymentResult = {
          status: paymentStatus.status,
          orderId: paymentStatus.orderId,
          amount: paymentStatus.transactionAmount
        };

        localStorage.setItem('paymentResult', JSON.stringify(paymentResult));

        console.log('Pago aprobado, limpiando carrito...');
        clearCart();
        localStorage.removeItem('currentOrderId');
        localStorage.removeItem('paymentInProgress');

        loading.value = false;
      } catch (err) {
        console.error('Error al verificar el pago:', err);
        error.value = err.message || 'Error al verificar el estado del pago';
        loading.value = false;
        localStorage.removeItem('paymentInProgress');
      }
    });

    const statusText = (status) => {
      const statusMap = {
        approved: 'Aprobado',
        pending: 'Pendiente',
        rejected: 'Rechazado',
        cancelled: 'Cancelado',
        refunded: 'Reembolsado',
        charged_back: 'Contracargo'
      };
      return statusMap[status] || status;
    };

    const formatAmount = (amount) => {
      if (!amount) return '0.00';
      return Number(amount).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const goToHome = () => {
      router.push('/');
    };

    const viewOrders = () => {
      router.push('/mis-pedidos');
    };

    return {
      loading,
      error,
      paymentInfo,
      statusText,
      formatAmount,
      formatDate,
      goToHome,
      viewOrders
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
  background: var(--color-card);
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

.container-success, .actions{
  background-color: var(--color-card);
}

.icon-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  background-color: var(--color-card);
}

.icon-success {
  background-color: #4caf50;
  font-size: 3rem;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.icon-error{
  background-color: #F44336;
  font-size: 3rem;
  color: white;
  border-radius: 50%;
}

strong{
  background-color: var(--color-card);
}

h1 {
  color: var(--color-foreground);
  margin-bottom: 10px;
  font-size: 1.8rem;
  background-color: var(--color-card);
}

p {
  color: var(--color-muted-foreground);
  background-color: var(--color-card);
  margin-bottom: 20px;
}

.payment-info {
  background-color: var(--color-card);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid var(--color-border);
}

.payment-info p {
  margin: 10px 0;
  color: var(--color-foreground);
  background-color: var(--color-card);
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

.btn-primary:hover {
  background: var(--sidebar-ring);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--color-accent);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-muted);
}

.loading-container {
  text-align: center;
  padding: 40px 20px;
  background-color: var(--color-card);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  background-color: var(--color-card);
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-left: 8px;
}

.status-badge.approved {
  background: #4caf50;
  color: white;
}

.status-badge.pending {
  background: #ff9800;
  color: white;
}

.status-badge.rejected {
  background: #f44336;
  color: white;
}

.status-badge.cancelled {
  background: #9e9e9e;
  color: white;
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
  
  .icon-success, .icon-error {
    font-size: 3.5rem;
    width: 60px;
    height: 60px;
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
    gap: 15px;
    margin-top: 35px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 15px 25px;
    font-size: 1.1rem;
  }
  
  .spinner {
    width: 60px;
    height: 60px;
    border-width: 5px;
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
  
  .icon-success, .icon-error {
    font-size: 2.8rem;
    width: 55px;
    height: 55px;
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
  
  .btn-primary, .btn-secondary {
    padding: 14px 20px;
    font-size: 1rem;
  }
  
  .spinner {
    width: 55px;
    height: 55px;
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
  
  .icon-success, .icon-error {
    font-size: 2.5rem;
    width: 45px;
    height: 45px;
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
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 12px 20px;
    font-size: 1rem;
    width: 100%;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    margin-bottom: 15px;
  }
  
  .loading-container h2 {
    font-size: 1.3rem;
  }
  
  .status-badge {
    font-size: 0.8rem;
    padding: 3px 10px;
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
  
  .icon-success, .icon-error {
    font-size: 2rem;
    width: 40px;
    height: 40px;
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
    gap: 10px;
    margin-top: 18px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .spinner {
    width: 45px;
    height: 45px;
    border-width: 3px;
  }
}
</style>