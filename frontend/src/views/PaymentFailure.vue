<template>
  <div class="payment-response">
    <div class="response-container failure">
      <div class="icon-container">
        <div class="failure-icon">❌</div>
      </div>

      <h1>Pago Rechazado</h1>

      <p class="main-message">
        Tu pago no pudo ser procesado. Por favor, intenta nuevamente.
      </p>

      <div class="payment-details" v-if="paymentInfo">
        <div class="detail-item">
          <span class="label">Estado:</span>
          <span class="value status-rejected">Rechazado</span>
        </div>
        <div class="detail-item" v-if="paymentInfo.external_reference">
          <span class="label">Orden:</span>
          <span class="value">#{{ paymentInfo.external_reference }}</span>
        </div>
      </div>

      <div class="info-box error">
        <h3>¿Por qué fue rechazado?</h3>
        <p>Las razones más comunes incluyen:</p>
        <ul>
          <li>Fondos insuficientes en la tarjeta</li>
          <li>Datos de la tarjeta incorrectos</li>
          <li>Límite de crédito excedido</li>
          <li>Tarjeta bloqueada o vencida</li>
        </ul>
      </div>

      <div class="action-buttons">
        <router-link to="/cart" class="btn btn-secondary">
          Volver al carrito
        </router-link>
        <button @click="retryPayment" class="btn btn-primary">
          Intentar nuevamente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentFailure',
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

      console.log('Payment failure info:', this.paymentInfo);
    },
    retryPayment() {
      // Volver al checkout para reintentar
      this.$router.push('/cart');
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

.response-container.failure {
  border: 2px solid var(--color-destructive);
}

.icon-container {
  margin-bottom: 20px;
}

.failure-icon {
  font-size: 80px;
  animation: shake 0.5s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

h1 {
  color: var(--color-destructive);
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

.status-rejected {
  color: var(--color-destructive);
}

.info-box {
  background: var(--color-accent);
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: left;
  border: 1px solid var(--color-border);
}

.info-box.error {
  background: rgba(244, 67, 54, 0.05);
  border-color: var(--color-destructive);
}

.info-box h3 {
  color: var(--color-destructive);
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.info-box p {
  color: var(--color-foreground);
  margin-bottom: 10px;
}

.info-box ul {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.info-box li {
  color: var(--color-foreground);
  padding: 5px 0;
  padding-left: 25px;
  position: relative;
}

.info-box li:before {
  content: "•";
  position: absolute;
  left: 10px;
  color: var(--color-destructive);
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