<template>
  <!-- Contenedor principal del componente -->
  <div class="brands-container"> 
    <!-- Título -->
    <h2>Marcas disponibles</h2>
    <ul class="brands-list">  
      <!-- 
        v-for: recorre el array "brands"
        muestra logo + nombre 
      -->
      <li v-for="brand in brands" :key="brand.name">
        <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
        <span>{{ brand.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Marcas",
  data() {
    return {
      // lista completa de marcas con logo importado
      brands: [
        { name: "Acer", logo: "/logos/acer.png" },
        //{ name: "Acer", logo: require("@/assets/logos/acer.png") },
        { name: "Asus", logo: "/logos/asus.png" },
        { name: "Lenovo", logo: "/logos/lenovo.png" },
        { name: "Logitech", logo: "/logos/logitech.png" },
        { name: "Team", logo: "/logos/team.png" },
        { name: "Kingston", logo: "/logos/kingston.png" },
        { name: "Western Digital WD", logo: "../assets/logos/wd.png" },
        { name: "Seagate", logo: "../assets/logos/seagate.png" },
       // { name: "Redragon", logo: require("@/assets/logos/redragon.png") },
       // { name: "SteelSeries", logo: require("@/assets/logos/steelseries.png") },
       // { name: "Glorious", logo: require("@/assets/logos/glorious.png") },
       // { name: "JBL", logo: require("@/assets/logos/jbl.png") },
       // { name: "Cougar", logo: require("@/assets/logos/cougar.png") },
       // { name: "Corsair", logo: require("@/assets/logos/corsair.png") },
        //{ name: "HYTE", logo: require("@/assets/logos/hyte.png") },
        //{ name: "Cooler Master", logo: require("@/assets/logos/coolermaster.png") },
        //{ name: "Noblechairs", logo: require("@/assets/logos/noblechairs.png") },
       // { name: "Vertagear", logo: require("@/assets/logos/vertagear.png") },
       // { name: "Razer", logo: require("@/assets/logos/razer.png") },
       // { name: "AMD Rayzen", logo: require("@/assets/logos/ryzen.png") },
       // { name: "Intel", logo: require("@/assets/logos/intel.png") },
       // { name: "Lyonn", logo: require("@/assets/logos/lyonn.png") },
       // { name: "LG", logo: require("@/assets/logos/lg.png") },
       // { name: "AsRock", logo: require("@/assets/logos/asrock.png") },
       // { name: "Samsung", logo: require("@/assets/logos/samsung.png") },
       // { name: "HP", logo: require("@/assets/logos/hp.png") },
       // { name: "Brother", logo: require("@/assets/logos/brother.png") },
       // { name: "Pantum", logo: require("@/assets/logos/pantum.png") },
       // { name: "Elgato", logo: require("@/assets/logos/elgato.png") },
       // { name: "ADATA/XPG", logo: require("@/assets/logos/xpg.png") },
       // { name: "Be Quiet!", logo: require("@/assets/logos/bequiet.png") },
       // { name: "Zotac", logo: require("@/assets/logos/zotac.png") },
       // { name: "Sony", logo: require("@/assets/logos/sony.png") },
       // { name: "TP-Link", logo: require("@/assets/logos/tplink.png") },
       // { name: "XYZ", logo: require("@/assets/logos/xyz.png") },
       // { name: "G.Skill", logo: require("@/assets/logos/gskill.png") },
       // { name: "Nintendo", logo: require("@/assets/logos/nintendo.png") },
      ]
    }
  }
}
</script>

<style scoped>
/* Estilos aplicados solo a este componente */
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
  gap: 1rem;  
  text-align: center;
}

.brands-list li {
  padding: 0.5rem;
  background: #111827; 
  border: 1px solid #374151; 
  border-radius: 8px; 
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.brands-list li:hover {
  background: #2563EB; 
  color: white; 
}

.brand-logo {
  width: 70px;
  height: auto;
  display: block;
  margin: 0 auto 0.5rem;
}
</style>
