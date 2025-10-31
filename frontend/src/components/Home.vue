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
      <div class="card">
        <img src="../assets/imagenesHome/Categorias/procesadores.jpg" alt="Procesadores" />
        <div class="overlay">
          <h3>PROCESADORES</h3>
          <router-link to="/categoria/hardware/procesadores" class="btn">Ver productos</router-link>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/motherboards.jpg" alt="Motherboards" />
        <div class="overlay">
          <h3>PLACAS MADRE</h3>
          <router-link to="/categoria/hardware/motherboard" class="btn">Ver productos</router-link>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/ram.jpg" alt="Memoria RAM" />
        <div class="overlay">
          <h3>MEMORIAS RAM</h3>
          <router-link to="/categoria/hardware/memorias ram" class="btn">Ver productos</router-link>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/videocard.jpg" alt="Placas de Video" />
        <div class="overlay">
          <h3>PLACAS DE VIDEO</h3>
          <router-link to="/categoria/hardware/placas de video" class="btn">Ver productos</router-link>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/perifericos.jpg" alt="Periféricos" />
        <div class="overlay">
          <h3>PERIFÉRICOS</h3>
          <router-link to="/categoria/perifericos" class="btn">Ver productos</router-link>
        </div>
      </div>
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
  gap: 3rem;
  padding-top: calc(75px + 60px); /* 60px = altura del navbar */
}

/* ===== Hero (Carrusel + Secundarios) ===== */
.hero {
  display: flex;
  width: 100%;
  margin: 0;       /* pegado al navbar */
  padding: 0;      /* sin padding extra */
  height: 500px;   /* puedes ajustar la altura */
}

.hero .carousel,
.hero .side-cards {
  height: 550px;
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

/* ===== Categorías / Productos ===== */

.grid {
  display: flex;
  gap: 1rem;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.cat-card {
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s;
  background-color: var(--color-card);
  color: var(--color-card-foreground);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.cat-card img {
  width: 100%;
  border-radius: 0.5rem;
}

/* Estilo principal (N°1) */
.cat-card.principal {
  grid-column: span 2;

}
.cat-card.principal img {
  height: 200px;
  object-fit: cover;
}

/* Estilo secundario (N°2 → Notebooks y Kits) */
.cat-card.secundario {
  background-color: var(--color-popover);
  border: none;          /*  sin borde */
  box-shadow: none;      /*  sin sombra */
  border-radius: 1rem;   /*  igual que el carrusel */
  padding: 0;            /*  quita padding extra */
  overflow: hidden;      /*  imagen ocupa todo el bloque */
}
.cat-card.secundario img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
} 

/*.productos img{
  width: 300px;
} */

.cat-card.secundario h3,
.cat-card.secundario small {
  position: absolute;    /*  si querés texto sobre la imagen */
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-foreground);
  background: rgba(0,0,0,0.4);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

/* PROBANDO */
.separator {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  margin: 0;           /* quitar margen externo */
  padding: 0.4rem 1rem;   /* pequeño espacio para que respire */
  position: relative;
}

.separator h2 {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
  color: var(--color-background);        /* color del texto, cambia si querés */
  background-color: transparent;
  flex: 1;
}

.autoplay-toggle {
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid var(--color-background);
  color: var(--color-background);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
}

.autoplay-toggle:hover {
  background: var(--color-background);
  color: var(--color-primary);
  transform: scale(1.1);
}

.autoplay-toggle svg {
  width: 20px;
  height: 20px;
  background: transparent;
}

.categorias {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
}

/* Contenedor de tarjetas */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 2rem 1rem;
}

.card  {
  flex: 1;
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 250px;
  height: 350px;
}


.btn {
  width:50%; 
  padding:0.6rem 1rem; 
  border:none; 
  border-radius:8px; 
  background:var(--color-primary); 
  color:var(--color-background); 
  cursor:pointer; transition: all 0.25s ease-in-out; font-weight: 600
}
.btn:hover { background-color: var(--color-secondary); color: var(--color-foreground); }

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease, filter 0.6s ease;
  display: block;
  border-radius: 1rem;
}


.card:hover img {
  transform: scale(1.05); /* pequeño zoom */
  filter: brightness(0.4); /* se oscurece */
}

