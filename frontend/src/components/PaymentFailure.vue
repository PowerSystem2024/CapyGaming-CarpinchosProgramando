<template>
  <div class="payment-status failure">
    <div class="status-card">
      <div class="icon-container failure">
        <span class="icon">✕</span>
      </div>
      <h1>Pago rechazado</h1>
      <p>No pudimos procesar tu pago. Por favor, intentá nuevamente.</p>
      <div class="payment-info error">
        <p><strong>Motivo:</strong> {{ errorMessage }}</p>
      </div>
      <div class="actions">
        <button @click="retry" class="btn-primary">Intentar de nuevo</button>
        <button @click="goToHome" class="btn-secondary">Volver al inicio</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'PaymentFailure',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const errorMessage = ref(route.query.error || 'Error desconocido');

    onMounted(() => {
      const paymentResult = {
        status: 'rejected',
        error: errorMessage.value
      };

      // Guardar resultado para que CheckoutForm lo lea
      localStorage.setItem('paymentResult', JSON.stringify(paymentResult));

      // Enviar mensaje a la pestaña original (si se abrió desde otra pestaña)
      if (window.opener && !window.opener.closed) {
        console.log('Enviando mensaje a pestaña original...');
        window.opener.postMessage({
          type: 'PAYMENT_RESULT',
          result: paymentResult
        }, window.location.origin);
      }

      // Limpiar flags de pago en proceso
      localStorage.removeItem('paymentInProgress');
      localStorage.removeItem('currentOrderId');

      // NO limpiamos el carrito aquí porque el usuario puede querer reintentar
    });

    const retry = () => {
      router.push('/carrito');
    };

    const goToHome = () => {
      router.push('/');
    };

    return {
      errorMessage,
      retry,
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

.icon-container.failure {
  background: #f44336;
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

.payment-info.error {
  border-color: #f44336;
}

.payment-info p {
  margin: 10px 0;
  color: var(--color-foreground);
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
</style>