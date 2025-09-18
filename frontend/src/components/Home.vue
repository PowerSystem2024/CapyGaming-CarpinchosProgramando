<template>
  <div class="home-page">
    <!-- Ofertas arriba -->
    <Ofertas @abrirPreview="$emit('abrirPreview')" />

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
          <div class="caption">
            <h2>{{ slide.titulo }}</h2>
            <p>{{ slide.texto }}</p>
          </div>
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

      <!-- Secundarios a la derecha -->
      <div class="side-cards">
        <div
          v-for="(cat, i) in categorias.filter(c => c.tipo === 'secundario')"
          :key="i"
          class="cat-card secundario"
        >
          <img :src="cat.img" :alt="cat.nombre" />
          <h3>{{ cat.nombre }}</h3>
          <small>{{ cat.productos }} productos</small>
        </div>
      </div>
    </section>

    <!-- ===== Categorías principales ===== -->
    <section class="categorias">
      <h2>Categorías</h2>
      <div class="grid">
        <div
          v-for="(cat, i) in categorias.filter(c => c.tipo === 'principal')"
          :key="i"
          class="cat-card principal"
        >
          <img :src="cat.img" :alt="cat.nombre" />
          <h3>{{ cat.nombre }}</h3>
          <small>{{ cat.productos }} productos</small>
        </div>
      </div>
    </section>

    <!-- ===== Productos Destacados ===== -->
    <section class="productos">
      <h2>Productos destacados</h2>
      <div class="grid">
        <div v-for="(prod, i) in destacados" :key="i" class="product-card">
          <img :src="prod.img" :alt="prod.nombre" />
          <h3>{{ prod.nombre }}</h3>
          <p class="precio">{{ prod.precio }}</p>
        </div>
      </div>
    </section>

    <!-- ===== Productos Recientes ===== -->
    <section class="productos">
      <h2>Productos recientes</h2>
      <div class="grid">
        <div v-for="(prod, i) in recientes" :key="i" class="product-card">
          <img :src="prod.img" :alt="prod.nombre" />
          <h3>{{ prod.nombre }}</h3>
          <p class="precio">{{ prod.precio }}</p>
        </div>
      </div>
    </section>

    <!-- quienesSomos -->
    <quienesSomos />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Ofertas from "../components/Ofertas.vue";
import quienesSomos from "../components/quienesSomos.vue";

// ✅ Carrusel
import imgProc from "../assets/imagenesHome/homeProcesadores.jpg";
import imgVideo from "../assets/imagenesHome/placasDeVideoHome.jpg";
import imgMother from "../assets/imagenesHome/placaMadreHome.jpg";

const slides = ref([
  { img: imgProc, titulo: "Procesadores", texto: "Velocidad y rendimiento." },
  { img: imgVideo, titulo: "Placas de Video", texto: "Gráficos de alto nivel." },
  { img: imgMother, titulo: "Mothers", texto: "Conectividad y estabilidad." },
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

onMounted(() => {
  interval = setInterval(nextSlide, 5000); // autoplay
});
onUnmounted(() => {
  clearInterval(interval);
});

// ✅ Categorías
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

// ✅ Productos
import p1 from "../assets/imagenesHome/product-1.jpg";
import p2 from "../assets/imagenesHome/product-2.jpg";
import p3 from "../assets/imagenesHome/product-3.jpg";
import p4 from "../assets/imagenesHome/product-4.jpg";
import p5 from "../assets/imagenesHome/product-5.jpg";
import p6 from "../assets/imagenesHome/product-6.jpg";
import p7 from "../assets/imagenesHome/product-7.jpg";
import p8 from "../assets/imagenesHome/product-8.jpg";

const destacados = ref([
  { nombre: "Producto 1", precio: "$123.00", img: p1 },
  { nombre: "Producto 2", precio: "$99.00", img: p2 },
  { nombre: "Producto 3", precio: "$150.00", img: p3 },
  { nombre: "Producto 4", precio: "$80.00", img: p4 },
]);

const recientes = ref([
  { nombre: "Producto A", precio: "$200.00", img: p5 },
  { nombre: "Producto B", precio: "$175.00", img: p6 },
  { nombre: "Producto C", precio: "$210.00", img: p7 },
  { nombre: "Producto D", precio: "$99.00", img: p8 },
]);
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 1rem;
}

/* ===== Hero (Carrusel + Secundarios) ===== */
.hero {
  display: grid;
  grid-template-columns: 2fr 1fr; /* carrusel 2/3 - secundarios 1/3 */
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: stretch;
}
.hero .carousel,
.hero .side-cards {
  height: 400px;
}

/* ===== Carousel ===== */
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
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
  border-radius: 1rem;
}
.caption {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: var(--color-foreground);
  background: rgba(0, 0, 0, 0.4);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
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
}
.indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-muted);
  cursor: pointer;
}
.indicators span.active {
  background: var(--color-primary);
}

/* ===== Secundarios (a la derecha) ===== */
.side-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.side-cards .cat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ===== Categorías / Productos ===== */
section {
  padding: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
  background: linear-gradient(145deg, var(--color-card), var(--color-muted));
}
.cat-card.principal img {
  height: 200px;
  object-fit: cover;
}

/* Estilo secundario (N°2 → Notebooks y Kits) */
.cat-card.secundario {
  background-color: var(--color-popover);
  border: none;          /* 🔹 sin borde */
  box-shadow: none;      /* 🔹 sin sombra */
  border-radius: 1rem;   /* 🔹 igual que el carrusel */
  padding: 0;            /* 🔹 quita padding extra */
  overflow: hidden;      /* 🔹 imagen ocupa todo el bloque */
}
.cat-card.secundario img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}
.cat-card.secundario h3,
.cat-card.secundario small {
  position: absolute;    /* 🔹 si querés texto sobre la imagen */
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-foreground);
  background: rgba(0,0,0,0.4);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

</style>





