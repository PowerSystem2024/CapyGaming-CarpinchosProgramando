<script setup>
import Productos from "./components/productos.vue";
import Marcas from "./components/marcas.vue";
import ofertas from "./components/ofertas.vue";
</script>

<template>
  <div id="app">
    <h1>Bienvenido a Capy Gaming</h1>
    
    <!-- Componente de marcas -->
    <Marcas />

    <!-- Componente de productos -->
    <Productos />
  </div>
</template>

<style scoped>
#app {
  padding: 2rem;
  background-color: #111827;
  color: #F9FAFB;
  font-family: 'Arial', sans-serif;
}
</style>
