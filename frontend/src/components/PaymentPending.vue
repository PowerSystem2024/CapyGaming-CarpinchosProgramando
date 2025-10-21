<template>
  <div class="payment-status pending">
    <div class="status-card">
      <div class="icon-container pending">
        <span class="icon">⏱</span>
      </div>
      <h1>Pago pendiente</h1>
      <p>Tu pago está siendo procesado. Te notificaremos cuando se complete.</p>
      <div class="payment-info">
        <p><strong>ID de pago:</strong> {{ paymentId }}</p>
        <p>Este proceso puede tardar algunos minutos.</p>
      </div>
      <div class="actions">
        <button @click="goToHome" class="btn-primary">Volver al inicio</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'PaymentPending',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const paymentId = ref(route.query.payment_id || 'N/A');

    const goToHome = () => {
      router.push('/');
    };

    return {
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

.icon {
  font-size: 3rem;
  color: white;
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
</style>
