<template>
  <div class="home-page">
     <!-- ===== Hero (Carrusel + Secundarios) ===== -->
    <section class="hero">
      <!-- Carrusel -->
      <div class="carousel">
        <div
          v-for="(slide, i) in slides"
          :key="i"
          class="carousel-item"
          :class="{ active: i === currentSlide }"
        >
          <img :src="slide.img" :alt="slide.titulo" />
   
        </div>

        <!-- Controles -->
        <button class="prev" @click="prevSlide">‹</button>
        <button class="next" @click="nextSlide">›</button>

        <!-- Indicadores -->
        <div class="indicators">
          <span
            v-for="(s, i) in slides"
            :key="i"
            :class="{ active: i === currentSlide }"
            @click="goToSlide(i)"
          ></span>
        </div>
      </div>
    </section>

    <section class="categorias">
  <div class="separator">
    <h2>EXPLORA NUESTROS PRODUCTOS</h2>
  </div>

  <div class="card-container">
      <router-link to="/categoria/hardware/procesadores" class="card">
        <img src="../assets/imagenesHome/Categorias/procesadores.jpg" alt="Procesadores" />
        <h3 class="card-title">PROCESADORES</h3>
      </router-link>

      <router-link to="/categoria/hardware/motherboard" class="card">
        <img src="../assets/imagenesHome/Categorias/motherboards.jpg" alt="Placas Madre" />
        <h3 class="card-title">PLACAS MADRE</h3>
      </router-link>

      <router-link to="/categoria/hardware/memorias ram" class="card">
        <img src="../assets/imagenesHome/Categorias/ram.jpg" alt="Memorias Ram" />
        <h3 class="card-title">MEMORIAS RAM</h3>
      </router-link>

      <router-link to="/categoria/hardware/placas de video" class="card">
        <img src="../assets/imagenesHome/Categorias/videocard.jpg" alt="Placas de video" />
        <h3 class="card-title">PLACAS DE VIDEO</h3>
      </router-link>

      <router-link to="/categoria/hardware/perifericos" class="card">
        <img src="../assets/imagenesHome/Categorias/perifericos.jpg" alt="Procesadores" />
        <h3 class="card-title">PERIFÉRICOS</h3>
      </router-link>
    </div>
</section>

    <!-- Ofertas arriba -->
    <Ofertas @abrirPreview="$emit('abrirPreview')" />

    <!-- Beneficios-->
  <div class="benefits-bar">
    <div class="benefit-item">
      <span class="benefit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 14 14">
          <path fill="#FDEBD0" fill-rule="evenodd" d="M6.375 0H3.489a2.189 2.189 0 0 0-1.874 1.195L0 4.308v.016h6.375zM0 12.923V5.574h14v7.35A1.077 1.077 0 0 1 12.923 14H1.077A1.077 1.077 0 0 1 0 12.923m14-8.615v.016H7.625V0h2.886a2.19 2.19 0 0 1 1.928 1.195zM9.437 8.636a.625.625 0 1 0-1-.75L6.488 10.49l-1.05-.79a.625.625 0 1 0-.75 1l1.55 1.163a.625.625 0 0 0 .876-.126z" clip-rule="evenodd"/>
        </svg>
      </span>
      <div class="benefit-text-block">
        <span class="benefit-title">Envíos a todo el país</span>
        <span class="benefit-subtext">Entrega puerta a puerta</span>
      </div>
    </div>

    <div class="benefit-item">
      <span class="benefit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 288 512">
        <path fill="#FDEBD0" d="m209.2 233.4l-108-31.6C88.7 198.2 80 186.5 80 173.5c0-16.3 13.2-29.5 29.5-29.5h66.3c12.2 0 24.2 3.7 34.2 10.5c6.1 4.1 14.3 3.1 19.5-2l34.8-34c7.1-6.9 6.1-18.4-1.8-24.5C238 74.8 207.4 64.1 176 64V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48h-2.5C45.8 64-5.4 118.7.5 183.6c4.2 46.1 39.4 83.6 83.8 96.6l102.5 30c12.5 3.7 21.2 15.3 21.2 28.3c0 16.3-13.2 29.5-29.5 29.5h-66.3C100 368 88 364.3 78 357.5c-6.1-4.1-14.3-3.1-19.5 2l-34.8 34c-7.1 6.9-6.1 18.4 1.8 24.5c24.5 19.2 55.1 29.9 86.5 30v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-48.2c46.6-.9 90.3-28.6 105.7-72.7c21.5-61.6-14.6-124.8-72.5-141.7z"/>
      </svg>
      </span>
    <div class="benefit-text-block">
      <span class="benefit-title">Garantía de reembolso</span>
      <span class="benefit-subtext">100% devolución del dinero</span>
    </div>
  </div>

    <div class="benefit-item">
      <span class="benefit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 512 512">
          <path fill="#FDEBD0" d="M32 376a56 56 0 0 0 56 56h336a56 56 0 0 0 56-56V222H32Zm66-76a30 30 0 0 1 30-30h48a30 30 0 0 1 30 30v20a30 30 0 0 1-30 30h-48a30 30 0 0 1-30-30ZM424 80H88a56 56 0 0 0-56 56v26h448v-26a56 56 0 0 0-56-56Z"/>
        </svg>
      </span>
    <div class="benefit-text-block">
      <span class="benefit-title">Pago seguro</span>
      <span class="benefit-subtext">Seguridad en el pago</span>
    </div>
    </div>
  </div>

    <!-- ===== Productos Destacados ===== -->
