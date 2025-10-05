<template>
  <div class="payment-result-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <h2>Procesando pago...</h2>
      <p>Por favor espera mientras verificamos tu pago.</p>
    </div>

    <div v-else-if="success" class="success-message">
      <div class="success-icon">✅</div>
      <h1>¡Pago Exitoso!</h1>
      <p>Tu pago ha sido procesado correctamente.</p>
      
      <div class="order-info" v-if="orderInfo">
        <h3>Información del Pedido</h3>
        <p><strong>Número de pedido:</strong> #{{ orderInfo.id }}</p>
        <p><strong>Total pagado:</strong> ${{ orderInfo.total.toLocaleString() }}</p>
        <p><strong>Estado:</strong> {{ getStatusText(orderInfo.estado) }}</p>
      </div>

      <div class="next-steps">
        <h3>¿Qué sigue?</h3>
        <ul>
          <li>Recibirás un email de confirmación en breve</li>
          <li>Tu pedido será procesado y enviado según el método seleccionado</li>
          <li>Puedes hacer seguimiento de tu pedido en tu panel de usuario</li>
        </ul>
      </div>

      <div class="actions">
        <router-link to="/productos" class="btn btn-primary">Seguir comprando</router-link>
        <router-link v-if="orderInfo" :to="`/pedido/${orderInfo.id}`" class="btn btn-secondary">Ver detalles del pedido</router-link>
      </div>
    </div>

    <div v-else class="error-message">
      <div class="error-icon">❌</div>
      <h1>Error en el pago</h1>
      <p>{{ errorMessage || 'Hubo un problema procesando tu pago.' }}</p>
      
      <div class="next-steps">
        <h3>¿Qué puedes hacer?</h3>
        <ul>
          <li>Verifica que tu tarjeta tenga fondos suficientes</li>
          <li>Intenta con otro método de pago</li>
          <li>Si el problema persiste, contacta a soporte</li>
        </ul>
      </div>

      <div class="actions">
        <router-link to="/carrito" class="btn btn-primary">Volver al carrito</router-link>
        <router-link to="/contacto" class="btn btn-secondary">Contactar soporte</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentAPI } from '../services/api.js';

export default {
  name: 'PaymentSuccess',
  data() {
    return {
      loading: true,
      success: false,
      orderInfo: null,
      errorMessage: ''
    };
  },
  async mounted() {
    await this.processPaymentResult();
  },
  methods: {
    async processPaymentResult() {
      try {
        // Obtener parámetros de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const collection_id = urlParams.get('collection_id');
        const collection_status = urlParams.get('collection_status');
        const external_reference = urlParams.get('external_reference');

        console.log('Payment result params:', { collection_id, collection_status, external_reference });

        if (collection_status === 'approved' && external_reference) {
          // Pago exitoso, obtener información del pedido
          try {
            const response = await paymentAPI.getOrderStatus(external_reference);
            if (response.success) {
              this.orderInfo = response.pedido;
              this.success = true;
              
              // Limpiar el ID del pedido del localStorage
              localStorage.removeItem('current_order_id');
            } else {
              throw new Error(response.error);
            }
          } catch (error) {
            console.error('Error al obtener info del pedido:', error);
            // Aún así mostrar como exitoso si el pago fue aprobado
            this.success = true;
            this.orderInfo = { id: external_reference };
          }
        } else {
          // Pago no exitoso
          this.success = false;
          
          switch (collection_status) {
            case 'rejected':
              this.errorMessage = 'Tu pago fue rechazado. Verifica los datos de tu tarjeta.';
              break;
            case 'cancelled':
              this.errorMessage = 'El pago fue cancelado.';
              break;
            case 'pending':
              this.errorMessage = 'Tu pago está pendiente de procesamiento.';
              break;
            default:
              this.errorMessage = 'Hubo un problema procesando tu pago.';
          }
        }

      } catch (error) {
        console.error('Error procesando resultado del pago:', error);
        this.success = false;
        this.errorMessage = 'Error al verificar el estado del pago.';
      } finally {
        this.loading = false;
      }
    },
    getStatusText(status) {
      const statusMap = {
        'pendiente': 'Pendiente de pago',
        'pagado': 'Pagado',
        'enviado': 'Enviado',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
      };
      return statusMap[status] || status;
    }
  }
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

.payment-result-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background-color: var(--color-background);
}

.loading, .success-message, .error-message {
  max-width: 600px;
  background-color: var(--color-card);
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  color: var(--color-foreground);
}

.loading .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-muted);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-icon, .error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-message h1 {
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.error-message h1 {
  color: var(--color-destructive);
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

.order-info {
  background-color: var(--color-accent);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: left;
}

.order-info h3 {
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-align: center;
}

.order-info p {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.next-steps {
  text-align: left;
  margin: 2rem 0;
}

.next-steps h3 {
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-align: center;
}

.next-steps ul {
  padding-left: 1.5rem;
}

.next-steps li {
  margin: 0.5rem 0;
  color: var(--color-muted-foreground);
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}

.btn-primary:hover {
  background-color: var(--sidebar-ring);
  color: var(--color-foreground);
  transform: scale(1.05);
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-secondary-foreground);
}

.btn-secondary:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .payment-result-container {
    padding: 1rem;
  }
  
  .loading, .success-message, .error-message {
    padding: 2rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .success-message h1, .error-message h1 {
    font-size: 2rem;
  }
}
</style>