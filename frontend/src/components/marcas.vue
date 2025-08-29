<template>
    <!-- Contenedor principal del componente -->
  <div class="brands-container"> 
    <!-- Título -->
    <h2>Marcas disponibles</h2>
    <ul class="brands-list">  <!-- Lista de marcas -->
        <!-- 
        v-for: recorre el array "brands"-->
      <li v-for="brand in brands" :key="brand">{{ brand }}</li> <!--:key="brand": clave única para cada ítem-->
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
/* Estilos aplicados solo a este componente ,por el scoped */
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
  list-style: none;  /* quita los puntos de la lista */
  padding: 0;
  display: grid;  /* muestra los items en rejilla */
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  /* columnas automáticas que se adaptan al ancho */
  gap: 0.5rem;  /* separación entre items */
}

.brands-list li {
  padding: 0.5rem 1rem;
  background: #111827; /* gris muy oscuro */
  border: 1px solid #374151; /* borde gris */
  border-radius: 8px; /* esquinas redondeadas */
  cursor: pointer; /* cursor de mano */
  text-align: center; /* texto centrado */
  transition: background 0.3s, color 0.3s;  /* animación suave al hover */
}

.brands-list li:hover {
  background: #2563EB; /* azul al pasar el mouse */
  color: white;  /* texto blanco al pasar el mouse */
}
</style>
