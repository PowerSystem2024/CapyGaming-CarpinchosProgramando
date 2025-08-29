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
        <button class="offer-btn">Comprar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Ofertas",
  data() {
    return {
      // Lista de ofertas de ejemplo(luego puede venir de un backend)
      offers: [
        {
          id: 1,
          title: "Mouse Gamer Logitech G502",
          description: "Sensor HERO 25K, RGB LIGHTSYNC, 11 botones programables.",
          oldPrice: "$45.000",
          newPrice: "$35.000",
          image: "https://via.placeholder.com/200x150.png?text=Mouse+Logitech"
        },
        {
          id: 2,
          title: "Teclado Mecánico Redragon Kumara",
          description: "Switches Blue, retroiluminación RGB, compacto 87 teclas.",
          oldPrice: "$38.000",
          newPrice: "$28.500",
          image: "https://via.placeholder.com/200x150.png?text=Teclado+Redragon"
        },
        {
          id: 3,
          title: "Auriculares HyperX Cloud II",
          description: "Sonido 7.1 Virtual Surround, micrófono desmontable.",
          oldPrice: "$60.000",
          newPrice: "$48.000",
          image: "https://via.placeholder.com/200x150.png?text=Auriculares+HyperX"
        }
      ]
    };
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
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.8);
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
