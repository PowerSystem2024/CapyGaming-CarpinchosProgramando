<template>
  <div class="catalogo-categoria">
    <h1>{{ categoria }}</h1>

        <!-- Sidebar con subcategorías, solo si existen -->
    <aside v-if="subcategorias && subcategorias.length" class="sidebar">
      <ul>
        <!-- Itera sobre las subcategorías disponibles -->
        <li 
          v-for="sub in subcategorias" 
          :key="sub"
          :class="{ active: normalizar(sub) === normalizar(subcategoria) }"
        >
         <!-- Enlace que actualiza la URL para navegar entre subcategorías -->
          <router-link :to="`/categoria/${categoria}/${sub}`">
            {{ sub }}
          </router-link>
        </li>
      </ul>
    </aside>

        <!-- Sección principal que muestra los productos ya filtrados desde el backend -->
    <section class="productos-grid">
        <!-- Renderiza una tarjeta por cada producto filtrado -->
      <ProductCard 
        v-for="p in productos" 
        :key="p.id_producto" 
        :producto="p"
      />
       <!--Si no hay productos, muestra un mensaje de "sin resultados" -->
      <div v-if="productos.length === 0" class="no-result">
        No se encontraron productos para esta categoría.
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';

// Obtiene los parámetros de la URL para saber que categoria y subcategoria estan activas
const route = useRoute();
const categoria = ref(route.params.categoria);
const subcategoria = ref(route.params.subcategoria);
// Estado reactivo para almacenar los productos desde el backend


// Observa cambios en la URL para actualizar la categoría y subcategoría
watch(() => route.params.categoria, (nuevoValor) => {
  categoria.value = nuevoValor;
});
watch(() => route.params.subcategoria, (nuevoValor) => {
  subcategoria.value = nuevoValor;
});

// Función para normalizar texto (evita errores por mayúsculas o espacios)
const normalizar = (texto) => texto?.toLowerCase().trim();

// Subcategorias dinamicas desde el backend. 
// Cada vez que cambia la categoría, se hace una petición al backend para obtener sus subcategorías.
// Se actualiza el menú lateral automáticamente.
const subcategorias = ref([]);

watch(
  () => route.params.categoria,
  async (nuevoValor) => {
    categoria.value = nuevoValor;
    try {
      const res = await axios.get(`http://localhost:3001/api/categorias/${nuevoValor}/subcategorias`);
      subcategorias.value = res.data;
    } catch (err) {
      console.error('Error al cargar subcategorías', err);
      subcategorias.value = [];
    }
  },
  { immediate: true }
);


// Productos filtrados desd el backend
//Cada vez que cambia la categoría o subcategoría, se hace una nueva petición al backend.
//El backend devuelve solo los productos que coinciden con esos filtros.
const productos = ref([]);
watch(
  () => [categoria.value, subcategoria.value],
  async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/productos', {
        params: {
          categoria: categoria.value,
          subcategoria: subcategoria.value || null
        }
      });
      productos.value = res.data;
    } catch (err) {
      console.error('Error al cargar productos desde el backend', err);
    }
  },
  { immediate: true }
);


</script>

<style scoped>
.catalogo-categoria {
  display: flex;
  gap: 2rem;
  padding-top: calc(75px + 60px); /* 60px = altura del navbar */
}
.sidebar {
  width: 200px;
}
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  flex: 1;
}
.no-result {
  grid-column: 1 / -1;
  text-align: center;
  font-style: italic;
  color: #888;
  margin-top: 2rem;
}
</style>
