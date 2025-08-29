<template>
  <div class="brands-container">
    <h2>Marcas disponibles</h2>
    <ul class="brands-list">
      <li v-for="brand in brands" :key="brand">{{ brand }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Marcas",
  data() {
    return {
      // lista completa de marcas 
      brands: [
        "Acer", "Asus", "Lenovo", "Logitech", "Team", "Kingston", "Western Digital WD",
        "Seagate", "Redragon", "SteelSeries", "Glorious", "JBL", "Cougar", "Corsair",
        "HYTE", "Cooler Master", "Noblechairs", "Vertagear", "Razer", "AMD Rayzen",
        "Intel", "Lyonn", "LG", "AsRock", "Samsung", "HP", "Brother", "Pantum", "Elgato",
        "ADATA/XPG", "Be Quiet!", "Zotac", "Sony", "TP-Link", "XYZ", "G.Skill", "Nintendo"
      ]
    }
  }
}
</script>

<style scoped>
.brands-container {
  padding: 1rem;
  background: #1F2937; /* gris oscuro gamer */
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

h2 {
  color: #60A5FA; /* celeste gamer */
  margin-bottom: 1rem;
}

.brands-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
}

.brands-list li {
  padding: 0.5rem 1rem;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s, color 0.3s;
}

.brands-list li:hover {
  background: #2563EB; /* azul al pasar */
  color: white;
}
</style>
