<template>
  <div class="pago-resultado">
    <div class="resultado-container exitoso">
      <div class="icono-container">
        <span class="icono-exito">✓</span>
      </div>

      <h1>¡Pago exitoso!</h1>
      <p class="mensaje-principal">Tu pedido ha sido confirmado y pagado correctamente.</p>

      <div v-if="pedidoInfo" class="pedido-info">
        <div class="info-item">
          <span class="label">Número de pedido:</span>
          <span class="valor">#{{ pedidoInfo.id_pedido }}</span>
        </div>
        <div class="info-item">
          <span class="label">Total pagado:</span>
          <span class="valor">${{ pedidoInfo.total }}</span>
        </div>
      </div>

      <div class="mensaje-secundario">
        <p>Recibirás un email de confirmación con los detalles de tu compra.</p>
        <p>Puedes seguir el estado de tu pedido desde tu cuenta.</p>
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
  name: 'PagoExitoso',
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

.resultado-container.exitoso {
  border-top: 4px solid #4caf50;
}

.icono-container {
  margin-bottom: 30px;
}

.icono-exito {
  display: inline-block;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  background: #4caf50;
  color: white;
  font-size: 50px;
  font-weight: bold;
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
  margin: 30px 0;
}

.mensaje-secundario p {
  color: var(--color-muted-foreground);
  margin-bottom: 10px;
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
