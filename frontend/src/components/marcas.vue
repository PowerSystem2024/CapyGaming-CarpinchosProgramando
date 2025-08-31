
<template>
  <div class="brands-carousel">
    <div class="brands-track">
      <!-- Logos originales -->
      <div class="brand-item" v-for="brand in brands" :key="brand.name">
        <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
      </div>
      <!-- Logos duplicados para efecto infinito -->
      <div class="brand-item" v-for="brand in brands" :key="brand.name + '-clone'">
        <img :src="brand.logo" :alt="brand.name" class="brand-logo" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Marcas",
  data() {
    return {
      brands: [
        { name: "Acer", logo: "/logos/acer.png" },
        { name: "Asus", logo: "/logos/asus.png" },
        { name: "Lenovo", logo: "/logos/lenovo.png" },
        { name: "Logitech", logo: "/logos/logitech.png" },
        { name: "Team", logo: "/logos/team.png" },
        { name: "Kingston", logo: "/logos/kingston.png" },
        { name: "WD", logo: "/logos/western-digital.png" },
        { name: "Seagate", logo: "/logos/seagate.png" },
        { name: "Redragon", logo: "/logos/redragon.png" },
        { name: "SteelSeries", logo: "/logos/steelseries.png" },
        { name: "Glorious", logo: "/logos/glorious.png" },
        { name: "JBL", logo: "/logos/jbl.png" },
        { name: "Cougar", logo: "/logos/cougar.png" },
        { name: "Corsair", logo: "/logos/corsair.png" },
        { name: "HYTE", logo: "/logos/hyte.png" },
        { name: "Cooler Master", logo: "/logos/cooler-master.png" },
        { name: "Noblechairs", logo: "/logos/noblechairs.png" },
        { name: "Vertagear", logo: "/logos/vertagear.png" },
        { name: "Razer", logo: "/logos/razer.png" },
        { name: "AMD Ryzen", logo: "/logos/amd-ryzen.png" },
        { name: "Intel", logo: "/logos/intel.png" },
        { name: "LG", logo: "/logos/lg.png" },
        { name: "Samsung", logo: "/logos/samsung.png" },
        { name: "HP", logo: "/logos/hp.png" },
        { name: "Sony", logo: "/logos/sony.png" },
        { name: "TP-Link", logo: "/logos/tp-link.png" },
        { name: "Nintendo", logo: "/logos/nintendo.png" },
      ]
    };
  }
};
</script>

<style scoped>
.brands-carousel {
  background: var(--color-primary, #facc15); /* amarillo por defecto */
  overflow: hidden;
  border-radius: 8px;
  padding: 1rem 0;
  position: relative;
}

.brands-track {
  display: flex;
  gap: 2rem;
  width: max-content;
  animation: scroll 25s linear infinite;
}

.brand-item {
  flex: 0 0 auto;
  width: 120px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.brand-item:hover {
  transform: scale(1.1);
}

.brand-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
