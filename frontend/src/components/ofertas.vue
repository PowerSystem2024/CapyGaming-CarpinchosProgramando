<template>
  <div class="offers-container">
    <h2 class="section-title">OFERTAS DEL DÍA</h2>
    <div class="offers-grid">
      <div v-for="offer in ofertasConDescuento" :key="offer.id" class="offer-card card">
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

        <!-- Bloque de imagen con altura mínima -->
        <div class="offer-media">
          <img :src="offer.image" :alt="offer.title" class="offer-image" />
        </div>

        <!-- Bloque de contenido textual -->
        <div class="offer-content">
          <h3 class="offer-title" :title="offer.title">{{ offer.title }}</h3>
          <div class="offer-prices">
            <span class="old-price">{{ offer.oldPrice }}</span>
            <span class="new-price">{{ offer.newPrice }}</span>
          </div>
        </div>

        <!-- Botón al final -->
        <button class="offer-btn" @click="agregarAlCarrito(offer)">

          <span class="icon-wrapper">
            <svg class="icon-cart default" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16">
            <path fill="#161e35" d="M14 13.1V12H4.6l.6-1.1l9.2-.9L16 4H3.7L3 1H0v1h2.2l2.1 8.4L3 13v1.5c0 .8.7 1.5 1.5 1.5S6 15.3 6 14.5S5.3 13 4.5 13H12v1.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.7-.4-1.2-1-1.4z"/>
            </svg>
            <svg class="icon-cart hover" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16">
            <path fill="currentColor" d="M14 13.1V12H4.6l.6-1.1l9.2-.9L16 4H3.7L3 1H0v1h2.2l2.1 8.4L3 13v1.5c0 .8.7 1.5 1.5 1.5S6 15.3 6 14.5S5.3 13 4.5 13H12v1.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.7-.4-1.2-1-1.4z"/>
            </svg>
            </span>

          Agregar al carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import mouseLogitech from "../assets/imagenesOfertas/mouseLogitech.png";
import tecladoRedragon from "../assets/imagenesOfertas/tecladoRedragon.png";
import auricularesHyper from "../assets/imagenesOfertas/auricularesHyper.png";
import discoSSD from "../assets/imagenesOfertas/discoSolido.png";
import auricularesLogitech from "../assets/imagenesOfertas/auricularesLogitech.png";
import Pad from "../assets/imagenesOfertas/Pad.png";
import tecladoRedragon2 from "../assets/imagenesOfertas/tecladoRedragon2.png";
import sillaGamer from "../assets/imagenesOfertas/sillaGamer.png";
import { addToCart } from "../utils/cartUtils";
import { ultimoProducto, setUltimoProducto } from "../composables/ultimoProducto";

