<template>
  <div class="resultados-busqueda">
    <aside class="sidebar">
      <h2>{{ busqueda }}</h2>
      <p>{{ productos.length }} resultado{{ productos.length === 1 ? '' : 's' }}</p>
    </aside>
    
    <section class="productos-grid">
      <ProductCard
        v-for="p in productos"
        :key="p.id_producto"
        :producto="p"
        @agregar="agregarAlCarrito"
      />

      <div v-if="productos.length === 0" class="no-result">
        No se encontraron productos para "{{ busqueda }}"
      </div>

      <CarritoModalPreview
        :visible="mostrarModal"
        :carrito="getCart()"
        :ultimoProducto="ultimoProducto"
        @close="mostrarModal = false"
      />
    </section>
  </div>
</template>


<script setup>
// Importa herramientas de Vue y utilidades
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// Componentes visuales
import ProductCard from '../components/ProductCard.vue';
import CarritoModalPreview from '../components/CarritoModalPreview.vue';

// Funciones del carrito
import { addToCart, getCart } from '../utils/cartUtils';
import { setUltimoProducto, ultimoProducto } from '../composables/ultimoProducto.js';

const route = useRoute(); // Accede a la ruta actual para leer el parámetro de búsqueda
const busqueda = ref(route.query.q || ''); // Estado reactivo para el texto buscado
const productos = ref([]); // Lista de productos encontrados
const mostrarModal = ref(false); // Estado del modal de confirmación

watch( // Observa cambios en el parámetro de búsqueda (?q=...)
  () => route.query.q,
  async (nuevoTexto) => {
    busqueda.value = nuevoTexto;
    if (!nuevoTexto || nuevoTexto.trim().length < 2) { // Si el texto es muy corto, no busca nada
      productos.value = [];
      return;
    }

    try { // Llama al backend para buscar productos por nombre
      const res = await axios.get(`/api/productos/buscar?nombre=${encodeURIComponent(nuevoTexto)}`);
      productos.value = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Error al buscar productos:', err);
      productos.value = [];
    }
  },
  { immediate: true } // Ejecuta la búsqueda al cargar el componente
);

// Función que se ejecuta al agregar un producto al carrito
const agregarAlCarrito = (producto) => {
  const resultado = addToCart(producto);
  if (resultado.success) {
    setUltimoProducto(producto); // Guarda el último producto agregado
    mostrarModal.value = true; // Muestra el modal de confirmación
  }
  console.log(resultado.message);
};
</script>

<style scoped>
.resultados-busqueda {
  display: flex;
  gap: 1rem;
  padding: 2rem 0rem; /* espacio arriba y a los lados */
  padding-top: calc(75px + 60px); /* navbar + subnavbar */
  margin: 0 12rem;
}

.sidebar {
  width: 400px;
  flex-shrink: 0;
  padding-top: 1rem;
  padding-left: 10rem;
  text-align: left;
}

.sidebar h2 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.sidebar p {
  font-size: 0.95rem;
  color: #666;
}

.productos-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas fijas */
  gap: 1rem;
}

.no-result {
  grid-column: 1 / -1;
  text-align: center;
  font-style: italic;
  color: #888;
  margin-top: 2rem;
}

</style>
