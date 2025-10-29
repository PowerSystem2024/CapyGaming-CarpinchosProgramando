<template>
  <div class="pedidos-container">
    <div class="pedidos-content">
      <!-- Cabecera -->
      <div class="pedidos-header">
        <button @click="volverAtras" class="btn-back">← Volver</button>
        <h1>Mis Pedidos</h1>
      </div>

      <!-- Filtros -->
      <div class="filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="currentFilter = filter.value"
          class="filter-btn"
          :class="{ active: currentFilter === filter.value }"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando pedidos...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadOrders" class="btn-retry">Reintentar</button>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredOrders.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h2>No tienes pedidos{{ currentFilter !== 'all' ? ' con este estado' : '' }}</h2>
        <p>Comienza a explorar nuestros productos</p>
        <router-link to="/" class="btn-primary">Ir a comprar</router-link>
      </div>

      <!-- Lista de pedidos -->
      <div v-else class="orders-grid">
        <div
          v-for="order in filteredOrders"
          :key="order.orden_id"
          class="order-card"
          @click="verDetalle(order.orden_id)"
        >
          <div class="order-card-header">
            <div class="order-id-section">
              <span class="order-label">Pedido</span>
              <span class="order-id">{{ order.orden_id }}</span>
            </div>
            <span class="order-status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="order-card-body">
            <div class="order-detail-row">
              <span class="detail-label">Fecha:</span>
              <span class="detail-value">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="order-detail-row">
              <span class="detail-label">Total:</span>
              <span class="detail-value price">${{ formatPrice(order.total) }}</span>
            </div>
            <div class="order-detail-row" v-if="order.payment_method">
              <span class="detail-label">Método de pago:</span>
              <span class="detail-value">{{ formatPaymentMethod(order.payment_method) }}</span>
            </div>
          </div>

          <div class="order-card-footer">
            <button class="btn-detail">Ver detalle →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/authService.js';
import orderService from '../services/orderService.js';

const router = useRouter();
const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const currentFilter = ref('all');

const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Aprobados', value: 'approved' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Rechazados', value: 'rejected' }
];

const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') {
    return orders.value;
  }
  return orders.value.filter(order => order.status === currentFilter.value);
});

onMounted(async () => {
  // Verificar autenticación
  const user = AuthService.getCurrentUser();
  if (!user) {
    router.push('/inicioSesion');
    return;
  }

  await loadOrders();
});

async function loadOrders() {
  try {
    loading.value = true;
    error.value = null;
    const response = await orderService.getUserOrders();
    orders.value = response.pedidos || response.orders || response || [];
  } catch (err) {
    console.error('Error loading orders:', err);
    error.value = 'No se pudieron cargar los pedidos. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
}

function verDetalle(orderId) {
  router.push(`/pedido/${orderId}`);
}

function volverAtras() {
  router.back();
}

function getStatusClass(status) {
  const statusMap = {
    'approved': 'status-success',
    'pending': 'status-pending',
    'rejected': 'status-failure',
    'in_process': 'status-pending',
    'cancelled': 'status-failure'
  };
  return statusMap[status] || 'status-pending';
}

function getStatusText(status) {
  const textMap = {
    'approved': 'Aprobado',
    'pending': 'Pendiente',
    'rejected': 'Rechazado',
    'in_process': 'En proceso',
    'cancelled': 'Cancelado'
  };
  return textMap[status] || status;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-AR').format(price);
}

function formatPaymentMethod(method) {
  const methods = {
    'credit_card': 'Tarjeta de crédito',
    'debit_card': 'Tarjeta de débito',
    'account_money': 'Dinero en cuenta',
    'mercadopago': 'Mercado Pago'
  };
  return methods[method] || method;
}
</script>

<style scoped>
.pedidos-container {
  min-height: 100vh;
  background: var(--color-background);
  padding: 10rem 1rem 2rem 1rem;
}

.pedidos-content {
  max-width: 1200px;
  margin: 0 auto;
}

.pedidos-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 0.6rem 1rem;
  background: #34495e;
  color: #ecf0f1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #3d566e;
  transform: translateX(-2px);
}

.pedidos-header h1 {
  font-size: 2rem;
  color: var(--color-primary);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.filters {
  top: 15px;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  background: #34495e;
  color: #ecf0f1;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #3d566e;
}

.filter-btn.active {
  background: #ff9800;
  color: black;
  border-color: #ff9800;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: #ecf0f1;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 152, 0, 0.2);
  border-top-color: #ff9800;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 3rem 2rem;
  background: #2C3E50;
  border-radius: 8px;
  color: #f44336;
}

.error-message p {
  margin-bottom: 1rem;
}

.btn-retry {
  padding: 0.7rem 1.5rem;
  background: #ff9800;
  color: black;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-retry:hover {
  background: #fb8c00;
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #2C3E50;
  border-radius: 8px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: #ecf0f1;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #95a5a6;
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: #ff9800;
  color: black;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #fb8c00;
  transform: translateY(-1px);
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: #2C3E50;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  background: #34495e;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.order-id-section {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.order-label {
  font-size: 0.75rem;
  color: #95a5a6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-id {
  font-size: 1rem;
  color: #ecf0f1;
  font-weight: 700;
  font-family: monospace;
}

.order-status {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-success {
  background: rgba(40, 167, 69, 0.2);
  color: #4caf50;
  border: 1px solid rgba(40, 167, 69, 0.4);
}

.status-pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.4);
}

.status-failure {
  background: rgba(220, 53, 69, 0.2);
  color: #f44336;
  border: 1px solid rgba(220, 53, 69, 0.4);
}

.order-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.order-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.85rem;
  color: #95a5a6;
}

.detail-value {
  font-size: 0.9rem;
  color: #ecf0f1;
  font-weight: 600;
}

.detail-value.price {
  color: #ffe0b2;
  font-size: 1.1rem;
}

.order-card-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-detail {
  width: 100%;
  padding: 0.7rem;
  background: transparent;
  color: #ff9800;
  border: 2px solid rgba(255, 152, 0, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-detail:hover {
  background: rgba(255, 152, 0, 0.1);
  border-color: #ff9800;
}

@media (max-width: 768px) {
  .pedidos-header h1 {
    font-size: 1.5rem;
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    justify-content: center;
  }
}
</style>
