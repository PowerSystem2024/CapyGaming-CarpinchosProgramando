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

</style>
