<template>
  <section class="offers-container">
    <div class="separator">
      <h2>Ofertas del Día</h2>
    </div>

    <div class="offers-carousel-wrapper">
      <div class="offers-carousel-container">
        <div class="offers-carousel-track">
          <div v-for="offer in ofertasConDescuento" :key="offer.id" class="offer-card" @click="abrirDetalle(offer)">
        <!-- Badge con flip -->
        <div class="flip-container">
          <div class="flipper">
            <div class="front">
              <span class="badge-text">
                <span class="badge-descuento">{{ offer.descuento }}%</span><br>
                <span class="badge-off">OFF</span>
              </span>
            </div>
            <div class="back">
              <span class="badge-text">
                <span class="badge-descuento">{{ offer.descuento }}%</span><br>
                <span class="badge-off">OFF</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Imagen del producto -->
        <div class="offer-media">
          <img :src="offer.image" :alt="offer.title" class="offer-image" />
        </div>

        <!-- Información del producto -->
        <div class="offer-content">
          <h3 class="offer-title" :title="offer.title">{{ offer.title }}</h3>
          <div class="offer-prices">
            <span class="old-price">{{ offer.oldPrice }}</span>
            <span class="new-price">{{ offer.newPrice }}</span>
          </div>
        </div>

        <!-- Botón -->
        <button class="offer-btn" @click.stop="agregarAlCarrito(offer)">
          <span class="icon-wrapper">
            <svg class="icon-cart default" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path fill="#161e35" d="M14 13.1V12H4.6l.6-1.1l9.2-.9L16 4H3.7L3 1H0v1h2.2l2.1 8.4L3 13v1.5c0 .8.7 1.5 1.5 1.5S6 15.3 6 14.5S5.3 13 4.5 13H12v1.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.7-.4-1.2-1-1.4z"/>
            </svg>
            <svg class="icon-cart hover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path fill="currentColor" d="M14 13.1V12H4.6l.6-1.1l9.2-.9L16 4H3.7L3 1H0v1h2.2l2.1 8.4L3 13v1.5c0 .8.7 1.5 1.5 1.5S6 15.3 6 14.5S5.3 13 4.5 13H12v1.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.7-.4-1.2-1-1.4z"/>
            </svg>
          </span>
          Agregar al carrito
        </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>
  </section>
</template>

<script>
import apiClient from '../api/apiClient';
import { addToCart } from "../utils/cartUtils";
import { setUltimoProducto } from "../composables/ultimoProducto";
import { useRouter } from 'vue-router';

export default {
  name: "Ofertas",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      offers: [],
      error: null,
    };
  },
  computed: {
    ofertasConDescuento() {
      return this.offers.map(o => ({
        ...o,
        descuento: o.descuento || 0
      }));
    }
  },
  methods: {
    async fetchOfertas() {
      try {
        const response = await apiClient.get('/api/ofertas');



        // Adaptamos los datos del backend al formato del frontend
  this.offers = response.data.map(o => {
    const precioActual = parseFloat(o.newprice);
    const precioAnterior = precioActual / (1 - o.descuento / 100);

    return {
      // Para mostrar en la UI
      id: o.id,
      title: o.title,
      oldPrice: `$${precioAnterior.toFixed(0)}`,
      newPrice: `$${precioActual.toFixed(0)}`,
      image: o.image_url || "https://via.placeholder.com/200x200?text=Sin+imagen",
      descuento: o.descuento,
      
      // Para el carrito (estructura correcta)
      id_producto: o.id,
      nombre: o.title,
      precio: precioActual,
      imagenes: [o.image_url || "https://via.placeholder.com/200x200?text=Sin+imagen"],
      stock: o.stock,
      marca: o.marca
    };
  });

      } catch (err) {
        console.error("❌ Error al traer las ofertas:", err);
        this.error = "No se pudieron cargar las ofertas. Intenta más tarde.";
      }
    },

agregarAlCarrito(oferta) {
  // Ya tiene la estructura correcta desde fetchOfertas
  const resultado = addToCart(oferta);
  if (resultado.success) {
    setUltimoProducto({ ...oferta, quantity: 1 });
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("abrirPreview"));
  } else {
    console.log("Error al agregar oferta:", resultado.message);
  }
},
    abrirDetalle(oferta) {
      this.router.push({ 
        name: 'ProductoDetalle', 
        params: { id: oferta.id } 
      });
    }

},

  mounted() {
    this.fetchOfertas();
  }
};
</script>


