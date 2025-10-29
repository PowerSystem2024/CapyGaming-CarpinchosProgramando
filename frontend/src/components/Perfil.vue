<template>
  <div class="perfil-container">
    <div class="perfil-content">
      <!-- Cabecera -->
      <div class="perfil-header">
        <h1>Mi Perfil</h1>
      </div>

      <!-- Información del usuario -->
      <section class="perfil-section">
        <h2>Información Personal</h2>
        <div class="info-grid" v-if="user">
          <div class="info-item">
            <span class="label">Nombre:</span>
            <span class="value">{{ user.nombre }} {{ user.apellido || user.apellidos }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">DNI:</span>
            <span class="value">{{ user.dni || 'No especificado' }}</span>
          </div>
        </div>
      </section>

      <!-- Historial de pedidos recientes -->
      <section class="perfil-section">
        <div class="section-title-row">
          <h2>Pedidos Recientes</h2>
          <router-link to="/mis-pedidos" class="btn-ver-todos">
            Ver todos
          </router-link>
        </div>

        <div v-if="loading" class="loading">
          Cargando pedidos...
        </div>

        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-else-if="orders.length === 0" class="empty-state">
          <p>No tienes pedidos aún.</p>
          <router-link to="/" class="btn-primary">Ir a comprar</router-link>
        </div>

        <div v-else class="orders-list">
          <div
            v-for="order in recentOrders"
            :key="order.orden_id"
            class="order-card"
            @click="verDetalle(order.orden_id)"
          >
            <div class="order-header">
              <span class="order-id">{{ order.orden_id }}</span>
              <span class="order-status" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <div class="order-info">
              <span class="order-date">{{ formatDate(order.created_at) }}</span>
              <span class="order-total">${{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Acciones rápidas -->
      <section class="perfil-section">
        <h2>Acciones Rápidas</h2>
        <div class="quick-actions">
          <router-link to="/mis-pedidos" class="action-card">
            <div class="icon">📦</div>
            <span>Mis Pedidos</span>
          </router-link>
          <router-link to="/" class="action-card">
            <div class="icon">🛒</div>
            <span>Seguir Comprando</span>
          </router-link>
          <router-link to="/contacto" class="action-card">
            <div class="icon">💬</div>
            <span>Contacto</span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/authService.js';
import orderService from '../services/orderService.js';

const router = useRouter();
const user = ref(null);
const orders = ref([]);
const loading = ref(true);
const error = ref(null);

// Solo mostrar los 3 pedidos más recientes
const recentOrders = computed(() => orders.value.slice(0, 3));

onMounted(async () => {
  // Obtener datos del usuario
  user.value = AuthService.getCurrentUser();

  // Si no está logueado, redirigir
  if (!user.value) {
    router.push('/inicioSesion');
    return;
  }

  // Cargar pedidos
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
    year: 'numeric'
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-AR').format(price);
}
</script>

<style scoped>
.perfil-container {
  min-height: 100vh;
  background: var(--color-background);
  padding: 10rem 1rem 2rem 1rem;
}

.perfil-content {
  max-width: 1200px;
  margin: 0 auto;
}

.perfil-header {
  text-align: center;
  margin-bottom: 2rem;
}

.perfil-header h1 {
  font-size: 2rem;
  color: var(--color-primary);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.perfil-section {
  background: #2C3E50;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.perfil-section h2 {
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-ver-todos {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #ff9800;
  border: 2px solid #ff9800;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-ver-todos:hover {
  background: #ff9800;
  color: black;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.label {
  font-size: 0.85rem;
  color: #95a5a6;
  font-weight: 500;
}

.value {
  font-size: 1rem;
  color: #ecf0f1;
  font-weight: 600;
}

.loading, .error-message, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #ecf0f1;
}

.error-message {
  color: #f44336;
}

.empty-state p {
  margin-bottom: 1rem;
  color: #95a5a6;
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: #34495e;
  border-radius: 6px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.order-card:hover {
  background: #3d566e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.order-id {
  font-size: 0.9rem;
  color: #ecf0f1;
  font-weight: 600;
}

.order-status {
  padding: 0.3rem 0.7rem;
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

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.order-date {
  color: #95a5a6;
}

.order-total {
  color: #ffe0b2;
  font-weight: 700;
  font-size: 1rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.action-card {
  background: #34495e;
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  color: #ecf0f1;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.action-card:hover {
  background: #3d566e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.icon {
  font-size: 2rem;
}

@media (max-width: 768px) {
  .perfil-header h1 {
    font-size: 1.5rem;
  }

  .perfil-section {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
