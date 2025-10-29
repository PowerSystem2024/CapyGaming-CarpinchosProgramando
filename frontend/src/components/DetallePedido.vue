<template>
  <div class="detalle-container">
    <div class="detalle-content">
      <!-- Header -->
      <div class="detalle-header">
        <button @click="volverAtras" class="btn-back">← Volver</button>
        <h1>Detalle del Pedido</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando detalles...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadOrderDetail" class="btn-retry">Reintentar</button>
      </div>

      <!-- Detalle del pedido -->
      <div v-else-if="order" class="order-detail">
        <!-- Información general -->
        <section class="detail-section">
          <h2>Información General</h2>
          <div class="info-grid">
            <div class="info-row">
              <span class="label">ID del pedido:</span>
              <span class="value monospace">{{ order.orden_id }}</span>
            </div>
            <div class="info-row">
              <span class="label">Estado:</span>
              <span class="value">
                <span class="status-badge" :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="label">Fecha:</span>
              <span class="value">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="info-row" v-if="order.payment_method">
              <span class="label">Método de pago:</span>
              <span class="value">{{ formatPaymentMethod(order.payment_method) }}</span>
            </div>
            <div class="info-row" v-if="order.payment_id">
              <span class="label">ID de pago:</span>
              <span class="value monospace">{{ order.payment_id }}</span>
            </div>
          </div>
        </section>

        <!-- Productos -->
        <section class="detail-section">
          <h2>Productos</h2>
          <div class="products-list">
            <div v-for="item in order.items" :key="item.id" class="product-item">
              <div class="product-image">
                <img
                  v-if="item.picture_url"
                  :src="item.picture_url"
                  :alt="item.title"
                  @error="handleImageError"
                />
                <div v-else class="no-image">📦</div>
              </div>
              <div class="product-info">
                <h3>{{ item.title }}</h3>
                <p class="product-description" v-if="item.description">{{ item.description }}</p>
                <div class="product-details">
                  <span>Cantidad: {{ item.quantity }}</span>
                  <span>Precio unitario: ${{ formatPrice(item.unit_price) }}</span>
                </div>
              </div>
              <div class="product-total">
                ${{ formatPrice(item.unit_price * item.quantity) }}
              </div>
            </div>
          </div>
        </section>

        <!-- Datos del comprador -->
        <section class="detail-section" v-if="order.payer">
          <h2>Datos del Comprador</h2>
          <div class="info-grid">
            <div class="info-row" v-if="order.payer.name">
              <span class="label">Nombre:</span>
              <span class="value">{{ order.payer.name }} {{ order.payer.surname }}</span>
            </div>
            <div class="info-row" v-if="order.payer.email">
              <span class="label">Email:</span>
              <span class="value">{{ order.payer.email }}</span>
            </div>
            <div class="info-row" v-if="order.payer.identification">
              <span class="label">DNI:</span>
              <span class="value">{{ order.payer.identification.number }}</span>
            </div>
          </div>
        </section>

        <!-- Resumen de pago -->
        <section class="detail-section summary-section">
          <h2>Resumen</h2>
          <div class="summary-grid">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>${{ formatPrice(order.total) }}</span>
            </div>
            <div class="summary-row">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>${{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </section>

        <!-- Acciones -->
        <div class="actions">
          <router-link to="/contacto" class="btn-secondary">
            Contactar soporte
          </router-link>
          <router-link to="/mis-pedidos" class="btn-primary">
            Ver todos mis pedidos
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthService from '../services/authService.js';
import orderService from '../services/orderService.js';

const route = useRoute();
const router = useRouter();
const order = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  // Verificar autenticación
  const user = AuthService.getCurrentUser();
  if (!user) {
    router.push('/inicioSesion');
    return;
  }

  await loadOrderDetail();
});

async function loadOrderDetail() {
  try {
    loading.value = true;
    error.value = null;
    const orderId = route.params.id;
    const response = await orderService.getOrderById(orderId);
    order.value = response.order || response;
  } catch (err) {
    console.error('Error loading order detail:', err);
    error.value = 'No se pudo cargar el detalle del pedido. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
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

function handleImageError(event) {
  event.target.style.display = 'none';
  event.target.parentElement.innerHTML = '<div class="no-image">📦</div>';
}
</script>

<style scoped>
.detalle-container {
  min-height: 100vh;
  background: var(--color-background);
  padding: 2rem 1rem;
}

.detalle-content {
  max-width: 1000px;
  margin: 0 auto;
}

.detalle-header {
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

.detalle-header h1 {
  font-size: 2rem;
  color: var(--color-primary);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
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
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  background: #2C3E50;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.detail-section h2 {
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #34495e;
  border-radius: 6px;
}

.label {
  font-size: 0.9rem;
  color: #95a5a6;
  font-weight: 500;
}

.value {
  font-size: 1rem;
  color: #ecf0f1;
  font-weight: 600;
}

.monospace {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
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

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #34495e;
  border-radius: 6px;
  align-items: center;
}

.product-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: #2C3E50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  font-size: 2rem;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  font-size: 1rem;
  color: #ecf0f1;
  margin-bottom: 0.3rem;
}

.product-description {
  font-size: 0.85rem;
  color: #95a5a6;
  margin-bottom: 0.5rem;
}

.product-details {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #95a5a6;
}

.product-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffe0b2;
}

.summary-section {
  background: linear-gradient(135deg, #1e2a38 0%, #2C3E50 100%);
}

.summary-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #ecf0f1;
  font-size: 0.95rem;
}

.total-row {
  padding-top: 0.75rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffe0b2;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  text-align: center;
}

.btn-primary {
  background: #ff9800;
  color: black;
}

.btn-primary:hover {
  background: #fb8c00;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: #ecf0f1;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .detalle-header h1 {
    font-size: 1.5rem;
  }

  .product-item {
    flex-direction: column;
    text-align: center;
  }

  .info-row {
    flex-direction: column;
    gap: 0.3rem;
    align-items: flex-start;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
