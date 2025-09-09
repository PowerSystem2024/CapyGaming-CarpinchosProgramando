<script setup>
  import NavBar from "./components/NavBar.vue";
  import footerPag from "./components/footerPag.vue";
</script>

<template>
    <NavBar />

  <div id="app">
    <nav>

      <Marcas />
      <Ofertas />
      <quienesSomos />


  <!-- Menú de navegación opcional -->
      <router-link to="/">Productos</router-link>
      <router-link to="/inicioSesion" class="inicio-link"></router-link>
      <router-link to="/registro">Registrarme</router-link>
      <router-link to="/recuperarContra">Recuperar contraseña</router-link>
      <router-link to="/quienesSomos" class="quienes-link"></router-link>
      <router-link to="/ofertas" class="ofertas-link"></router-link>
      <router-link to="/marcas" class="marcas-link"></router-link>
      <router-link to="/exploradorCategorias" class="exploradorCategorias-link"></router-link>
    </nav>

    <router-view />
  </div>

    <footerPag />

</template>

<script>
  import { getCartCount } from "./utils/cartUtils"; // ← AGREGAR IMPORT

  export default {
    name: "App",
    data() {
      return {
        cartCount: 0  // ← AGREGAR VARIABLE
      }
    },
    mounted() {
      // Cargar contador al iniciar
      this.updateCartCount();

      // Escuchar cambios en el carrito
      window.addEventListener('cartUpdated', this.updateCartCount);
    },
    methods: {
      updateCartCount() {
        this.cartCount = getCartCount();
      }
    }
  };
  </script>

<style>
  /* Estilos globales para toda la aplicación */
  @import url('./assets/styles/base.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: 'Roboto', sans-serif;
    min-height: 100vh;
  }

  #app {
    background-color: var(--color-background);
    min-height: 100vh;
  }

  nav {
    background-color: var(--color-accent);
    padding: 1rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  nav a {
    color: var(--color-primary);
    text-decoration: none;
    margin: 0 1rem;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s;
  }

  nav a:hover {
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
  }

  nav a.router-link-active {
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
  }

  
  </style>
