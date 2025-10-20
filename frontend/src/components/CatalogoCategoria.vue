<template>
  <div class="catalogo-categoria">
    <h1>{{ categoria }}</h1>

    <!-- Sidebar con subcategorías, solo si existen -->
    <aside v-if="subcategorias && subcategorias.length" class="sidebar">
      <h2>HARDWARE</h2>
      <ul class="main-cats">
        <li 
          v-for="sub in subcategorias" 
          :key="sub"
          :class="{
            active: isSubcategoriaAbierta(sub),
            'has-children': tieneSubcategoriasHijas(sub)
          }"
        >
          <!-- Contenedor flexible para enlace y flecha -->
          <div class="sidebar-link-container">
            <router-link 
              :to="`/categoria/${categoria}/${sub}`" 
              class="sidebar-link"
            >
              {{ sub }}
            </router-link>
            <!-- Botón flecha - solo mostrar si tiene subcategorías hijas -->
            <button 
              v-if="tieneSubcategoriasHijas(sub)" 
              class="flecha-toggle"
              @click="toggleSubcategoria(sub)"
              :class="{ rotated: isSubcategoriaAbierta(sub) }"
            >
              ⮟
            </button>
          </div>

          <!-- Subcategorías hijas - cargadas dinámicamente -->
          <ul 
            v-if="tieneSubcategoriasHijas(sub) && subcategoriasHijas[sub]" 
            class="child-list"
            :class="{ 'is-open': isSubcategoriaAbierta(sub) }"
          >
            <li v-for="hija in subcategoriasHijas[sub]" :key="hija">
              <router-link 
                :to="`/categoria/${categoria}/${hija}`" 
                class="sidebar-link child-link"
              >
                {{ hija }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <!-- Resto del template -->
    <section class="productos-grid">
      <ProductCard 
        v-for="p in productos" 
        :key="p.id_producto" 
        :producto="p"
        @agregar="agregarAlCarrito"
      />
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

const mostrarModal = ref(false);
const route = useRoute();
const categoria = ref(route.params.categoria);
const subcategoria = ref(route.params.subcategoria);

// Estado para controlar subcategorías abiertas
const subcategoriasAbiertas = ref(new Set());

// Estado para almacenar subcategorías hijas
const subcategoriasHijas = ref({});

// Función para cargar subcategorías hijas
const cargarSubcategoriasHijas = async (subcategoriaPadre) => {
  try {
    const res = await axios.get(`http://localhost:3001/api/categorias/${categoria.value}/${subcategoriaPadre}/subcategorias`);
    subcategoriasHijas.value[subcategoriaPadre] = res.data;
    console.log(`Subcategorías hijas de ${subcategoriaPadre}:`, res.data);
  } catch (err) {
    console.error(`Error al cargar subcategorías hijas de ${subcategoriaPadre}`, err);
    subcategoriasHijas.value[subcategoriaPadre] = [];
  }
};

// Función para verificar si una subcategoría tiene hijas
const tieneSubcategoriasHijas = async (subcategoriaNombre) => {
  // Si ya tenemos las hijas cargadas, verificar si hay datos
  if (subcategoriasHijas.value[subcategoriaNombre]) {
    return subcategoriasHijas.value[subcategoriaNombre].length > 0;
  }
  
  // Si no tenemos datos, intentar cargarlos al hacer clic en la flecha
  // Por ahora retornamos false, se cargarán cuando se haga clic
  return false;
};

const toggleSubcategoria = async (subcategoriaNombre) => {
  // Si no tenemos las subcategorías hijas cargadas, cargarlas
  if (!subcategoriasHijas.value[subcategoriaNombre]) {
    await cargarSubcategoriasHijas(subcategoriaNombre);
  }
  
  // Toggle del estado de apertura
  if (subcategoriasAbiertas.value.has(subcategoriaNombre)) {
    subcategoriasAbiertas.value.delete(subcategoriaNombre);
  } else {
    subcategoriasAbiertas.value.add(subcategoriaNombre);
  }
};

const isSubcategoriaAbierta = (subcategoriaNombre) => {
  return subcategoriasAbiertas.value.has(subcategoriaNombre);
};

// Observadores de ruta
watch(() => route.params.categoria, (nuevoValor) => {
  categoria.value = nuevoValor;
});

watch(() => route.params.subcategoria, (nuevoValor) => {
  subcategoria.value = nuevoValor;
});

const normalizar = (texto) => texto?.toLowerCase().trim();

// Subcategorías principales
const subcategorias = ref([]);

watch(
  () => route.params.categoria,
  async (nuevoValor) => {
    categoria.value = nuevoValor;
    try {
      const res = await axios.get(`http://localhost:3001/api/categorias/${nuevoValor}/subcategorias`);
      // Asumimos que el backend devuelve un array de strings
      subcategorias.value = res.data;
      subcategoriasAbiertas.value.clear();
      subcategoriasHijas.value = {}; // Limpiar subcategorías hijas
      
      console.log('🔍 Subcategorías principales recibidas:', res.data);
    } catch (err) {
      console.error('Error al cargar subcategorías', err);
      subcategorias.value = [];
    }
  },
  { immediate: true }
);

// Productos filtrados
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

const agregarAlCarrito = (producto) => {
  const resultado = addToCart(producto);
  if (resultado.success){
    setUltimoProducto(producto);
    mostrarModal.value = true;
  }
  console.log(resultado.message);
};
</script>

<style scoped>
.catalogo-categoria {
  display: flex;
  gap: 2rem;
  padding-top: calc(75px + 60px);
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

/* Contenedor para enlace y flecha */
.sidebar-link-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
}

/* Estilos para enlaces */
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
  flex: 1;
  font-family: inherit;
}

.sidebar-link:hover {
  background-color: var(--color-accent);
  color: var(--color-accent-foreground);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  background: var(--color-popover);
}

.sidebar li {
  margin-bottom: 0.25rem;
  background: var(--color-popover);
  position: relative;
}

/* Botón flecha */
.flecha-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-foreground);
  transition: all 0.3s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  margin-left: 0.5rem;
  z-index: 2;
}

.flecha-toggle:hover {
  background-color: var(--color-accent);
  color: var(--color-accent-foreground);
}

/* Rotación de la flecha cuando está activo */
.flecha-toggle.rotated {
  transform: rotate(180deg);
  color: var(--chart-1);
}

/* Subcategorías ocultas por defecto */
.child-list {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.3s ease;
  margin-left: 1rem;
  padding-left: 0.5rem;
  border-left: 2px solid var(--color-border);
  background: var(--color-popover);
}

/* Cuando está abierto */
.child-list.is-open {
  max-height: 500px;
  opacity: 1;
  margin-top: 0.25rem;
}

/* Estilo para enlaces hijos */
.child-link {
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
  background: none;
  color: var(--color-muted-foreground);
}

.child-link:hover {
  color: var(--chart-1);
  background-color: transparent;
}

/* Items con hijos */
.sidebar li.has-children {
  background: var(--color-muted);
  border-radius: 4px;
  padding: 0.125rem;
}

/* Estilos restantes */
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

.catalogo-categoria {
  padding-top: calc(75px + 60px + 60px);
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