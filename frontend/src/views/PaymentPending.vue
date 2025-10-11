<template>
  <div class="payment-response">
    <div class="response-container pending">
      <div class="icon-container">
        <div class="pending-icon">⏳</div>
      </div>

      <h1>Pago Pendiente</h1>

      <p class="main-message">
        Tu pago está siendo procesado y estará confirmado pronto.
      </p>

      <div class="payment-details" v-if="paymentInfo">
        <div class="detail-item">
          <span class="label">Estado:</span>
          <span class="value status-pending">En proceso</span>
        </div>
        <div class="detail-item" v-if="paymentInfo.external_reference">
          <span class="label">Orden:</span>
          <span class="value">#{{ paymentInfo.external_reference }}</span>
        </div>
      </div>

      <div class="info-box">
        <h3>¿Qué significa esto?</h3>
        <ul>
          <li>Tu pago está siendo verificado por MercadoPago</li>
          <li>Este proceso puede tomar hasta 48 horas hábiles</li>
          <li>Recibirás un email cuando el pago sea confirmado</li>
          <li>Tu pedido será procesado una vez confirmado el pago</li>
        </ul>
      </div>

      <div class="alert-box">
        <p>
          <strong>Importante:</strong> Guarda el número de tu orden para seguimiento.
          Te notificaremos por email cuando tu pago sea aprobado.
        </p>
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
  name: 'PaymentPending',
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

      console.log('Payment pending info:', this.paymentInfo);
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

.response-container.pending {
  border: 2px solid var(--color-primary);
}

.icon-container {
  margin-bottom: 20px;
}

.pending-icon {
  font-size: 80px;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h1 {
  color: var(--color-primary);
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

.status-pending {
  color: var(--color-primary);
}

.info-box {
  background: var(--color-accent);
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 20px;
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
  content: "⚡";
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.alert-box {
  background: rgba(243, 156, 18, 0.1);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.alert-box p {
  color: var(--color-foreground);
  margin: 0;
  line-height: 1.6;
}

.alert-box strong {
  color: var(--color-primary);
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