<section class="productos-carousel">
  <div class="separator">
    <h2>Productos Destacados</h2>
  </div>

  <div v-if="destacados.length > 0" class="carousel-wrapper">
    <button class="carousel-btn prev-btn" @click="prevDestacado" :disabled="destacados.length <= 4">‹</button>

    <div class="productos-carousel-container">
      <div
        class="productos-carousel-track"
        :style="{ transform: `translateX(-${currentDestacado * 100}%)` }"
      >
        <div
          v-for="(producto, index) in destacados"
          :key="producto.id_producto"
          class="producto-card"
          @click="verProducto(producto.id_producto)"
        >
          <div class="producto-imagen">
            <img
              :src="producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.png'"
              :alt="producto.nombre"
              @error="$event.target.src = '/placeholder.png'"
            />
            <span v-if="producto.descuento > 0" class="descuento-badge">-{{ producto.descuento }}%</span>
          </div>
          <div class="producto-info">
            <h3 class="producto-nombre">{{ producto.nombre }}</h3>
            <p v-if="producto.marca" class="producto-marca">{{ producto.marca }}</p>
            <p class="producto-precio">$ {{ parseFloat(producto.precio).toLocaleString('es-AR') }}</p>
            <button class="btn-ver-mas">Ver más</button>
          </div>
        </div>
      </div>
    </div>

    <button class="carousel-btn next-btn" @click="nextDestacado" :disabled="destacados.length <= 4">›</button>
  </div>

  <div v-else class="no-productos">
    <p>No hay productos destacados disponibles en este momento</p>
  </div>
</section>


    <!-- ===== Productos Vistos Recientemente ===== -->
<section class="productos-carousel">
  <div class="separator">
    <h2>Vistos Recientemente</h2>
  </div>

  <div v-if="recientes.length > 0" class="carousel-wrapper">
    <button class="carousel-btn prev-btn" @click="prevReciente" :disabled="recientes.length <= 4">‹</button>

    <div class="productos-carousel-container">
      <div
        class="productos-carousel-track"
        :style="{ transform: `translateX(-${currentReciente * 100}%)` }"
      >
        <div
          v-for="(producto, index) in recientes"
          :key="producto.id_producto"
          class="producto-card"
          @click="verProducto(producto.id_producto)"
        >
          <div class="producto-imagen">
            <img
              :src="producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : '/placeholder.png'"
              :alt="producto.nombre"
              @error="$event.target.src = '/placeholder.png'"
            />
          </div>
          <div class="producto-info">
            <h3 class="producto-nombre">{{ producto.nombre }}</h3>
            <p v-if="producto.marca" class="producto-marca">{{ producto.marca }}</p>
            <p class="producto-precio">$ {{ parseFloat(producto.precio).toLocaleString('es-AR') }}</p>
            <button class="btn-ver-mas">Ver más</button>
          </div>
        </div>
      </div>
    </div>

    <button class="carousel-btn next-btn" @click="nextReciente" :disabled="recientes.length <= 4">›</button>
  </div>

  <div v-else class="no-productos">
    <p>No has visto productos recientemente. ¡Explora nuestro catálogo!</p>
  </div>
