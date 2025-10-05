<template>
  <div class="order-status-container">
    <div v-if="loading" class="loading">
      <p>Cargando estado del pedido...</p>
    </div>

    <div v-else-if="error" class="error">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <router-link to="/carrito" class="btn btn-primary">Volver al carrito</router-link>
    </div>

    <div v-else-if="pedido" class="order-details">
      <div class="order-header">
        <h1>Estado del Pedido #{{ pedido.id }}</h1>
        <div class="status-badge" :class="'status-' + pedido.estado">
          {{ getStatusText(pedido.estado) }}
        </div>
      </div>

      <div class="order-info">
        <div class="info-section">
          <h3>Información del Pedido</h3>
          <p><strong>Fecha:</strong> {{ formatDate(pedido.fecha_creacion) }}</p>
          <p><strong>Total:</strong> ${{ pedido.total.toLocaleString() }}</p>
          <p><strong>Dirección de envío:</strong> {{ pedido.direccion_envio }}</p>
          <p v-if="pedido.telefono_contacto"><strong>Teléfono:</strong> {{ pedido.telefono_contacto }}</p>
        </div>

        <div class="items-section">
          <h3>Productos</h3>
          <div class="order-items">
            <div v-for="item in pedido.items" :key="item.producto_id" class="order-item">
              <div class="item-info">
                <span class="item-name">{{ item.nombre_producto }}</span>
                <span class="item-quantity">Cantidad: {{ item.cantidad }}</span>
                <span class="item-price">${{ item.precio_unitario.toLocaleString() }} c/u</span>
                <span class="item-subtotal"><strong>${{ item.subtotal.toLocaleString() }}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div class="history-section" v-if="pedido.historial && pedido.historial.length > 0">
          <h3>Historial del Pedido</h3>
          <div class="history-timeline">
            <div v-for="evento in pedido.historial" :key="evento.id" class="timeline-item">
              <div class="timeline-date">{{ formatDate(evento.fecha_cambio) }}</div>
              <div class="timeline-status">{{ getStatusText(evento.estado_nuevo) }}</div>
              <div class="timeline-note" v-if="evento.observaciones">{{ evento.observaciones }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-actions">
        <router-link to="/productos" class="btn btn-primary">Seguir comprando</router-link>
        <router-link to="/mis-pedidos" class="btn btn-secondary">Ver todos mis pedidos</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentAPI } from '../services/api.js';

export default {
  name: 'OrderStatus',
  data() {
    return {
      pedido: null,
      loading: true,
      error: null
    };
  },
  async mounted() {
    await this.loadOrderStatus();
  },
  methods: {
    async loadOrderStatus() {
      try {
        const orderId = this.$route.params.orderId;
        if (!orderId) {
          this.error = 'ID de pedido no válido';
          this.loading = false;
          return;
        }

        const response = await paymentAPI.getOrderStatus(orderId);
        if (response.success) {
          this.pedido = response.pedido;
        } else {
          this.error = response.error || 'Error al cargar el pedido';
        }
      } catch (error) {
        console.error('Error al cargar estado del pedido:', error);
        this.error = 'Error al conectar con el servidor';
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
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

.order-status-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background-color: var(--color-background);
  color: var(--color-foreground);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  background-color: var(--color-card);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error h2 {
  color: var(--color-destructive);
  margin-bottom: 1rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border);
}

.order-header h1 {
  color: var(--color-primary);
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.status-pendiente {
  background-color: #fff3cd;
  color: #856404;
}

.status-pagado {
  background-color: #d1edff;
  color: #004085;
}

.status-enviado {
  background-color: #d4edda;
  color: #155724;
}

.status-entregado {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-cancelado {
  background-color: #f8d7da;
  color: #721c24;
}

.order-info {
  display: grid;
  gap: 2rem;
}

.info-section, .items-section, .history-section {
  background-color: var(--color-card);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-section h3, .items-section h3, .history-section h3 {
  color: var(--color-primary);
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background-color: var(--color-background);
}

.item-info {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  width: 100%;
  align-items: center;
}

.item-name {
  font-weight: bold;
  color: var(--color-foreground);
}

.item-subtotal {
  text-align: right;
  color: var(--color-primary);
}

.history-timeline {
  position: relative;
}

.timeline-item {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1rem;
  border-left: 2px solid var(--color-primary);
}

.timeline-item:before {
  content: '';
  position: absolute;
  left: -6px;
  top: 0.5rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-primary);
}

.timeline-date {
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  margin-bottom: 0.25rem;
}

.timeline-status {
  font-weight: bold;
  color: var(--color-foreground);
  margin-bottom: 0.25rem;
}

.timeline-note {
  font-size: 0.9rem;
  color: var(--color-muted-foreground);
  font-style: italic;
}

.order-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
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
  .order-status-container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .order-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .item-info {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .order-actions {
    flex-direction: column;
  }
}
</style>