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
    <h2>Explora nuestros productos</h2>
  </div>

  <div class="card-container">
      <div class="card">
        <img src="../assets/imagenesHome/Categorias/procesadores.jpg" alt="Procesadores" />
        <div class="overlay">
          <h3>PROCESADORES</h3>
          <button>Ver productos</button>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/motherboards.jpg" alt="Motherboards" />
        <div class="overlay">
          <h3>PLACAS MADRE</h3>
          <button>Ver productos</button>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/ram.jpg" alt="Memoria RAM" />
        <div class="overlay">
          <h3>MEMORIAS RAM</h3>
          <button>Ver productos</button>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/videocard.jpg" alt="Placas de Video" />
        <div class="overlay">
          <h3>PLACAS DE VIDEO</h3>
          <button>Ver productos</button>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/perifericos.jpg" alt="Periféricos" />
        <div class="overlay">
          <h3>PERIFÉRICOS</h3>
          <button>Ver productos</button>
        </div>
      </div>
    </div>
</section>

    
      <!-- ===== Categorías principales 
 
      <section class="categorias">
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
===== -->

    <!-- Ofertas arriba -->
    <Ofertas @abrirPreview="$emit('abrirPreview')" />

  
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

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Ofertas from "../components/Ofertas.vue";
import quienesSomos from "../components/quienesSomos.vue";

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
.productos img{
  width: 300px;
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

/* PROBANDO */
.separator {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  margin: 0;           /* quitar margen externo */
  padding: 0.92rem 0;   /* pequeño espacio para que respire */
}

.separator h2 {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
  color: var(--color-secondary-foreground);        /* color del texto, cambia si querés */
  background-color: transparent;
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
  gap: 0;
}

.card {
  flex: 1;
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0;
}

.card img {
  width: 100%;
  height: 100%; /* ajusta el alto que quieras */
  object-fit: cover;
  transition: transform 0.6s ease, filter 0.6s ease;
  display: block;
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

</style>