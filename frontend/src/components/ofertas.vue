<template>
  <div class="offers-container">
    <h2>Ofertas destacadas</h2>
    <div class="offers-grid">
      <!-- Iteramos la lista de ofertas -->
      <div v-for="offer in offers" :key="offer.id" class="offer-card">
        <img :src="offer.image" :alt="offer.title" class="offer-image" />
        <h3>{{ offer.title }}</h3>
        <p class="offer-description">{{ offer.description }}</p>
        <div class="offer-prices">
          <span class="old-price">{{ offer.oldPrice }}</span>
          <span class="new-price">{{ offer.newPrice }}</span>
        </div>
        <button class="offer-btn" @click="agregarAlCarrito(offer)">🛒 Agregar al carrito</button>
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
        setUltimoProducto(oferta);
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
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.offer-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.offer-card:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.233);
}

.offer-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.offer-description {
  font-size: 0.9rem;
  color: var(--color-muted-foreground);
  margin: 0.5rem 0 1rem;
}

.offer-prices {
  margin-bottom: 1rem;
}

.old-price {
  text-decoration: line-through;
  color: var(--color-muted-foreground);
  margin-right: 0.5rem;
}

.new-price {
  color: var(--color-secondary); /* Celeste destacado */
  font-weight: bold;
}

.offer-btn {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.offer-btn:hover {
  background: var(--color-secondary); /* Cambia a celeste */
}
</style>