.card:hover::before {
  border-color: orange; /* borde animado */
}

.overlay {
  position: absolute;
  bottom: -100%;
  left: 0; 
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: white;
  text-align: center;
  background: transparent;
  transition: bottom 0.6s ease;
}

.card:hover .overlay {
  bottom: 0; /* entra desde la izquierda */
}

.overlay h3 {
  font-size: 1.5rem;
  letter-spacing: 1px;
  background: none;
}

.overlay button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: var(--color-primary);
  color: black;
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s;
}

.overlay button:hover {
  background: var(--chart-3);
}

/* ESTILOS PARA BENEFICIOS */
.benefits-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--color-card); /* o un color suave como #f5f5f5 */
  width: 100%;
  height: 200px;
  padding: 0rem 12rem;
  padding-left: 21rem; /* para centrarlo */
  margin: 2rem auto;
  margin-top: 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.benefit-item {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  background: transparent;
  padding: 0;
}

.benefit-item p {
  font-weight: 400;
  font-size: 0.9rem;
  color: var(--color-muted-foreground);
  margin: 0;
  background: transparent;
}
.benefit-icon {
  font-size: 2rem;
  background: transparent;
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
}

.benefit-subtext {
  font-weight: 300;
  font-size: 0.9rem;
  background: transparent;
}

.benefit-icon svg{
  background: transparent;
}

/* ===== ESTILOS PARA CARRUSEL DE PRODUCTOS ===== */
.productos-carousel {
  width: 100%;
  padding: 3rem 2rem;
  background: var(--color-background);
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1rem;
}

.productos-carousel-container {
  flex: 1;
  overflow: hidden;
  padding: 2rem 0;
}

.productos-carousel-track {
  display: flex;
  gap: 2rem;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.producto-card {
  min-width: calc((100% - 6rem) / 4); /* 4 productos visibles */
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

/* Botones de navegación del carrusel (flechas simples sin fondo) */
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
}

.no-productos p {
  margin: 0;
  background: transparent;
}

/* Responsive para carruseles */
@media (max-width: 1200px) {
  .producto-card {
    min-width: calc((100% - 4rem) / 3); /* 3 productos en tablets */
  }

  .carousel-btn {
    font-size: 3rem;
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 900px) {
  .productos-carousel {
    padding: 2rem 1rem;
  }

  .producto-card {
    min-width: calc((100% - 2rem) / 2); /* 2 productos en móviles */
  }

  .carousel-btn {
    font-size: 2.5rem;
    width: 40px;
    height: 40px;
  }

  .productos-carousel-track {
    gap: 1rem;
  }

  .producto-imagen {
    height: 220px;
  }
}

@media (max-width: 600px) {
  .producto-card {
    min-width: 100%; /* 1 producto en pantallas pequeñas */
  }

  .carousel-btn {
    font-size: 2rem;
    width: 35px;
    height: 35px;
  }
}

/* Esto todavia hay que corregir cuando tengamos todo lo del Home */
@media (max-width: 1024px) {
  .benefits-bar {
    padding: 0 4rem;
    height: auto;
    flex-direction: column;
    align-items: flex-start;
  }

  .benefit-item {
    justify-content: flex-start;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .carousel {
    height: 400px;
  }

  .carousel img {
    object-fit: cover;
  }

  .card-container {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }

  .card {
    flex: 1 1 calc(50% - 1rem);
    min-width: 240px;
    height: 300px;
  }
}

@media (max-width: 768px) {
  .carousel {
    height: 300px;
  }

  .prev,
  .next {
    font-size: 1.5rem;
    padding: 0.3rem 0.6rem;
  }

  .separator h2 {
    font-size: 1.4rem;
  }

  /*.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem; /* más espacio entre tarjetas 
  justify-content: center;
  padding: 2rem 1rem;
  } */


  .card-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .card {
    height: 250px;
  }

  .overlay h3 {
    font-size: 1.2rem;
  }

  .overlay button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .benefits-bar {
    padding: 0 2rem;
    gap: 1rem;
  }

  .benefit-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .benefit-icon svg {
    width: 60px;
    height: 60px;
  }

  .benefit-title {
    font-size: 1rem;
  }

  .benefit-subtext {
    font-size: 0.9rem;
  }
}



</style>