export default {
  name: "Ofertas",
  data() {
    return {
      // Lista de ofertas de ejemplo(luego puede venir de un backend)
      offers: [
        {
          id: 1,
          title: "Mouse Logitech G502 Hero 11 Botones Gamer Rgb",
          nombre: "Mouse Logitech G502 Hero 11 Botones Gamer Rgb",
          description: "Sensor HERO 25K, RGB LIGHTSYNC, 11 botones programables.",
          oldPrice: "$45.000",
          newPrice: "$35.000",
          precio: 35000,
          stock: 15,
          image: mouseLogitech,
          imagenes: [mouseLogitech],
        },
        {
          id: 2,
          title: "Teclado Redragon Kumara K552 Rainbow",
          nombre: "Teclado Redragon Kumara K552 Rainbow",
          description: "Switches Blue, retroiluminación RGB, compacto 87 teclas.",
          oldPrice: "$38.000",
          newPrice: "$28.500",
          precio: 28500,
          stock: 10,
          image: tecladoRedragon,
          imagenes: [tecladoRedragon],
        },
        {
          id: 3,
          title: "Auricular Hyperx Cloud Stinger 2 - Ps5 White",
          nombre: "Auricular Hyperx Cloud Stinger 2 - Ps5 White",
          description: "Sonido 7.1 Virtual Surround, micrófono desmontable.",
          oldPrice: "$60.000",
          newPrice: "$48.000",
          precio: 48000,
          stock: 8,
          image: auricularesHyper,
          imagenes: [auricularesHyper],
        },
        {
          id: 12,
          title: "SSD Teamgroup MP33 de 256GB",
          nombre: "SSD Teamgroup MP33 de 256GB",
          description: "Disco Solido SSD M.2 Team 256GB MP33 1600MB/s NVMe PCI-E Gen3 x4",
          oldPrice: "$55.000",
          newPrice: "$35.000",
          precio: 35000,
          stock: 12,
          image: discoSSD,
          imagenes: [discoSSD],
        },
        {
          id: 21,
          title: "Auriculares Inalámbricos Logitech G733 Lightspeed Rgb",
          nombre: "Auriculares Inalámbricos Logitech G733 Lightspeed Rgb",
          description:"Auriculares Logitech G733 Wireless Lightspeed LightSync RGB Blue 29Hs",
          oldPrice: "$300.300",
          newPrice: "$290.900",
          precio: 290900,
          stock: 5,
          image: auricularesLogitech,
          imagenes: [auricularesLogitech],
        },

        {
          id: 25,
          title: "Mouse Pad Logitech G Powerplay 2",
          nombre: "Mouse Pad Logitech G Powerplay 2",
          description: "Mouse Pad Logitech G Powerplay Carga Inalambrica 321x344mm",
          oldPrice: "$200.000",
          newPrice: "$175.000",
          precio: 175000,
          stock: 7,
          image: Pad,
          imagenes: [Pad],
        },
        {
          id: 27,
          title: "Teclado Redragon Dyaus 2 K509",
          nombre: "Teclado Redragon Dyaus 2 K509",
          description: "Teclado Redragon K509 Dyaus Español Retroiluminado 7 Colores",
          oldPrice: "$100.548",
          newPrice: "$89.900",
          precio: 89900,
          stock: 9,
          image: tecladoRedragon2,
          imagenes: [tecladoRedragon2],
        },
        {
          id: 47,
          title: "Silla Gamer Noblechairs EPIC Fallout Nuka Cola Edition",
          nombre: "Silla Gamer Noblechairs EPIC Fallout Nuka Cola Edition",
          description:"Silla Gamer Noblechairs EPIC Fallout Nuka Cola Edition (sin almohadones) (Peso MAX. 120kg)",
          oldPrice: "680.000",
          newPrice: "620.000",
          precio: 620000,
          stock: 3,
          image: sillaGamer,
          imagenes: [sillaGamer],
        },
      ]
    };
  },
  computed: {  // Calculando el porcentaje de descuento para el circulo flip
    ofertasConDescuento() {
    return this.offers.map(o => {
      const oldP = parseFloat(o.oldPrice.replace(/[^0-9.]/g, "")); // saca $ y comas
      const newP = parseFloat(o.newPrice.replace(/[^0-9.]/g, ""));
      const descuento = Math.round(((oldP - newP) / oldP) * 100);
      return { ...o, descuento };
    });
  }
  },
  methods: {
    agregarAlCarrito(oferta) {
      const resultado = addToCart(oferta);
      if (resultado.success) {
        console.log("Oferta agregada al carrito:", oferta);
        window.dispatchEvent(new Event("cartUpdated"));
        setUltimoProducto({...oferta, quantity : 1});
        window.dispatchEvent(new Event("abrirPreview"));
        console.log("Evento abrirPreview emitido");
        //mostrarCarrito.value = true;
      } else {
        console.log("Error al agregar oferta:", resultado.message);
      }
    },

  }
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

/* TITULO: OFERTAS DEL DIA */
h2 {
  color: var(--color-primary); /* Naranja destacado */
  padding: 5px;
  font-size: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--color-primary);
  margin: 0 12rem;  /* Margenes a losl ados de la linea */
  margin-top: 1rem;
  margin-bottom: 1rem;
  position: relative;
  gap: 1rem;
}

.section-title::before,
.section-title::after {
  content: "";
  flex: 1;
  height: 2px;
  background-color: var(--color-primary);
  opacity: 0.5;
}

/* PRODUCTOS EN OFERTA */
.offers-container {
  padding: 1.8rem;
}

.offers-grid {
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(5, 1fr); /* 👈 fuerza 5 columnas exactas */
    margin: 0 auto; /* 👈 centra el grid */
    padding: 0 12rem; /* 👈 espacio a los lados */
    gap: 0.5rem;
    width: 100%;
    background-color: var(--color-background);
    border-radius: 10px;
    align-items: stretch; /*fuerza que todas las columnas tengan la misma altura  */
}

.offer-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-card);
  position: relative;
  overflow: hidden;
  min-height: 440px;
  max-height: 440px;
  padding: 1rem;
}

.offer-card:hover {
  transform: scale(1.01);
  box-shadow: 0 2px 10px #111920;
}

.offer-media {
  display: flex;
  flex: 0 0 55%;
  justify-content: center;
  align-items: center;
  min-height: 55%;
  margin-bottom: 1rem;
  background: var(--color-card);
}

.offer-image {
  width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 1px 4px rgba(194, 36, 36, 0);
  align-self: center;
  transition: transform 0.3s ease;
}

.offer-card:hover .offer-image {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

.offer-content {
  flex: 1;
  max-height: 50%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--color-card);
}

.offer-title {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    color: var(--color-primary);
    background-color: var(--color-card);
    
    line-clamp: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.offer-prices {
  background: var(--color-card);
  display: flex;
  flex-direction: column;
}

.old-price {
  text-decoration: line-through;
  color: #ffffff59;
  background: var(--color-card);
  font-size: 0.9rem;
}

.new-price {
  color: var(--color-secondary);
  font-weight: 600;
  font-size: 21px;
  background: var(--color-card);
  margin-bottom: 5px;
}

.offer-btn {
  font-size: 1rem;
  font-weight: 600;
  margin-top: auto;
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.25s ease-in-out;
}

.offer-btn:hover {
    background-color: var(--sidebar-ring);
    color: var(--color-foreground);
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
  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    padding: 0 2rem;
    max-width: 100%;
  }
}

</style>
