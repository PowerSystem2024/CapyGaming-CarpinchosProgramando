<template>
  <div class="payment-response">
    <div class="response-container success">
      <div class="icon-container">
        <div class="success-icon">✅</div>
      </div>

      <h1>¡Pago Exitoso!</h1>

      <p class="main-message">
        Tu pago ha sido procesado correctamente a través de MercadoPago.
      </p>

      <div class="payment-details" v-if="paymentInfo">
        <div class="detail-item">
          <span class="label">ID de Pago:</span>
          <span class="value">{{ paymentInfo.payment_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Estado:</span>
          <span class="value status-approved">Aprobado</span>
        </div>
        <div class="detail-item" v-if="paymentInfo.external_reference">
          <span class="label">Orden:</span>
          <span class="value">#{{ paymentInfo.external_reference }}</span>
        </div>
      </div>

      <div class="info-box">
        <h3>¿Qué sigue ahora?</h3>
        <ul>
          <li>Recibirás un email con los detalles de tu compra</li>
          <li>Procesaremos tu pedido en las próximas 24 horas</li>
          <li>Te notificaremos cuando tu pedido sea enviado</li>
        </ul>
      </div>

      <div class="action-buttons">
        <router-link to="/" class="btn btn-secondary">
          Volver al inicio
        </router-link>
        <router-link
          v-if="paymentInfo && paymentInfo.external_reference"
          :to="`/order-confirmation/${paymentInfo.external_reference}`"
          class="btn btn-primary"
        >
          Ver mi pedido
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentSuccess',
  data() {
    return {
      paymentInfo: null
    }
  },
  mounted() {
    this.extractPaymentInfo();
  },
  methods: {
    extractPaymentInfo() {
      const urlParams = new URLSearchParams(window.location.search);
      this.paymentInfo = {
        collection_id: urlParams.get('collection_id'),
        collection_status: urlParams.get('collection_status'),
        payment_id: urlParams.get('payment_id'),
        status: urlParams.get('status'),
        external_reference: urlParams.get('external_reference'),
        payment_type: urlParams.get('payment_type'),
        merchant_order_id: urlParams.get('merchant_order_id'),
        preference_id: urlParams.get('preference_id')
      };

      console.log('Payment info:', this.paymentInfo);

      // Actualizar estado del pedido en la base de datos si tenemos la referencia
      if (this.paymentInfo.external_reference && this.paymentInfo.payment_id) {
        this.updateOrderStatus();
      }
    },
    async updateOrderStatus() {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${this.paymentInfo.external_reference}/payment-status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentId: this.paymentInfo.payment_id,
            status: this.paymentInfo.status,
            paymentMethod: 'mercadopago'
          })
        });

        const data = await response.json();
        console.log('Order status updated:', data);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  }
}
</script>

<style scoped>
@import url(../assets/styles/base.css);

.payment-response {
  min-height: 100vh;
  padding: 80px 20px;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
}

.response-container {
  max-width: 600px;
  width: 100%;
  background: var(--color-card);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.response-container.success {
  border: 2px solid #4caf50;
}

.icon-container {
  margin-bottom: 20px;
}

.success-icon {
  font-size: 80px;
  animation: bounce 0.6s ease-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

h1 {
  color: #4caf50;
  font-size: 2.2rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.main-message {
  color: var(--color-foreground);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.payment-details {
  background: var(--color-background);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid var(--color-border);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: var(--color-muted-foreground);
  font-weight: 500;
}

.value {
  color: var(--color-foreground);
  font-weight: 600;
}

.status-approved {
  color: #4caf50;
}

.info-box {
  background: var(--color-accent);
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: left;
  border: 1px solid var(--color-border);
}

.info-box h3 {
  color: var(--color-primary);
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.info-box ul {
  list-style: none;
  padding: 0;
}

.info-box li {
  color: var(--color-foreground);
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.info-box li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #4caf50;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
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

@media (max-width: 768px) {
  .response-container {
    padding: 30px 20px;
  }

  h1 {
    font-size: 1.8rem;
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