</section>


  </div> 


</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "../api/apiClient";
import { getRecentlyViewedLimited } from "../utils/recentlyViewedUtils";
import Ofertas from "../components/Ofertas.vue";

// ✅ Carrusel
import imgProc from "../assets/imagenesHome/banner5.jpg";
import imgVideo from "../assets/imagenesHome/banner4.1.jpg";
import imgMother from "../assets/imagenesHome/banner4.3.jpg";
import img1 from "../assets/imagenesHome/banner2.3.jpg";


const slides = ref([
  { img: imgProc, titulo: "Procesadores", texto: "Velocidad y rendimiento." },
  { img: imgVideo, titulo: "Placas de Video", texto: "Gráficos de alto nivel." },
  { img: imgMother, titulo: "Mothers", texto: "Conectividad y estabilidad." },
  { img: img1, titulo: "Banner", texto: "BANNER"}
]);

const currentSlide = ref(0);
let interval = null;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
}
function prevSlide() {
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
}
function goToSlide(i) {
  currentSlide.value = i;
}

onMounted(async () => {
  interval = setInterval(nextSlide, 5000); // autoplay banner principal

  await cargarProductosDestacados();
  await cargarProductosRecientes();

  // Escuchar actualizaciones en productos vistos recientemente
  window.addEventListener('recentlyViewedUpdated', cargarProductosRecientes);
});
onUnmounted(() => {
  clearInterval(interval);
  window.removeEventListener('recentlyViewedUpdated', cargarProductosRecientes);
});

// ✅ Categorías ------------------------------------------------------------------------------------------------
import imgNote from "../assets/imagenesHome/notebookHome.jpg";
import imgCombo from "../assets/imagenesHome/comboActualizacion.jpg";
import imgRam from "../assets/imagenesHome/homeMemoriaRAM.jpg";

const categorias = ref([
  { nombre: "Notebooks", productos: 4, img: imgNote, tipo: "secundario" },
  { nombre: "Kits de actualización", productos: 3, img: imgCombo, tipo: "secundario" },
  { nombre: "Procesadores", productos: 3, img: imgProc, tipo: "principal" },
  { nombre: "Mothers", productos: 3, img: imgMother, tipo: "principal" },
  { nombre: "Placas de video", productos: 3, img: imgVideo, tipo: "principal" },
  { nombre: "Memorias RAM", productos: 4, img: imgRam, tipo: "principal" },
]);

// ✅ Productos Destacados y Recientes
const router = useRouter();
const destacados = ref([]);
const recientes = ref([]);
const currentDestacado = ref(0);
const currentReciente = ref(0);

// Cargar productos destacados desde el backend
const cargarProductosDestacados = async () => {
  try {
    const res = await apiClient.get('/api/productos-destacados');
    destacados.value = res.data;
  } catch (error) {
    console.error('Error al cargar productos destacados:', error);
  }
};

// Cargar productos vistos recientemente
const cargarProductosRecientes = () => {
  try {
    recientes.value = getRecentlyViewedLimited(8); // Traer 8 para tener 2 páginas de 4
  } catch (error) {
    console.error('Error al cargar productos recientes:', error);
  }
};

// Navegar al detalle del producto
const verProducto = (id) => {
  router.push({ name: 'ProductoDetalle', params: { id } });
};

// Funciones para navegar en el carrusel de destacados (4 productos por vista)
const nextDestacado = () => {
  if (destacados.value.length > 4) {
    currentDestacado.value = (currentDestacado.value + 1) % Math.ceil(destacados.value.length / 4);
  }
};

const prevDestacado = () => {
  if (destacados.value.length > 4) {
    const totalSlides = Math.ceil(destacados.value.length / 4);
    currentDestacado.value = (currentDestacado.value - 1 + totalSlides) % totalSlides;
  }
};

