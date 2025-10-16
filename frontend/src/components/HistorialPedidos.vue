<template>
  <div class="historial-pedidos">
    <div class="container">
      <h1>Mis Pedidos</h1>

      <div v-if="loading" class="loading">
        <p>Cargando pedidos...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="cargarPedidos" class="btn-retry">Reintentar</button>
      </div>

      <div v-else-if="pedidos.length === 0" class="sin-pedidos">
        <p>No tienes pedidos aún.</p>
        <router-link to="/" class="btn-primary">Ir a comprar</router-link>
      </div>

      <div v-else class="pedidos-lista">
        <div v-for="pedido in pedidos" :key="pedido.id_pedido" class="pedido-card">
          <div class="pedido-header">
            <div class="pedido-numero">
              <span class="label">Pedido</span>
              <span class="valor">#{{ pedido.id_pedido }}</span>
            </div>
            <span class="pedido-estado" :class="getEstadoClass(pedido.estado_pedido)">
              {{ getEstadoTexto(pedido.estado_pedido) }}
            </span>
          </div>

          <div class="pedido-info">
            <div class="info-row">
              <span class="label">Fecha:</span>
              <span class="valor">{{ formatearFecha(pedido.fecha_creacion) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Total:</span>
              <span class="valor">${{ pedido.total.toLocaleString('es-AR') }}</span>
            </div>
            <div class="info-row">
              <span class="label">Método de pago:</span>
              <span class="valor">{{ formatearMetodoPago(pedido.metodo_pago) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Estado de pago:</span>
              <span class="valor" :class="getEstadoPagoClass(pedido.estado_pago)">
                {{ getEstadoPagoTexto(pedido.estado_pago) }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">Productos:</span>
              <span class="valor">{{ pedido.cantidad_productos }} artículo(s)</span>
            </div>
          </div>

          <div class="pedido-acciones">
            <button @click="verDetalle(pedido.id_pedido)" class="btn-detalle">
              Ver detalle
            </button>
            <button
              v-if="pedido.estado_pedido === 'pendiente' && pedido.estado_pago === 'pendiente'"
              @click="cancelarPedido(pedido.id_pedido)"
              class="btn-cancelar"
              :disabled="cancelando === pedido.id_pedido"
            >
              {{ cancelando === pedido.id_pedido ? 'Cancelando...' : 'Cancelar pedido' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalle del pedido -->
    <div v-if="pedidoDetalle" class="modal-overlay" @click="cerrarDetalle">
      <div class="modal-detalle" @click.stop>
        <button class="btn-cerrar" @click="cerrarDetalle">×</button>

        <h2>Detalle del Pedido #{{ pedidoDetalle.pedido.id_pedido }}</h2>

        <div class="detalle-seccion">
          <h3>Información de envío</h3>
          <p><strong>Nombre:</strong> {{ pedidoDetalle.pedido.nombre_envio }} {{ pedidoDetalle.pedido.apellido_envio }}</p>
          <p><strong>Dirección:</strong> {{ pedidoDetalle.pedido.direccion_envio }}</p>
          <p><strong>Ciudad:</strong> {{ pedidoDetalle.pedido.ciudad_envio }}</p>
          <p><strong>Provincia:</strong> {{ pedidoDetalle.pedido.provincia_envio }}</p>
          <p><strong>C.P.:</strong> {{ pedidoDetalle.pedido.codigo_postal_envio }}</p>
        </div>

        <div class="detalle-seccion">
          <h3>Productos</h3>
          <div class="productos-detalle">
            <div v-for="item in pedidoDetalle.items" :key="item.id_detalle" class="producto-item">
              <img v-if="item.imagen_url" :src="item.imagen_url" :alt="item.nombre_producto" class="producto-imagen" />
              <div class="producto-info">
                <p class="producto-nombre">{{ item.nombre_producto }}</p>
                <p class="producto-precio">${{ parseFloat(item.precio_unitario).toLocaleString('es-AR') }} x {{ item.cantidad }}</p>
              </div>
              <div class="producto-total">
                ${{ parseFloat(item.subtotal).toLocaleString('es-AR') }}
              </div>
            </div>
          </div>
        </div>

        <div class="detalle-totales">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${{ parseFloat(pedidoDetalle.pedido.subtotal).toLocaleString('es-AR') }}</span>
          </div>
          <div class="total-row">
            <span>Envío:</span>
            <span>${{ parseFloat(pedidoDetalle.pedido.costo_envio).toLocaleString('es-AR') }}</span>
          </div>
          <div class="total-row total-final">
            <strong>Total:</strong>
            <strong>${{ parseFloat(pedidoDetalle.pedido.total).toLocaleString('es-AR') }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderService from '../services/orderService';

export default {
  name: 'HistorialPedidos',
  data() {
    return {
      pedidos: [],
      loading: true,
      error: null,
      pedidoDetalle: null,
      cancelando: null
    }
  },
  mounted() {
    this.cargarPedidos();
  },
  methods: {
    async cargarPedidos() {
      this.loading = true;
      this.error = null;

      try {
        const result = await OrderService.getUserOrders();
        this.pedidos = result.pedidos;
      } catch (error) {
        this.error = error.message || 'Error al cargar los pedidos';
      } finally {
        this.loading = false;
      }
    },
    async verDetalle(id_pedido) {
      try {
        const result = await OrderService.getOrderById(id_pedido);
        this.pedidoDetalle = result;
      } catch (error) {
        alert('Error al cargar el detalle del pedido');
      }
    },
    cerrarDetalle() {
      this.pedidoDetalle = null;
    },
    async cancelarPedido(id_pedido) {
      if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
        return;
      }

      this.cancelando = id_pedido;

      try {
        await OrderService.cancelOrder(id_pedido);
        alert('Pedido cancelado exitosamente');
        this.cargarPedidos(); // Recargar la lista
      } catch (error) {
        alert(error.message || 'Error al cancelar el pedido');
      } finally {
        this.cancelando = null;
      }
    },
    formatearFecha(fecha) {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    formatearMetodoPago(metodo) {
      const metodos = {
        'mercadopago': 'Mercado Pago',
        'tarjeta': 'Tarjeta de crédito/débito',
        'transferencia': 'Transferencia bancaria',
        'efectivo': 'Efectivo'
      };
      return metodos[metodo] || metodo;
    },
    getEstadoTexto(estado) {
      const estados = {
        'pendiente': 'Pendiente',
        'pagado': 'Pagado',
        'procesando': 'Procesando',
        'enviado': 'Enviado',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
      };
      return estados[estado] || estado;
    },
    getEstadoClass(estado) {
      return `estado-${estado}`;
    },
    getEstadoPagoTexto(estado) {
      const estados = {
        'pendiente': 'Pendiente',
        'aprobado': 'Aprobado',
        'rechazado': 'Rechazado',
        'reembolsado': 'Reembolsado'
      };
      return estados[estado] || estado;
    },
    getEstadoPagoClass(estado) {
      return `pago-${estado}`;
    }
  }
}
</script>

<style scoped>
.historial-pedidos {
  min-height: 80vh;
  padding: 40px 20px;
  background: var(--color-background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: var(--color-foreground);
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-align: center;
}

.loading,
.sin-pedidos {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-muted-foreground);
}

.error-message {
  text-align: center;
  padding: 40px 20px;
  color: #f44336;
}

.btn-retry,
.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  text-decoration: none;
  display: inline-block;
}

.pedidos-lista {
  display: grid;
  gap: 20px;
}

.pedido-card {
  background: var(--color-card);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.pedido-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--color-border);
}

.pedido-numero {
  display: flex;
  flex-direction: column;
}

.pedido-numero .label {
  color: var(--color-muted-foreground);
  font-size: 0.9rem;
}

.pedido-numero .valor {
  color: var(--color-foreground);
  font-size: 1.5rem;
  font-weight: 700;
}

.pedido-estado {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.estado-pendiente {
  background: #fff3cd;
  color: #856404;
}

.estado-pagado {
  background: #d4edda;
  color: #155724;
}

.estado-procesando {
  background: #d1ecf1;
  color: #0c5460;
}

.estado-enviado {
  background: #cce5ff;
  color: #004085;
}

.estado-entregado {
  background: #d4edda;
  color: #155724;
}

.estado-cancelado {
  background: #f8d7da;
  color: #721c24;
}

.pedido-info {
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.info-row .label {
  color: var(--color-muted-foreground);
  font-weight: 500;
}

.info-row .valor {
  color: var(--color-foreground);
  font-weight: 600;
}

.pago-aprobado {
  color: #4caf50;
}

.pago-pendiente {
  color: #ff9800;
}

.pago-rechazado {
  color: #f44336;
}

.pedido-acciones {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-detalle,
.btn-cancelar {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-detalle {
  background: var(--color-primary);
  color: white;
  flex: 1;
}

.btn-detalle:hover {
  background: var(--sidebar-ring);
}

.btn-cancelar {
  background: var(--color-accent);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}

.btn-cancelar:hover {
  background: #f44336;
  color: white;
  border-color: #f44336;
}

.btn-cancelar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal de detalle */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-detalle {
  background: var(--color-background);
  border-radius: 16px;
  padding: 40px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.btn-cerrar {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--color-muted-foreground);
  cursor: pointer;
  line-height: 1;
}

.modal-detalle h2 {
  color: var(--color-foreground);
  margin-bottom: 30px;
}

.detalle-seccion {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.detalle-seccion h3 {
  color: var(--color-primary);
  margin-bottom: 15px;
}

.detalle-seccion p {
  color: var(--color-foreground);
  margin: 8px 0;
}

.productos-detalle {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.producto-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--color-card);
  border-radius: 8px;
}

.producto-imagen {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.producto-info {
  flex: 1;
}

.producto-nombre {
  font-weight: 600;
  color: var(--color-foreground);
  margin-bottom: 5px;
}

.producto-precio {
  color: var(--color-muted-foreground);
  font-size: 0.9rem;
}

.producto-total {
  font-weight: 700;
  color: var(--color-foreground);
  font-size: 1.1rem;
}

.detalle-totales {
  margin-top: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: var(--color-foreground);
}

.total-final {
  border-top: 2px solid var(--color-primary);
  padding-top: 15px;
  margin-top: 10px;
  font-size: 1.3rem;
}

@media (max-width: 640px) {
  .pedido-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .pedido-acciones {
    flex-direction: column;
  }

  .modal-detalle {
    padding: 20px;
  }

  .producto-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
