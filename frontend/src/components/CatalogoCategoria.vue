<template>
  <div class="catalogo-categoria">
    <h1>{{ categoria }}</h1>

    <div class="sidebar-container">
      <!-- Sidebar: Explorador de categorías -->
      <aside class="sidebar sidebar-categorias">
        <!-- Título de categoría -->
        <h2 class="sidebar-main-title">{{ categoria.toUpperCase()}}</h2>

        <hr class="separador">

        <!-- Subcategorías dinámicas -->
        <div v-if="subcategorias && subcategorias.length" class="subcategorias-section">
          <ul class="main-cats">
            <li
              v-for="(sub, index) in subcategorias"
              :key="sub.name || sub"
              :class="{
                expanded: subcategoriasExpandidas[index],
                'has-children': sub.children && sub.children.length,
                selected: normalizar(sub.name || sub) === normalizar(subcategoria)
              }"
            >
              <!-- Enlace principal con toggle para expandir -->
              <div class="subcategoria-header">
                <router-link :to="`/categoria/${categoria}/${sub.name || sub}`" class="sidebar-link">
                  {{ sub.name || sub }}
                </router-link>
                <!-- Botón de flecha solo si tiene hijos -->
                <button
                  v-if="sub.children && sub.children.length"
                  @click.prevent="toggleSubcategoria(index)"
                  class="toggle-btn"
                  :aria-label="subcategoriasExpandidas[index] ? 'Contraer' : 'Expandir'"
                >
                </button>
              </div>

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
        </div>
      </aside>
    </div>

    <!-- Contenedor del filtro y productos -->
    <div class="contenido">
      <!-- Filtro de orden estilo ResultadosPage -->
      <div class="ordenador" v-if="productos.length > 0">
        <label for="orden">Ordenar por:</label>
        <select id="orden" v-model="ordenPrecio" @change="aplicarOrdenamiento">
          <option value="ninguno">Sin ordenar</option>
          <option value="menorPrecio">Menor Precio</option>
          <option value="mayorPrecio">Mayor Precio</option>
          <option value="nombreAZ">Alfabético A-Z</option>
          <option value="nombreZA">Alfabético Z-A</option>
          <option value="masStock">Mayor stock</option>
          <option value="menosStock">Menor stock</option>
          <option value="mayorDescuento">Mayor descuento</option>
        </select>
      </div>

      <!-- Sección principal que muestra los productos ya filtrados desde el backend -->
      <section class="productos-grid">
        <!-- Renderiza una tarjeta por cada producto filtrado y ordenado -->
        <ProductCard
          v-for="p in productosOrdenados"
          :key="p.id_producto"
          :producto="p"
          @agregar="agregarAlCarrito"
        />
        <!--Si no hay productos, muestra un mensaje de "sin resultados" -->
        <div v-if="productosOrdenados.length === 0" class="no-result">
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
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';
import apiClient from '../api/apiClient';
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
const subcategoriasExpandidas = ref({});

// Función para toggle de subcategorías
const toggleSubcategoria = (index) => {
  subcategoriasExpandidas.value[index] = !subcategoriasExpandidas.value[index];
};

watch(
  () => route.params.categoria,
  async (nuevoValor) => {
    categoria.value = nuevoValor;
    try {
      const res = await apiClient.get(`/api/categorias/${nuevoValor}/subcategorias`);
      subcategorias.value = res.data;

      // Inicializar estado de expansión (todas cerradas por defecto)
      subcategoriasExpandidas.value = {};

      // Auto-expandir la subcategoría que coincide con la URL actual
      if (subcategoria.value) {
        const index = subcategorias.value.findIndex(
          sub => normalizar(sub.name || sub) === normalizar(subcategoria.value)
        );
        if (index !== -1 && subcategorias.value[index].children?.length) {
          subcategoriasExpandidas.value[index] = true;
        }
      }
    } catch (err) {
      console.error('Error al cargar subcategorías', err);
      subcategorias.value = [];
    }
  },
  { immediate: true }
);


// Productos filtrados desde el backend
// Cada vez que cambia la categoría o subcategoría, se hace una nueva petición al backend.
// El backend devuelve solo los productos que coinciden con esos filtros.
const productos = ref([]);
const ordenPrecio = ref('ninguno'); // Estado para el ordenamiento