// Funciones para navegar en el carrusel de recientes (4 productos por vista)
const nextReciente = () => {
  if (recientes.value.length > 4) {
    currentReciente.value = (currentReciente.value + 1) % Math.ceil(recientes.value.length / 4);
  }
};

const prevReciente = () => {
  if (recientes.value.length > 4) {
    const totalSlides = Math.ceil(recientes.value.length / 4);
    currentReciente.value = (currentReciente.value - 1 + totalSlides) % totalSlides;
  }
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* ===== Hero (Carrusel) ===== */
.hero {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  height: 500px;
  justify-content: center;
}

.hero .carousel {
  height: 550px;
  width: 100%;
}

/* ===== Carousel ===== */
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-card);
}
.carousel-item {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.carousel-item.active {
  opacity: 1;
}

.carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Controles */
.prev,
.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: var(--color-foreground);
  border: none;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  z-index: 10;
}

.prev { left: 10px; }
.next { right: 10px; }

/* Indicadores */
.indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: none;
  z-index: 10;
}

.indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff18;
  cursor: pointer;
}

.indicators span.active {
  background: var(--color-primary);
}

/* ===== Categorías ===== */
.categorias {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0;
  width: 100%;
}

.separator {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  margin: 0;
  padding: 0.4rem 1rem;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
}

.separator h2 {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
  color: var(--color-background);
  background-color: transparent;
  flex: 1;
}

/* Contenedor de tarjetas */
.card-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 columnas iguales */
  padding: 2rem 1rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 0.5rem;
  box-sizing: border-box;
}

.card {
  position: relative;
  overflow: hidden;
  border: 2px solid var(--color-primary); /* Borde amarillo */
  border-radius: 12px;
  cursor: pointer;
  display: block;
  width: 100%;
  aspect-ratio: 5 / 3; /* Más ancho que alto */
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
/* Animación de borde brillante que recorre todo el perímetro */
.card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(
    45deg,
    var(--color-primary),
    #ffd700, /* amarillo más brillante */
    var(--color-primary)
  );
  border-radius: 12px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
  filter: blur(8px); /* Efecto de brillo/glow */
}

.card:hover::before {
  opacity: 1;
}
.card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    to top,
    rgba(243, 156, 18, 0.15) 0%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 1;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.card:hover::after {
  opacity: 0; /* Desaparece al hover para que destaque el gradiente del título */
}

.card:hover {
  border-width: 3px; /* Borde más grueso */
  box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
  transform: translateY(-4px);
}

.card-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.2rem 1rem;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: white;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.3) 80%,
    transparent 100%
  ); /* Gradiente negro desde abajo para que se lea el texto */
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
  z-index: 2;
}

.card:hover .card-title {
  color: var(--color-primary); /* Amarillo al hover */
  background: linear-gradient(
    to top,
    rgba(243, 156, 18, 0.4) 0%,
    rgba(243, 156, 18, 0.2) 50%,
    transparent 100%
  );
}

.card:hover .card-image-wrapper img {
  transform: scale(1.08); /* Zoom sutil al hover */
}

.card img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  z-index: 1;
}

.card:hover img {
  transform: scale(1.08); 
}



/* ===== ESTILOS PARA BENEFICIOS ===== */
.benefits-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-card);
  width: 100%;
  max-width: 1400px;
  height: 200px;
  padding: 0 2rem;
  margin: 2rem auto;
  margin-top: 0;
  flex-wrap: wrap;
  gap: 2rem;
  box-sizing: border-box;
}

.benefit-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  background: transparent;
  padding: 0;
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  justify-content: flex-start;
}

.benefit-icon {
  font-size: 2rem;
  background: transparent;
  flex-shrink: 0;
}

.benefit-text-block {
  display: flex;
  flex-direction: column;
  background: transparent;
}

.benefit-title {
  font-weight: 600;
  font-size: 1rem;
  background: transparent;
  margin: 0;
}

.benefit-subtext {
  font-weight: 300;
  font-size: 0.9rem;
  background: transparent;
  margin: 0;
}

.benefit-icon svg {
  background: transparent;
}

/* ===== ESTILOS PARA CARRUSEL DE PRODUCTOS ===== */
.productos-carousel {
  width: 100%;
  padding: 3rem 2rem;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1rem;
  width: 100%;
}

