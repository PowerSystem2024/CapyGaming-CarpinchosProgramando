<template>
  <div class="pago-resultado">
    <div class="resultado-container pendiente">
      <div class="icono-container">
        <span class="icono-pendiente">⏱</span>
      </div>

      <h1>Pago pendiente</h1>
      <p class="mensaje-principal">Tu pedido está en proceso de confirmación.</p>

      <div v-if="pedidoInfo" class="pedido-info">
        <div class="info-item">
          <span class="label">Número de pedido:</span>
          <span class="valor">#{{ pedidoInfo.id_pedido }}</span>
        </div>
        <div class="info-item">
          <span class="label">Total:</span>
          <span class="valor">${{ pedidoInfo.total }}</span>
        </div>
      </div>

      <div class="mensaje-secundario">
        <p><strong>¿Qué significa esto?</strong></p>
        <p>Tu pedido ha sido registrado pero el pago aún no ha sido confirmado. Esto puede suceder cuando:</p>
        <ul>
          <li>Elegiste pagar en efectivo o transferencia bancaria</li>
          <li>La entidad bancaria está procesando el pago</li>
          <li>Hay una demora en la confirmación del pago</li>
        </ul>
      </div>

      <div class="info-adicional">
        <p>Recibirás un email cuando el pago sea confirmado. Puedes revisar el estado de tu pedido en tu cuenta.</p>
      </div>

      <div class="acciones">
        <router-link to="/pedidos" class="btn btn-primary">
          Ver mis pedidos
        </router-link>
        <router-link to="/" class="btn btn-secondary">
          Volver al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import OrderService from '../services/orderService';

export default {
  name: 'PagoPendiente',
  data() {
    return {
      pedidoInfo: null
    }
  },
  mounted() {
    this.cargarPedido();
  },
  methods: {
    async cargarPedido() {
      const pedidoId = this.$route.query.pedido;
      if (pedidoId) {
        try {
          const result = await OrderService.getOrderById(pedidoId);
          this.pedidoInfo = result.pedido;
        } catch (error) {
          console.error('Error cargando pedido:', error);
        }
      }
    }
  }
}
</script>

<style scoped>
.pago-resultado {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--color-background);
}

.resultado-container {
  max-width: 600px;
  width: 100%;
  background: var(--color-card);
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.resultado-container.pendiente {
  border-top: 4px solid #ff9800;
}

.icono-container {
  margin-bottom: 30px;
}

.icono-pendiente {
  display: inline-block;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  background: #ff9800;
  color: white;
  font-size: 50px;
}

.resultado-container h1 {
  color: var(--color-foreground);
  font-size: 2rem;
  margin-bottom: 15px;
}

.mensaje-principal {
  color: var(--color-muted-foreground);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.pedido-info {
  background: var(--color-accent);
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: var(--color-muted-foreground);
  font-weight: 500;
}

.valor {
  color: var(--color-foreground);
  font-weight: 600;
  font-size: 1.1rem;
}

.mensaje-secundario {
  background: var(--color-accent);
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  text-align: left;
}

.mensaje-secundario p {
  color: var(--color-foreground);
  margin-bottom: 15px;
  line-height: 1.6;
}

.mensaje-secundario ul {
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.mensaje-secundario li {
  color: var(--color-muted-foreground);
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.mensaje-secundario li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ff9800;
  font-size: 1.5rem;
}

.info-adicional {
  margin: 30px 0;
}

.info-adicional p {
  color: var(--color-muted-foreground);
  line-height: 1.6;
}

.acciones {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 14px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
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

@media (max-width: 640px) {
  .resultado-container {
    padding: 40px 20px;
  }

  .acciones {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