<style scoped>
@import url(../assets/styles/base.css);

/* TITULO: OFERTAS DEL DIA - Mismo estilo que Productos Destacados */
.separator {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  margin: 0 0 1rem 0;
  padding: 0.4rem 1rem;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  z-index: 10;
}

.separator h2 {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: var(--color-background);
  margin: 0;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

/* PRODUCTOS EN OFERTA */
.offers-container {
  width: 100%;
  padding: 3rem 2rem;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.offers-carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  gap: 1rem;
  width: 100%;
}

.offers-carousel-container {
  flex: 1;
  overflow: hidden;
  padding: 2rem 0;
  width: 100%;
}

.offers-carousel-track {
  display: flex;
  justify-content: center;
  gap: 2rem;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.offer-card {
  flex: 0 0 calc(22% - 1.5rem);
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
  border-radius: 16px;
  background: var(--color-card);
  position: relative;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.offer-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-primary);
  box-shadow: 0 8px 30px rgba(243, 156, 18, 0.4);
}

.offer-media {
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background);
  padding: 1rem;
  overflow: hidden;
}

.offer-image {
  max-width: 95%;
  max-height: 95%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.offer-card:hover .offer-image {
  transform: scale(1.1);
}

.offer-content {
  flex: 1;
  max-height: 50%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--color-card);
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  text-align: center;
}

.offer-title {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    color: var(--color-foreground);
    background: transparent;
    margin: 0 0 0.5rem 0;
    min-height: 2.5rem;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.offer-prices {
  background: transparent;
  display: flex;
  flex-direction: column;
  margin: 0.8rem 0 1.2rem 0;
}

.old-price {
  text-decoration: line-through;
  color: var(--color-muted-foreground);
  background: transparent;
  font-size: 0.85rem;
  margin: 0 0 0.3rem 0;
}

.new-price {
  color: var(--color-secondary);
  font-weight: 700;
  font-size: 1.3rem;
  background: transparent;
}

.offer-btn {
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
}

.offer-btn:hover {
  background: var(--sidebar-ring);
  color: var(--color-foreground);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

/* Para que el icono del carrito del boton cambie de color */
.icon-wrapper {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  background: transparent;
}

.icon-cart {
  position: absolute;
  left: 0;
  width: 20px;
  vertical-align: middle;
  transition: all 0.25s ease-in-out;
  fill: currentColor;
  margin-top: 3px;
  background-color: transparent;
}

.icon-cart.hover {
  opacity: 0;
}

.offer-btn:hover .icon-cart.default {
  opacity: 0;
}

.offer-btn:hover .icon-cart.hover {
  opacity: 1;
}

/* =============CIRCULO DE OFERTA %OFF============= */
/* Estilos para el circulito de 20% OFF, 15%, etc */

.flip-container {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 61px;
  height: 61px;
  perspective: 800px; /* genera la "profundidad" */
  z-index: 2;
  background: transparent;
}

.flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  background: transparent;
}

.offer-card:hover .flip-container .flipper {
  transform: rotateY(180deg);
}

.front, .back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* oculta el lado posterior cuando gira */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
}

.front {
  background: var(--color-secondary); 
  display: flex;
}

.front span,   /* Para quitar el fondo de las letras */
.back span {
  background: transparent;
}

.back {
  background: var(--color-destructive);
  transform: rotateY(180deg);
}

/* ESTILOS DEL TEXTO DENTRO DEL CIRCULO */
.badge-text {
  text-align: center;
  line-height: 0.6;
  padding-top: 3px;
}

