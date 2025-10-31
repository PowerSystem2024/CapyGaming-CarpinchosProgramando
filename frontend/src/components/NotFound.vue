<template>
  <div class="not-found">
    <!-- Imagen del carpincho -->
    <img src="../assets/IconosNavBarFooter/NotFoundLogo.png" alt="CapyGaming Carpincho" class="carpincho-img" />
    <p>Parece que esta página no existe</p>
    <router-link to="/" class="link">Volver al inicio</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  computed: {
    url() {
      // devuelve la ruta que escribió el usuario
      return this.$route.fullPath;
    }
  }
};
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.carpincho-img {
  width: 250px; /* ajustá al tamaño que quieras */
  height: auto;
  margin-bottom: 15px;
}

.not-found h1 {
  font-size: 6rem;
  color: #f39c12;
}

.not-found p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.link {
  color: var(--color-secondary);
  text-decoration: none; /* quita subrayado */
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-secondary);
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.link:hover {
  background-color: var(--color-secondary);
  color: var(--color-background); /* invertimos color al pasar mouse */
}

/* Media Queries para Responsive */

/* Pantallas grandes (desktops, 1200px en adelante) */
@media (min-width: 1200px) {
  .not-found {
    height: 85vh;
  }
  
  .carpincho-img {
    width: 300px;
    margin-bottom: 20px;
  }
  
  .not-found p {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .link {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
  }
}

/* Pantallas medianas (tablets, 768px a 1199px) */
@media (max-width: 1199px) and (min-width: 768px) {
  .not-found {
    height: 80vh;
    padding: 0 30px;
  }
  
  .carpincho-img {
    width: 280px;
    margin-bottom: 18px;
  }
  
  .not-found p {
    font-size: 1.3rem;
    margin-bottom: 1.3rem;
  }
  
  .link {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }
}

/* Pantallas pequeñas (móviles, hasta 767px) */
@media (max-width: 767px) {
  .not-found {
    height: 75vh;
    padding: 0 15px;
  }
  
  .carpincho-img {
    width: 200px;
    margin-bottom: 12px;
  }
  
  .not-found h1 {
    font-size: 4rem;
  }
  
  .not-found p {
    font-size: 1rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
  
  .link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    width: 80%;
    max-width: 200px;
  }
}

/* Pantallas muy pequeñas (móviles pequeños, hasta 480px) */
@media (max-width: 480px) {
  .not-found {
    height: 70vh;
    padding: 0 10px;
  }
  
  .carpincho-img {
    width: 150px;
    margin-bottom: 10px;
  }
  
  .not-found h1 {
    font-size: 3rem;
  }
  
  .not-found p {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }
  
  .link {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    width: 85%;
  }
}
</style>