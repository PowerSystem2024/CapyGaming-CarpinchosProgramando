<script setup>
import carrito from "./components/carrito.vue";
import Productos from "./components/productos.vue";
</script>

<template>
  <div id="app">
    <nav>

  <!-- Menú de navegación opcional -->
      <router-link to="/">Productos</router-link>
      <router-link to="/carrito">Carrito</router-link>
    </nav>
    <router-view></router-view> 

  </div>
</template>

<script>
export default {
  name: "App",
  };
</script>

<style scoped>
</style>