.badge-descuento {
  font-size: 19px;
  font-weight: bold;
  color: #fff; /* o el color que ya estés usando */
  display: block;
}

.badge-off {
  font-size: 19px;
  font-weight: bold;
  color: var(--chart-5); /* Cambiá este color como prefieras */
  display: block;
}


@media (max-width: 1200px) {
  .separator {
    padding: 0.4rem 1rem;
  }
}

/* Tablet */
@media (max-width: 900px) {
  .offers-container {
    padding: 2rem 1rem;
  }

  .separator {
    padding: 0.3rem 0.8rem;
  }

  .separator h2 {
    font-size: 1.4rem;
    padding: 0 0.5rem;
  }

  .offers-carousel-track {
    gap: 1.5rem;
  }

  .offer-card {
    min-width: calc((100% - 3rem) / 3);
  }

  .offer-media {
    height: 280px;
  }

  .offer-content {
    padding: 1rem;
  }

  .offer-title {
    font-size: 0.95rem;
    min-height: 2.2rem;
  }

  .offer-prices {
    margin: 0.5rem 0 1rem 0;
  }

  .new-price {
    font-size: 1rem;
  }

  .offer-btn {
    font-size: 0.9rem;
    padding: 0.5rem 0.8rem;
  }
}

/* Móviles */
@media (max-width: 599px) {
  .offers-container {
    padding: 1.5rem 0.5rem;
  }

  .separator {
    padding: 0.3rem 0.5rem;
  }

  .separator h2 {
    font-size: 1.2rem;
    padding: 0 0.3rem;
  }

  .offers-carousel-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }

  .offers-carousel-container {
    order: 1;
    width: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--color-primary) var(--color-card);
    padding: 2rem 0;
  }

  .offers-carousel-container::-webkit-scrollbar {
    height: 6px;
  }

  .offers-carousel-container::-webkit-scrollbar-track {
    background: var(--color-card);
    border-radius: 3px;
  }

  .offers-carousel-container::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 3px;
  }

  .offers-carousel-track {
    gap: 1rem;
    justify-content: flex-start;
    padding: 0 0.5rem;
  }

  .offer-card {
    min-width: calc(100% - 1rem);
    max-width: 280px;
    flex-shrink: 0;
    scroll-snap-align: center;
  }

  .offer-media {
    height: 200px;
  }

  .offer-content {
    padding: 1rem;
  }

  .offer-title {
    font-size: 0.85rem;
    line-height: 1.2;
    min-height: 2.2rem;
  }

  .offer-prices {
    margin: 0.5rem 0 1rem 0;
  }

  .old-price {
    font-size: 0.75rem;
  }

  .new-price {
    font-size: 1rem;
  }

  .offer-btn {
    font-size: 0.85rem;
    padding: 0.5rem 0.4rem;
  }

  .flip-container {
    width: 50px;
    height: 50px;
  }

  .badge-descuento {
    font-size: 1rem;
  }

  .badge-off {
    font-size: 0.7rem;
  }
}

/* Móviles pequeños */
@media (max-width: 400px) {
  .offers-container {
    padding: 1rem 0.3rem;
  }

  .separator {
    padding: 0.3rem 0.5rem;
  }

  .separator h2 {
    font-size: 1rem;
    padding: 0 0.3rem;
  }

  .offer-card {
    min-width: calc(100% - 0.6rem);
    max-width: 280px;
    flex-shrink: 0;
  }

  .offer-media {
    height: 160px;
  }

  .offer-content {
    padding: 1rem;
  }

  .offer-title {
    font-size: 0.85rem;
    min-height: 2.2rem;
  }

  .new-price {
    font-size: 1rem;
  }

  .offer-btn {
    font-size: 0.9rem;
    padding: 0.7rem 1rem;
  }

  .icon-wrapper {
    width: 16px;
    height: 16px;
  }

  .flip-container {
    width: 45px;
    height: 45px;
  }
}

</style>
