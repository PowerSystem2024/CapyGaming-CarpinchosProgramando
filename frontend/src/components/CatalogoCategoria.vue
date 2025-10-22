<template>
  <div class="catalogo-categoria">
    <h1>{{ categoria }}</h1>

    <!-- Sidebar con subcategorías, solo si existen -->
    <aside v-if="subcategorias && subcategorias.length" class="sidebar">
      <h2>HARDWARE</h2>
      <ul class="main-cats">
        <li 
          v-for="sub in subcategorias" 
          :key="sub.name || sub"
          :class="{
            active: normalizar(sub.name || sub) === normalizar(subcategoria),
            'has-children': sub.children && sub.children.length
          }"
        >
          <!-- Enlace principal -->
          <router-link :to="`/categoria/${categoria}/${sub.name || sub}`" class="sidebar-link">
            {{ sub.name || sub }}
          </router-link>

          <!-- Subcategorías (solo si existen hijos) -->
          <ul v-if="sub.children && sub.children.length" class="child-list">
            <li v-for="child in sub.children" :key="child">
              <router-link :to="`/categoria/${categoria}/${child}`" class="sidebar-link">
                {{ child }}
              </router-link>
            </li>
          </ul>
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
        @agregar="agregarAlCarrito"
      />
      <!--Si no hay productos, muestra un mensaje de "sin resultados" -->
      <div v-if="productos.length === 0" class="no-result">
        No se encontraron productos para esta categoría.
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
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';
import { addToCart } from '../utils/cartUtils';
import CarritoModalPreview from '../components/CarritoModalPreview.vue';
import { ultimoProducto, setUltimoProducto } from '../composables/ultimoProducto.js';
import { getCart } from '../utils/cartUtils';

const mostrarModal = ref(false); // estado para mostrar modal
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
      const res = await axios.get(`/api/categorias/${nuevoValor}/subcategorias`);
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
      const res = await axios.get('/api/productos', {
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

const agregarAlCarrito = (producto) => {
  const resultado = addToCart(producto);
  if (resultado.success){
    setUltimoProducto(producto); // guarda el producto agregado
    mostrarModal.value = true; // muestra el modal
  }
  console.log(resultado.message);
};
</script>

<style scoped>
.catalogo-categoria {
  display: flex;
  gap: 2rem;
  padding-top: calc(75px + 60px); /* 60px = altura del navbar */
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.sidebar {
  width: 250px;
  background: var(--color-popover);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  height: fit-content;
  margin-bottom: 10px;
}

/* Estilos para HARDWARE */
.sidebar h2 {
  font-size: 1.4rem;
  background: var(--color-popover);
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--chart-1);
  border-bottom: 2px solid var(--chart-4);
  padding-bottom: 0.5rem;
}

/* Estilos para Todos los productos */
.sidebar h3 {
  margin: 1rem 0 0.5rem 0;
}

/* Estilos comunes para TODOS los enlaces */
.sidebar-link {
  display: block;
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  color: var(--color-foreground);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  border-radius: 4px;
  background: var(--color-popover);
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.sidebar-link:hover {
  background-color: var(--color-accent);
  color: var(--color-accent-foreground);
}

.sidebar-link.active {
  color: var(--chart-5);
  font-weight: 600;
  background-color: var(--color-muted);
}

.all-products-link {
  font-size: 1rem;
  font-weight: 600;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  background: var(--color-popover);
}

.sidebar li {
  margin-bottom: 0.25rem;
  padding-bottom: 0.25rem;
  background: var(--color-popover);
}

.sidebar li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  background: var(--color-popover);
}

.sidebar li.active .sidebar-link {
  color: var(--chart-1);
  font-weight: 600;
  background-color: var(--color-muted);
}

/* Flechita solo en ítems con hijos */
.sidebar li.has-children {
  position: relative;
  cursor: pointer;
}

.sidebar li.has-children::after {
  content: "⮟";
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%) rotate(0deg);
  transition: transform 0.25s ease;
  font-size: 0.95rem;
  color: var(--color-foreground);
}

/* Flecha girada cuando el ítem está activo */
.sidebar li.has-children.active::after {
  transform: translateY(-50%) rotate(180deg);
  color: var(--chart-1);
}

/* Subcategorías ocultas por defecto */
.sidebar .child-list {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.25s ease;
  margin-left: 0.5rem;
  padding-left: 0.25rem;
}

/* Cuando el padre está activo, se expanden */
.sidebar li.has-children.active > .child-list {
  max-height: 500px;
  opacity: 1;
}

/* Estilo visual de subcategorías */
.sidebar .child-list li {
  padding: 0.25rem 0;
}

.sidebar .child-list .sidebar-link {
  padding-left: 1rem;
  font-size: 0.92rem;
  color: var(--color-foreground);
  background: none;
}

.sidebar .child-list .sidebar-link:hover {
  color: var(--chart-1);
}

/* Hover elegante para el padre */
.sidebar li.has-children:hover::after {
  color: var(--chart-4);
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  flex: 1;
}

.no-result {
  grid-column: 1 / -1;
  text-align: center;
  font-style: italic;
  color: #888;
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Estilos para el título principal */
.catalogo-categoria h1 {
  position: absolute;
  top: 75px;
  left: 0;
  right: 0;
  background: #f8f8f8;
  padding: 1rem 2rem;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  z-index: 10;
}

/* Ajuste del padding superior para compensar el título fijo */
.catalogo-categoria {
  padding-top: calc(75px + 60px + 60px); /* navbar + título */
}

/* Responsive */
@media (max-width: 768px) {
  .catalogo-categoria {
    flex-direction: column;
    gap: 1rem;
  }
  
  .sidebar {
    width: 100%;
    order: 2;
  }
  
  .productos-grid {
    order: 1;
  }
  
  .catalogo-categoria h1 {
    position: static;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .catalogo-categoria {
    padding-top: calc(75px + 1rem);
  }
}
</style>