.productos-carousel-container {
  flex: 1;
  overflow: hidden;
  padding: 2rem 0;
  width: 100%;
}

.productos-carousel-track {
  display: flex;
  gap: 2rem;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  /* El ancho se calcula automáticamente según el número de productos */
}

.producto-card {
  flex: 0 0 calc(25% - 1.5rem); /* 25% del container menos el gap proporcional */
  background: var(--color-card);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.producto-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-primary);
  box-shadow: 0 8px 30px rgba(243, 156, 18, 0.4);
}

.producto-imagen {
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  padding: 1rem;
  overflow: hidden;
}

.producto-imagen img {
  max-width: 95%;
  max-height: 95%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.producto-card:hover .producto-imagen img {
  transform: scale(1.1);
}

.descuento-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--color-destructive);
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
  z-index: 10;
}

.producto-info {
  padding: 1.5rem;
  background: var(--color-card);
  text-align: center;
}

.producto-nombre {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-foreground);
  margin: 0 0 0.5rem 0;
  min-height: 2.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  background: transparent;
  line-height: 1.3;
}

.producto-marca {
  font-size: 0.85rem;
  color: var(--color-muted-foreground);
  margin: 0 0 0.8rem 0;
  background: transparent;
}

.producto-precio {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin: 0.8rem 0 1.2rem 0;
  background: transparent;
}

.btn-ver-mas {
  width: 100%;
  padding: 0.8rem 1.5rem;
  background: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-ver-mas:hover {
  background: var(--color-secondary);
  color: var(--color-foreground);
  transform: scale(1.05);
}

/* Botones de navegación del carrusel */
.carousel-btn {
  background: transparent !important;
  border: none;
  outline: none;
  box-shadow: none !important;
  color: var(--color-primary);
  font-size: 3.5rem;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: bold;
  transition: none;
}

.carousel-btn:hover,
.carousel-btn:focus,
.carousel-btn:active {
  background: transparent !important;
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
  transform: none !important;
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.no-productos {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-muted-foreground);
  font-size: 1.1rem;
  background: var(--color-card);
  border-radius: 12px;
  margin: 2rem auto;
  max-width: 600px;
  border: 2px dashed var(--color-border);
  width: 100%;
  box-sizing: border-box;
}

.no-productos p {
  margin: 0;
  background: transparent;
}

/* ===== RESPONSIVE DESIGN ===== */

/* Tablets y pantallas medianas (768px - 1199px) */
@media (max-width: 1199px) {
  .home-page {
    gap: 2.5rem;
  }

  .hero {
    height: 400px;
  }

  .hero .carousel {
    height: 450px;
  }

  .card-container {
  grid-template-columns: repeat(5, 1fr); /* 3 columnas */
  gap: 0.75rem;

  }

  .card {
    width: 220px;
    height: 320px;
    aspect-ratio: 6/3;
  }

  .benefits-bar {
    max-width: 1000px;
    height: 180px;
    padding: 0 1.5rem;
    gap: 1.5rem;
  }

  .benefit-item {
    min-width: 200px;
    max-width: 250px;
  }

  .producto-card {
    min-width: calc((100% - 4rem) / 3);
  }

  .producto-imagen {
    height: 280px;
  }

  .carousel-btn {
    font-size: 3rem;
    width: 45px;
    height: 45px;
  }
}

/* Tablets pequeñas (600px - 767px) */
@media (max-width: 767px) {
  .home-page {
    gap: 2rem;
  }

  .hero {
    height: 350px;
  }

  .hero .carousel {
    height: 400px;
  }

  .prev,
  .next {
    font-size: 1.5rem;
    padding: 0.3rem 0.6rem;
  }

  .separator h2 {
    font-size: 1.4rem;
    padding: 0 0.5rem;
  }

  .card-container {
  grid-template-columns: repeat(3, 1fr); /* 2 columnas */
  }

  .card {
    width: calc(50% - 1rem);
    height: 280px;
    max-width: 200px;
    aspect-ratio: 5/3;
  }

  .benefits-bar {
    height: auto;
    padding: 1.5rem;
    gap: 1.5rem;
    flex-direction: column;
    align-items: center;
  }

  .benefit-item {
    min-width: 100%;
    max-width: 300px;
    justify-content: center;
    text-align: center;
  }

  .benefit-icon svg {
    width: 60px;
    height: 60px;
  }

  .productos-carousel {
    padding: 2rem 1rem;
  }

  .producto-card {
    min-width: calc((100% - 2rem) / 2);
  }

  .producto-imagen {
    height: 240px;
  }

  .carousel-btn {
    font-size: 2.5rem;
    width: 40px;
    height: 40px;
  }

  .productos-carousel-track {
    gap: 1rem;
  }
}

/* Móviles (480px - 599px) */
@media (max-width: 599px) {
  .home-page {
    gap: 1.5rem;
    align-items: center;
  }

  .hero {
    height: 250px;
  }

  .hero .carousel {
    height: 300px;
  }

  .separator h2 {
    font-size: 1.2rem;
  }

  .card-container {
  padding: 0rem 0.5rem;
  }

  .card {
  aspect-ratio: 16 / 9; /* Más horizontal en móvil */
  }

  .benefits-bar {
    padding: 1rem;
    gap: 1rem;
  }

  .benefit-item {
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
    min-width: 100%;
  }

  .benefit-icon svg {
    width: 50px;
    height: 50px;
  }

  .benefit-title {
    font-size: 0.9rem;
  }

  .benefit-subtext {
    font-size: 0.8rem;
  }

  .productos-carousel {
    padding: 1.5rem 0.5rem;
  }

  .producto-card {
    min-width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }

  .producto-imagen {
    height: 200px;
  }

  .carousel-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Ocultar flechas en móvil y hacer scroll horizontal */
  .carousel-btn {
    display: none;
  }

  .productos-carousel-container {
    order: 1;
    width: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--color-primary) var(--color-card);
  }

  .productos-carousel-container::-webkit-scrollbar {
    height: 6px;
  }

  .productos-carousel-container::-webkit-scrollbar-track {
    background: var(--color-card);
    border-radius: 3px;
  }

  .productos-carousel-container::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 3px;
  }

  .productos-carousel {
    justify-content: flex-start;
  }

  .btn-ver-mas {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
}

