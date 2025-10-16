<template>
  <div class="resultados-busqueda">
    <aside class="sidebar">
        <aside class="sidebar">
        <div class="header-filtros">
            <div>
            <h2>Buscaste: {{ busqueda }}</h2>
            <p>{{ productos.length }} resultado{{ productos.length === 1 ? '' : 's' }}</p>
            </div>
        </div>
        </aside>
    </aside>

    
    <div class="contenido">
      <!-- 🔽 Filtro de orden -->
        <div class="ordenador" v-if="productos.length > 0">
        <label for="orden">Ordenar por:</label>
        <select id="orden" v-model="ordenSeleccionado">
            <option value="asc">Menor Precio</option>
            <option value="desc">Mayor Precio</option>
        </select>
        </div>


    <section class="productos-grid">
      <ProductCard
        v-for="p in productosOrdenados"
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
import { computed } from 'vue';

const ordenSeleccionado = ref('asc');

const productosOrdenados = computed(() => {
  return [...productos.value].sort((a, b) => {
    const precioA = a.precio ?? 0;
    const precioB = b.precio ?? 0;
    return ordenSeleccionado.value === 'asc'
      ? precioA - precioB
      : precioB - precioA;
  });
});

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
@import url(../assets/styles/base.css);
.resultados-busqueda {
  display: flex;
  gap: 1rem;
  padding: 2rem 0rem; /* espacio arriba y a los lados */
  padding-top: calc(90px + 60px); /* navbar + subnavbar */
  margin: 0 12rem;
}

.sidebar {
  width: 400px;
  flex-shrink: 0;
  padding-top: 1rem;
  padding-left: 3rem;
  padding-right: 3rem;
  text-align: left;
}

.sidebar h2 {
  font-size: 1.2rem;
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
  background-color: var(--color-background-light);
  padding: 1rem;
  border-radius: 8px;

}

/* ANIMACION DE PRODUCTOS AL APARECER */
.productos-grid > * {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn { /* AQUI TERMINA LA ANIMACION */
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.no-result {
  grid-column: 1 / -1;
  text-align: center;
  font-style: italic;
  color: #888;
  margin-top: 2rem;
}

.header-filtros {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
 background-color: var(--color-background-light);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.header-filtros h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-primary);
}

.header-filtros p {
  font-size: 0.95rem;
  color: var(--color-text);
}
.ordenador {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Alinea a la derecha */
  gap: 0.4rem;
  font-size: 0.9rem;
  background-color: var(--color-background-light);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.ordenador select {
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  outline: none;
  appearance: none;
  font-size: 0.9rem;
}

/* 🧠 Responsividad general */
@media (max-width: 1200px) {
  .resultados-busqueda {
    margin: 0 4rem;
  }

  .productos-grid {
    grid-template-columns: repeat(3, 1fr); /* de 4 a 3 columnas */
  }
}

@media (max-width: 900px) {
  .resultados-busqueda {
    flex-direction: column; /* apila sidebar y contenido */
    margin: 0 2rem;
  }

  .sidebar {
    width: 100%;
    padding-top: 1rem;
  }

  .productos-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas */
  }

  .ordenador {

    justify-content: flex-start; /* centrado a la izquierda en pantallas chicas */
  }
}

@media (max-width: 600px) {
  .productos-grid {
    grid-template-columns: 1fr; /* 1 producto por fila */
  }

  .ordenador {
    flex-direction: row;
    align-items: flex-start;
    gap: 0.5rem;
  }
.resultados-busqueda {
    padding-top: calc(60px + 40px); /* navbar más comprimida */
  }
  .sidebar {
    width: 100%;
    padding-top: 2.5rem;
  }
  .sidebar h2 {
    font-size: 1rem;
  }

  .sidebar p {
    font-size: 0.85rem;
  }
 .header-filtros,
  .ordenador,
  .productos-grid {
    margin-bottom: 0rem;
  }

  .header-filtros h2 {
    font-size: 1.1rem;
  }

  .productos-grid {
    padding: 0.5rem;
  }
}

</style>