watch(
  () => [categoria.value, subcategoria.value],
  async () => {
    try {
      const res = await apiClient.get('/api/productos', {
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

// Computed para productos ordenados
const productosOrdenados = computed(() => {
  if (ordenPrecio.value === 'ninguno') {
    return productos.value;
  }

  const productosCopiados = [...productos.value];

  switch (ordenPrecio.value) {
    case 'menorPrecio':
      return productosCopiados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));

    case 'mayorPrecio':
      return productosCopiados.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));

    case 'nombreAZ':
      return productosCopiados.sort((a, b) => a.nombre.localeCompare(b.nombre));

    case 'nombreZA':
      return productosCopiados.sort((a, b) => b.nombre.localeCompare(a.nombre));

    case 'masStock':
      return productosCopiados.sort((a, b) => parseInt(b.stock) - parseInt(a.stock));

    case 'menosStock':
      return productosCopiados.sort((a, b) => parseInt(a.stock) - parseInt(b.stock));

    case 'mayorDescuento':
      return productosCopiados.sort((a, b) => {
        const descuentoA = a.descuento || 0;
        const descuentoB = b.descuento || 0;
        return parseInt(descuentoB) - parseInt(descuentoA);
      });

    default:
      return productosCopiados;
  }
});

// Función para aplicar el ordenamiento
const aplicarOrdenamiento = () => {
  console.log('Ordenamiento aplicado:', ordenPrecio.value);
};

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
  gap: 1rem;
  padding: 2rem 0rem;
  padding-top: calc(90px + 60px); /* navbar + subnavbar */
  margin: 0 12rem;
}

/* Contenedor del sidebar */
.sidebar-container {
  width: 400px;
  flex-shrink: 0;
}

/* Sidebar de categorías */
.sidebar {
  background: var(--color-background-light);
  border-radius: 8px;
  padding: 1rem 2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* Contenedor de contenido (ordenador + productos) */
.contenido {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Título principal del sidebar */
.sidebar-main-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--color-primary);
  text-align: left;
}

/* Separador */
.separador {
  border: none;
  height: 1px;
  background-color: var(--color-border);
  margin: 1rem 0;
}

/* Sección de subcategorías */
.subcategorias-section {
  background: transparent;
}

/* Ordenador estilo ResultadosPage */
.ordenador {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
  font-size: 0.9rem;
  background-color: var(--color-background-light);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.ordenador label {
  font-weight: 500;
  color: var(--color-foreground);
}

.ordenador select {
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-foreground);
  outline: none;
  appearance: none;
  font-size: 0.9rem;
  cursor: pointer;
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
  background: transparent;
}

.sidebar li {
  margin-bottom: 0.25rem;
  padding-bottom: 0.25rem;
  background: transparent;
}

.sidebar li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  background: transparent;
}

/* Contenedor del header de subcategoría */
.subcategoria-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  position: relative;
}

/* Ajustar el link para que ocupe el espacio disponible */
.subcategoria-header .sidebar-link {
  flex: 1;
}

/* Botón de toggle (flechita) */
.toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-foreground);
  transition: all 0.25s ease;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  position: relative;
}

.toggle-btn::before {
  content: "⮟";
  font-size: 0.95rem;
  transition: transform 0.25s ease;
  display: block;
}

/* Flecha girada cuando está expandida */
.sidebar li.expanded .toggle-btn::before {
  transform: rotate(180deg);
  color: var(--chart-1);
}

.toggle-btn:hover {
  color: var(--color-primary);
}

/* Resaltar cuando está seleccionada */
.sidebar li.selected .sidebar-link {
  color: var(--chart-1);
  font-weight: 600;
  background-color: var(--color-muted);
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

/* Cuando el padre está expandido, se muestran */
.sidebar li.expanded > .child-list {
  max-height: 500px;
  opacity: 1;
}

/* Estilo visual de subcategorías hijas */
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

.productos-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background-color: var(--color-background-light);
  padding: 1rem;
  border-radius: 8px;
}

.no-result {
  grid-column: 1 / -1;
  text-align: center;
  font-style: italic;
  color: #888;
  margin-top: 2rem;
}

/* Ocultar el h1 de título de categoría (ahora está en el sidebar) */
.catalogo-categoria > h1 {
  display: none;
}

/* Responsive */
@media (max-width: 1200px) {
  .catalogo-categoria {
    margin: 0 4rem;
  }

  .productos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .catalogo-categoria {
    flex-direction: column;
    margin: 0 2rem;
    padding-top: calc(90px + 40px);
  }

  .sidebar-container {
    width: 100%;
  }

  .contenido {
    width: 100%;
  }

  .productos-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ordenador {
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .catalogo-categoria {
    padding-top: calc(60px + 40px);
  }

  .productos-grid {
    grid-template-columns: 1fr;
    padding: 0.5rem;
  }

  .sidebar {
    padding: 1rem;
  }

  .sidebar-main-title {
    font-size: 1.1rem;
  }
}
</style>