<template>
  <div class="order-confirmation">
    <div class="confirmation-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando información del pedido...</p>
      </div>

      <div v-else-if="order" class="confirmation-content">
        <div class="success-icon">
          ✅
        </div>

        <h1>¡Pedido Confirmado!</h1>

        <div class="order-number">
          <span class="label">Número de pedido:</span>
          <span class="value">#{{ order.id_pedido }}</span>
        </div>

        <div class="order-info">
          <h2>Detalles del pedido</h2>

          <div class="customer-info">
            <h3>Información del cliente</h3>
            <p><strong>Nombre:</strong> {{ order.nombre }} {{ order.apellido }}</p>
            <p><strong>Email:</strong> {{ order.email }}</p>
          </div>

          <div class="items-list">
            <h3>Productos</h3>
            <div v-for="item in orderDetails" :key="item.id_detalle" class="item">
              <span class="item-name">{{ item.producto_nombre }}</span>
              <span class="item-quantity">x{{ item.cantidad }}</span>
              <span class="item-price">${{ (item.subtotal).toLocaleString('es-AR') }}</span>
            </div>
          </div>

          <div class="order-total">
            <span class="total-label">Total:</span>
            <span class="total-amount">${{ parseFloat(order.monto_total).toLocaleString('es-AR') }}</span>
          </div>

          <div class="payment-status" :class="order.estado_pago ? 'paid' : 'pending'">
            <span class="status-icon">{{ order.estado_pago ? '💳' : '⏳' }}</span>
            <span class="status-text">
              Estado del pago: {{ order.estado_pago ? 'Pagado' : 'Pendiente' }}
            </span>
          </div>
        </div>

        <div class="next-steps">
          <h3>Próximos pasos</h3>
          <ul>
            <li v-if="!order.estado_pago">Completa el pago siguiendo las instrucciones enviadas a tu email</li>
            <li>Recibirás un email con la confirmación del pedido</li>
            <li>Te notificaremos cuando tu pedido sea enviado</li>
            <li>Tiempo estimado de entrega: 5-7 días hábiles</li>
          </ul>
        </div>

        <div class="action-buttons">
          <router-link to="/" class="btn btn-secondary">
            Volver al inicio
          </router-link>
          <router-link to="/products" class="btn btn-primary">
            Seguir comprando
          </router-link>
        </div>
      </div>

      <div v-else class="error-message">
        <p>No se pudo cargar la información del pedido.</p>
        <router-link to="/" class="btn btn-primary">Volver al inicio</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderConfirmation',
  data() {
    return {
      order: null,
      orderDetails: [],
      loading: true
    }
  },
  async mounted() {
    await this.loadOrderInfo();
  },
  methods: {
    async loadOrderInfo() {
      try {
        const orderId = this.$route.params.id;

        const response = await fetch(`http://localhost:3001/api/orders/${orderId}`);
        const data = await response.json();

        if (data.success) {
          this.order = data.pedido;
          this.orderDetails = data.detalles;
        } else {
          console.error('Error al cargar el pedido');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
@import url(../assets/styles/base.css);

.order-confirmation {
  min-height: 100vh;
  padding: 80px 20px;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirmation-container {
  max-width: 800px;
  width: 100%;
  background: var(--color-card);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--color-primary);
}

.loading {
  text-align: center;
  padding: 60px 0;
}

.spinner {
  width: 60px;
  height: 60px;
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

.confirmation-content {
  text-align: center;
}

.success-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: bounce 0.6s ease-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

h1 {
  color: var(--color-primary);
  font-size: 2.5rem;
  margin-bottom: 30px;
  font-weight: 700;
}

.order-number {
  background: var(--color-accent);
  padding: 15px 30px;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 40px;
  border: 1px solid var(--color-primary);
}

.order-number .label {
  color: var(--color-muted-foreground);
  margin-right: 10px;
  font-size: 0.95rem;
}

.order-number .value {
  color: var(--color-primary);
  font-size: 1.4rem;
  font-weight: bold;
}

.order-info {
  text-align: left;
  background: var(--color-background);
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid var(--color-border);
}

.order-info h2 {
  color: var(--color-foreground);
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--color-primary);
}

.customer-info {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.customer-info h3, .items-list h3 {
  color: var(--color-primary);
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.customer-info p {
  margin: 5px 0;
  color: var(--color-foreground);
}

.items-list {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dotted var(--color-border);
}

.item:last-child {
  border-bottom: none;
}

.item-name {
  flex: 1;
  color: var(--color-foreground);
}

.item-quantity {
  color: var(--color-muted-foreground);
  margin: 0 20px;
}

.item-price {
  color: var(--color-secondary);
  font-weight: 600;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--color-primary);
}

.total-label {
  font-size: 1.3rem;
  color: var(--color-foreground);
  font-weight: 600;
}

.total-amount {
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: bold;
}

.payment-status {
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.payment-status.paid {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4caf50;
}

.payment-status.pending {
  background: rgba(243, 156, 18, 0.1);
  border: 1px solid var(--color-primary);
}

.status-icon {
  font-size: 24px;
}

.status-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-foreground);
}

.next-steps {
  background: var(--color-accent);
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: left;
  border: 1px solid var(--color-border);
}

.next-steps h3 {
  color: var(--color-primary);
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.next-steps ul {
  list-style: none;
  padding: 0;
}

.next-steps li {
  color: var(--color-foreground);
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.next-steps li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
  display: inline-block;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.btn-primary:hover {
  background: var(--sidebar-ring);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  transform: translateY(-2px);
}

.error-message {
  text-align: center;
  padding: 40px;
}

.error-message p {
  color: var(--color-destructive);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .confirmation-container {
    padding: 30px 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .order-info {
    padding: 20px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>