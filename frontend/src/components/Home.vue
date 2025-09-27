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
          <router-link to="/categoria/hardware/procesadores" class="btn">Ver productos</router-link>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/ram.jpg" alt="Memoria RAM" />
        <div class="overlay">
          <h3>MEMORIAS RAM</h3>
          <router-link to="/categoria/hardware/memorias-ram" class="btn">Ver productos</router-link>
        </div>
      </div>

      <div class="card">
        <img src="../assets/imagenesHome/Categorias/videocard.jpg" alt="Placas de Video" />
        <div class="overlay">
          <h3>PLACAS DE VIDEO</h3>
          <router-link to="/categoria/hardware/placas-de-video" class="btn">Ver productos</router-link>
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
  color: var(--color-background);        /* color del texto, cambia si querés */
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

.card  {
  flex: 1;
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0;
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