/* Móviles pequeños (hasta 479px) */
@media (max-width: 479px) {
  .home-page {
    gap: 1rem;
  }

  .hero {
    height: 200px;
  }

  .hero .carousel {
    height: 250px;
  }

  .prev,
  .next {
    font-size: 1.2rem;
    padding: 0.2rem 0.4rem;
  }

  .indicators span {
    width: 8px;
    height: 8px;
  }

  .separator {
    padding: 0.3rem 0.5rem;
  }

  .separator h2 {
    font-size: 1rem;
    padding: 0 0.3rem;
  }

  .card-container {
    gap: 0.8rem;
    padding: 0.8rem 0.3rem;
  }

  .card {
    width: calc(50% - 0.4rem);
    height: 180px;
    max-width: 140px;
    padding: 0.3rem;
  }

  .overlay h3 {
    font-size: 0.8rem;
  }

  .overlay .btn {
    width: 90%;
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }

  .benefits-bar {
    padding: 0.8rem;
    gap: 0.8rem;
  }

  .benefit-item {
    gap: 0.5rem;
  }

  .benefit-icon svg {
    width: 40px;
    height: 40px;
  }

  .benefit-title {
    font-size: 0.8rem;
  }

  .benefit-subtext {
    font-size: 0.7rem;
  }

  .productos-carousel {
    padding: 1rem 0.3rem;
  }

  .producto-info {
    padding: 1rem;
  }

  .producto-nombre {
    font-size: 0.85rem;
    min-height: 2.2rem;
  }

  .producto-precio {
    font-size: 1rem;
    margin: 0.5rem 0 1rem 0;
  }

  .btn {
    width: 70%;
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  .carousel-btn {
    display: none;
  }
}

/* Ajustes para pantallas muy grandes (más de 1600px) */
@media (min-width: 1600px) {
  .card-container {
    max-width: 1600px;
  }

  .benefits-bar {
    max-width: 1600px;
  }

  .carousel-wrapper {
    max-width: 1600px;
  }

}
</style>