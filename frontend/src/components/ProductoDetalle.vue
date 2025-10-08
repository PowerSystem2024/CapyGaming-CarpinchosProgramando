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
          
          <div class="precio-item precio-cuotas">
            <span class="etiqueta">6 cuotas sin interés</span>
            <span class="valor">$ {{ calcularCuotas(producto.precio).toLocaleString() }}</span>
          </div>
          
          <div class="precio-item precio-lista">
            <span class="etiqueta">Precio de lista</span>
            <span class="valor">$ {{ calcularPrecioLista(producto.precio).toLocaleString() }}</span>
          </div>
        </div>
        
        <div class="acciones">
          <button class="btn-agregar" @click="agregarAlCarrito">
            <span class="btn-text">Agregar al carrito</span>
            <span class="btn-icon">🛒</span>
          </button>
        </div>
        
        <!-- Calculador de cuotas -->
        <div class="calculador-cuotas">
          <h3>Calculador de cuotas</h3>
          <div class="input-cuotas">
            <input type="number" min="1" max="12" v-model="cuotas" />
            <span>cuotas</span>
          </div>
          <p class="valor-cuota">Valor por cuota: $ {{ calcularValorCuota(producto.precio, cuotas).toLocaleString() }}</p>
        </div>
        
        <!-- Información de envío y garantía -->
        <div class="info-extra">
          <div class="info-item" v-for="(item, index) in infoItems" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
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
    <CarritoModalPreview 
      :visible="mostrarModal" 
      :carrito="getCart()" 
      :ultimoProducto="ultimoProducto" 
      @close="mostrarModal = false"
    />
  </div>

  <div v-else class="cargando">
    <div class="spinner"></div>
    <p>Cargando producto...</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { addToCart, getCart } from '../utils/cartUtils';
import { ultimoProducto, setUltimoProducto } from '../composables/ultimoProducto';
import CarritoModalPreview from './CarritoModalPreview.vue';

const mostrarModal = ref(false);
const cuotas = ref(6);
const producto = ref(null);
const route = useRoute();

// Información de los ítems de envío y garantía
const infoItems = ref([
  {
    icono: '🚚',
    titulo: 'Envíos a todo el país',
    descripcion: 'Recibí tus productos en todo Argentina'
  },
  {
    icono: '🏪',
    titulo: 'Retiro GRATIS en sucursal',
    descripcion: 'Calculá costo de envío'
  },
  {
    icono: '🛡️',
    titulo: 'Garantía de reembolso',
    descripcion: '100% beneficiario del dinero'
  },
  {
    icono: '🔒',
    titulo: 'Pago Seguro',
    descripcion: 'Seguridad en el pago'
  }
]);

onMounted(async () => {
  const id = route.params.id;
  try {
    const res = await axios.get(`http://localhost:3001/api/productos/${id}`);
    producto.value = res.data;
  } catch (err) {
    console.error('No se pudo cargar el producto', err);
  }
});

const agregarAlCarrito = () => {
  const productoConAlias = {
    ...producto.value,
    id: producto.value.id_producto
  };

  const resultado = addToCart(productoConAlias);

  if (resultado.success) {
    setUltimoProducto(productoConAlias);
    mostrarModal.value = true;
  } else {
    alert(resultado.message);
  }
};

// Funciones para calcular precios
const calcularCuotas = (precio) => {
  return Math.round(precio / 5);
};

const calcularPrecioLista = (precio) => {
  return Math.round(precio * 0.8);
};

const calcularValorCuota = (precio, numCuotas) => {
  return Math.round(precio / numCuotas);
};
</script>

<style scoped>
.producto-detalle {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  margin-top: 10%;
  animation: fadeIn 0.6s ease-out;
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

.precio-cuotas {
  animation-delay: 0.4s;
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

.acciones {
  margin: 16px 0;
}

.btn-agregar {
  background: var(--chart-1);
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.btn-agregar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--chart-3);
  transition: left 0.5s;
}

.btn-agregar:hover::before {
  left: 100%;
}

.btn-agregar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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

.calculador-cuotas {
  background-color: var(--color-background);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--chart-1);
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: scaleIn 0.5s ease-out 0.6s both;
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

.calculador-cuotas h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-foreground);
}

.input-cuotas {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.input-cuotas input {
  width: 70px;
  padding: 10px;
  border: 1px solid var(--chart-5);
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-cuotas input:focus {
  outline: none;
  border-color: var(--chart-1);
  box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.1);
}

.valor-cuota {
  font-weight: 700;
  color: var(--chart-2);
  margin: 0;
  font-size: 16px;
}

.info-extra {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
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
  
  .btn-agregar {
    padding: 14px 24px;
    font-size: 16px;
  }
}
</style>