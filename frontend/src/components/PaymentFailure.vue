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

/* Media Queries para Responsive */
/* Pantallas grandes (desktops, 1200px en adelante) */
@media (min-width: 1200px) {
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
  
  .actions {
    gap: 15px;
    margin-top: 35px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 15px 25px;
    font-size: 1.1rem;
  }
}

/* Pantallas medianas (tablets, 768px a 1199px) */
@media (max-width: 1199px) and (min-width: 768px) {
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
  
  .payment-info {
    padding: 18px;
    margin: 18px 0;
  }
  
  .actions {
    margin-top: 25px;
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
}

/* Pantallas muy pequeñas (móviles pequeños, hasta 480px) */
@media (max-width: 480px) {
  .payment-status {
    padding: 10px;
  }
  
  .status-card {
    padding: 25px 20px;
    margin-top: 15px;
    border-radius: 10px;
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
  }
  
  .payment-info {
    padding: 12px;
    margin: 12px 0;
  }
  
  .payment-info p {
    font-size: 0.85rem;
  }
  
  .actions {
    gap: 10px;
    margin-top: 18px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
</style>