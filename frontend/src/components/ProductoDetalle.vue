<!-- ProductoDetalle.vue -->
<template>
  <div v-if="producto" class="producto-detalle">
    <div class="producto-container">
      <!-- Imagen del producto -->
      <div class="imagen-producto">
        <img :src="producto.imagenes[0]" :alt="producto.nombre" />
      </div>

      <!-- Información del producto -->
      <div class="info-producto">
        <div class="header-producto">
          <h1 class="nombre-producto">{{ producto.nombre }}</h1>
          <p class="codigo-producto">Risk 105467</p>
        </div>

        <div class="precios">
          <div class="precio-item precio-contado">
            <span class="etiqueta">Contado</span>
            <span class="valor">$ {{ producto.precio.toLocaleString() }}</span>
          </div>
        </div>

        <div class="compra">
          <!-- Selector de cantidad actualizado -->
          <div class="selector-cantidad">
            <span class="etiqueta-cantidad">Cantidad:</span>
            <div class="controles-cantidad">
              <button class="btn-cantidad" @click="disminuirCantidad" :disabled="cantidad <= 1">
                −
              </button>
              <input type="number" v-model.number="cantidad" min="1" :max="producto?.stock" class="input-cantidad" />
              <button class="btn-cantidad" @click="aumentarCantidad" :disabled="cantidad >= 99">
                +
              </button>
            </div>
          </div>

          <div class="acciones">
            <button class="btn-agregar" @click="agregarAlCarrito">
              <span class="btn-text">Agregar al carrito</span>
              <span class="btn-icon">🛒</span>
            </button>
          </div>
          <!-- mensaje de stock -->
          <p v-show="mensajeStock" class="mensaje-stock">{{ mensajeStock }}</p>
        </div>

        <!-- Información de envío y garantía -->
        <div class="info-extra">
          <div class="info-item" v-for="(item, index) in infoItems" :key="index"
            :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="icono">{{ item.icono }}</div>
            <div class="texto">
              <h4>{{ item.titulo }}</h4>
              <p>{{ item.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal del carrito -->
    <CarritoModalPreview :visible="mostrarModal" :carrito="getCart()" :ultimoProducto="ultimoProducto"
      @close="mostrarModal = false" />
  </div>

  <div v-else class="cargando">
    <div class="spinner"></div>
    <p>Cargando producto...</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import apiClient from '../api/apiClient';
import { addToCart, getCart } from '../utils/cartUtils';
import { ultimoProducto, setUltimoProducto } from '../composables/ultimoProducto';
import { addToRecentlyViewed } from '../utils/recentlyViewedUtils';
import CarritoModalPreview from './CarritoModalPreview.vue';

const mostrarModal = ref(false);
const producto = ref(null);
const route = useRoute();
const cantidad = ref(1); // Cantidad inicial
const mensajeStock = ref(""); // msj de aviso si sobrepasa el stock

// Información de los ítems de envío y garantía
const infoItems = ref([
  {
    icono: '🚚',
    titulo: 'Envíos a todo el país',
    descripcion: 'Recibí tus productos en todo Argentina'
  },
  {
    icono: '🛡',
    titulo: 'Garantía de reembolso',
    descripcion: '100% beneficiario del dinero'
  },
  {
    icono: '🔒',
    titulo: 'Pago Seguro',
    descripcion: 'Seguridad en el pago'
  }
]);

// Función para cargar el producto (líneas 107-114)
const cargarProducto = async (id) => {
  try {
    const res = await apiClient.get(`/api/productos/${id}`)
    producto.value = res.data

    // Agregar el producto a la lista de vistos recientemente
    if (producto.value) {
      addToRecentlyViewed(producto.value);
    }
  } catch (err) {
    console.error('No se pudo cargar el producto', err)
  }
}

// Carga inicial cuando se monta el componente (líneas 116-119)
onMounted(() => {
  const id = route.params.id;
  cargarProducto(id);
});

// Vigilar cambios en el ID de la URL (líneas 121-124 - NUEVO)
watch(() => route.params.id, (nuevoId) => {
  cargarProducto(nuevoId);
});
// Funciones para controlar la cantidad
// Incrementa respetando el stock del producto
const aumentarCantidad = () => {
  if (producto.value && cantidad.value < producto.value.stock) {
    cantidad.value++;
  } else if (producto.value && cantidad.value >= producto.value.stock) {
    mensajeStock.value = `Solo hay ${producto.value.stock} unidades disponibles de este producto.`;
    setTimeout(() => (mensajeStock.value = ""), 1000); // desaparece en 1s
  }
};

// Disminuye, sin bajar de 1
const disminuirCantidad = () => {
  if (cantidad.value > 1) {
    cantidad.value--;
  }
};

const agregarAlCarrito = () => {
  const productoConAlias = {
    ...producto.value,
    id: producto.value.id_producto
  };

  const resultado = addToCart(productoConAlias, cantidad.value);

  if (resultado.success) {
    setUltimoProducto(productoConAlias);
    mostrarModal.value = true;
    // Resetear cantidad después de agregar al carrito
    cantidad.value = 1;
  } else {
    mensajeStock.value = resultado.message;
    setTimeout(() => (mensajeStock.value = ""), 2000);
  }
};
</script>

<style scoped>
.producto-detalle {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  margin-top: 10%;
  animation: fadeIn 0.6s ease-out;
}

.compra {
  position: relative;
  /* referencia para el mensaje flotante */
}

.mensaje-stock {
  position: absolute;
  color: var(--color-destructive);
  font-size: 0.9rem;
  font-weight: 500;
  height: -2em;
  /* reserva espacio para evitar saltos */
  top: 80px;
  left: 0;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.producto-container {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.imagen-producto {
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 500px;
  animation: slideInLeft 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.imagen-producto img {
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--color-border);
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.imagen-producto img:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.info-producto {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideInRight 0.6s ease-out 0.2s both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.header-producto {
  border-bottom: 2px solid var(--chart-5);
  padding-bottom: 16px;
}

.nombre-producto {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
  color: var(--color-foreground);
}

.codigo-producto {
  color: var(--chart-2);
  font-size: 14px;
  font-weight: 500;
}

.precios {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 8px 0;
}

.precio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--chart-5);
  transition: all 0.3s ease;
  animation: priceItemSlide 0.5s ease-out both;
}

.precio-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 6px;
}

@keyframes priceItemSlide {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.precio-contado {
  animation-delay: 0.3s;
  border-bottom: 2px solid var(--chart-3);
}

.precio-lista {
  animation-delay: 0.5s;
}

.etiqueta {
  font-size: 16px;
  font-weight: 500;
}

.valor {
  font-weight: 600;
  font-size: 18px;
}

.precio-contado .valor {
  font-size: 28px;
  color: var(--chart-1);
  font-weight: 700;
}

.compra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* Selector de cantidad */
.selector-cantidad {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
  animation: slideInUp 0.5s ease-out 0.4s both;
}

.etiqueta-cantidad {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-foreground);
}

.controles-cantidad {
  display: flex;
  align-items: center;
  border: 1px solid var(--chart-5);
  border-radius: 6px;
  overflow: hidden;
  padding: 3px;
}

.btn-cantidad {
  background-color: var(--chart-5);
  border: none;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-cantidad:hover:not(:disabled) {
  background-color: var(--chart-4);
}

.btn-cantidad:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-cantidad {
  width: 50px;
  height: 36px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.input-cantidad::-webkit-outer-spin-button,
.input-cantidad::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.acciones {
  margin: 16px 0;
  flex: 1;
  min-width: 200px;
}

.btn-agregar {
  background-color: #f59e0b;
  color: #f8f8f8;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.btn-agregar:hover {
  background-color: #e68900;
}

.btn-agregar .btn-text,
.btn-agregar .btn-icon {
  background: none !important;
  color: #fff;
  display: flex;
  align-items: center;
}

.btn-agregar:active {
  transform: translateY(0);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-icon {
  position: relative;
  z-index: 1;
  font-size: 20px;
  transition: transform 0.3s ease;
}

.btn-agregar:hover .btn-icon {
  transform: scale(1.2) rotate(10deg);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.info-extra {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--chart-1);
  border-radius: 8px;
  background-color: var(--color-background);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: slideInUp 0.5s ease-out both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.info-item .icono {
  font-size: 24px;
  margin-top: 2px;
  flex-shrink: 0;
}

.info-item .texto h4 {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-foreground);
}

.info-item .texto p {
  margin: 0;
  font-size: 14px;
  color: var(--chart-2);
}

.cargando {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--chart-5);
  border-top: 4px solid var(--chart-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
/* Tablets */
@media (max-width: 1024px) {
  .producto-detalle {
    margin-top: 5%;
    padding: 15px;
  }

  .producto-container {
    gap: 30px;
  }

  .info-extra {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablets pequeñas y móviles grandes */
@media (max-width: 768px) {
  .producto-container {
    flex-direction: column;
    gap: 30px;
  }

  .imagen-producto {
    max-width: 100%;
  }

  .nombre-producto {
    font-size: 24px;
  }

  .precio-contado .valor {
    font-size: 24px;
  }

  .compra {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .selector-cantidad {
    justify-content: space-between;
    width: 100%;
  }

  .acciones {
    min-width: auto;
  }

  .btn-agregar {
    padding: 14px 24px;
    font-size: 16px;
  }

  .info-extra {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .info-item {
    width: auto;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {
  .producto-detalle {
    margin-top: 2%;
    padding: 10px;
  }

  .nombre-producto {
    font-size: 20px;
  }

  .precio-contado .valor {
    font-size: 22px;
  }

  .selector-cantidad {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .controles-cantidad {
    align-self: stretch;
    justify-content: center;
  }

  .info-item {
    padding: 12px;
  }

  .info-item .icono {
    font-size: 20px;
  }

  .info-item .texto h4 {
    font-size: 15px;
  }

  .info-item .texto p {
    font-size: 13px;
  }

  .mensaje-stock {
    position: static;
    margin-top: 10px;
  }
}
</style>