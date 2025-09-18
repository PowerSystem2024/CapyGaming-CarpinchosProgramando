<template>
  <div class="offers-container">
    <h2>Ofertas destacadas</h2>
    <div class="offers-grid">
      <div v-for="offer in offers" :key="offer.id" class="offer-card card">
        <!-- Bloque de imagen con altura mínima -->
        <div class="offer-media">
          <img :src="offer.image" :alt="offer.title" class="offer-image" />
        </div>

        <!-- Bloque de contenido textual -->
        <div class="offer-content">
          <h3 class="offer-title" :title="offer.title">{{ offer.title }}</h3>
          <p class="offer-description">{{ offer.description }}</p>
          <div class="offer-prices">
            <span class="old-price">{{ offer.oldPrice }}</span>
            <span class="new-price">{{ offer.newPrice }}</span>
          </div>
        </div>

        <!-- Botón al final -->
        <button class="offer-btn" @click="agregarAlCarrito(offer)">
          🛒 Agregar al carrito
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
          title: "Mouse Gamer Logitech G502",
          nombre: "Mouse Gamer Logitech G502",
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
          title: "Teclado Mecánico Redragon Kumara",
          nombre: "Teclado Mecánico Redragon Kumara",
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
          title: "Auriculares HyperX Cloud II",
          nombre: "Auriculares HyperX Cloud II",
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
          title: "Disco Solido SSD 256GB",
          nombre: "Disco Solido SSD 256GB",
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
          title: "Auriculares Logitech G733",
          nombre: "Auriculares Logitech G733",
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
          title: "Mouse Pad Logitech",
          nombre: "Mouse Pad Logitech",
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
          title: "Teclado Redragon K509 Dyaus",
          nombre: "Teclado Redragon K509 Dyaus",
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
          title: "Silla Gamer Noblechairs EPIC Cola Edition",
          nombre: "Silla Gamer Noblechairs EPIC Cola Edition",
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
    }
  }
};
</script>

<style scoped>
@import url(../assets/styles/base.css);
.offer-title {
    font-size: 1rem;
    font-weight: 700;
    margin-top: 0.5rem;
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

.offers-container {
  padding: 1.5rem;
  background: var(--color-card);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
}

h2 {
  color: var(--color-primary); /* Naranja destacado */
  margin-bottom: 1.5rem;
  margin-top: 6%;
  padding: 10px;
  border-radius: 10px;
}

.offers-grid {
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;
    background-color: var(--color-background);
    border-radius: 10px;
}

.offer-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-card);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.offer-media {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 160px;
  margin-bottom: 1rem;
  background: var(--color-card);
}

.offer-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem;
  background: var(--color-card);
}

.offer-card:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.233);
}

.offer-image {
  width: 100px;
  height: auto;
  max-height: 160px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  background-color: var(--color-card);
  align-self: center;
}

.offer-image:hover{
  transform: scale(1.4);
}

.offer-description {
  font-size: 0.9rem;
  color: var(--color-muted-foreground);
  margin: 0.5rem 0 1rem;
  background: var(--color-card);
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.offer-prices {
  margin-bottom: 1rem;
  background: var(--color-card);
}

.old-price {
  text-decoration: line-through;
  color: var(--color-foreground);
  margin-right: 0.5rem;
  background: var(--color-card);
}

.new-price {
  color: var(--color-secondary);
  font-weight: bold;
  font-size: 1.2rem;
  background: var(--color-card);
}

.offer-btn {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.offer-btn:hover {
    background-color: var(--sidebar-ring);
    color: var(--color-foreground);
    transform: scale(1.1);
}
</style>
