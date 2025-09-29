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

        <!-- Sección principal con los productos filtrados -->
    <section class="productos-grid">
        <!-- Renderiza una tarjeta por cada producto filtrado -->
      <ProductCard 
        v-for="p in productosFiltrados" 
        :key="p.id" 
        :producto="p"
      />
      <div v-if="productosFiltrados.length === 0" class="no-result">
        No se encontraron productos para esta categoría.
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { categoriasMap } from '../utils/categoriasMap';
import ProductCard from '../components/ProductCard.vue';

// Obtiene los parámetros de la URL actual
const route = useRoute();
const categoria = ref(route.params.categoria);
const subcategoria = ref(route.params.subcategoria);
// Estado reactivo para almacenar los productos desde el backend
const productos = ref([]);

// Observa cambios en la URL para actualizar la categoría y subcategoría
watch(() => route.params.categoria, (nuevoValor) => {
  categoria.value = nuevoValor;
});
watch(() => route.params.subcategoria, (nuevoValor) => {
  subcategoria.value = nuevoValor;
});

// Función para normalizar texto (evita errores por mayúsculas o espacios)
const normalizar = (texto) => texto?.toLowerCase().trim();

// Computa las subcategorías disponibles según el mapa de categorías
const subcategorias = computed(() => {
  const grupo = Object.keys(categoriasMap).find(key => normalizar(key) === normalizar(categoria.value));
  return grupo ? categoriasMap[grupo] : null;
});

// Filtra los productos según la categoría y subcategoría actual
const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    const cat = normalizar(p.categoria);
    const sub = normalizar(p.subcategoria);
    const routeCat = normalizar(categoria.value);
    const routeSub = normalizar(subcategoria.value);

    // Si no hay subcategoría en la URL, filtra solo por categoría
    if (!subcategoria.value) {
      return cat === routeCat;
    }
    // Si hay subcategoría, filtra por ambas
    return cat === routeCat && sub === routeSub;
  });
});

// Al montar el componente, hace una petición al backend para obtener los productos
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/productos');
    productos.value = res.data;
  } catch (err) {
    console.error('Error al cargar productos desde el backend', err);
  }
});
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
