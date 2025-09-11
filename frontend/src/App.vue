<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from "./components/NavBar.vue";
import footerPag from "./components/footerPag.vue";
import CarritoModalPreview from "./components/CarritoModalPreview.vue";
import { getCartCount, getCart } from "./utils/cartUtils";

// Estado reactivo
const cartCount = ref(0);
const mostrarCarrito = ref(false);
const carrito = ref([]);

// Función para actualizar el contador y el contenido del carrito
function updateCartCount() {
  const cart = getCart();
  cartCount.value = cart.reduce((total, item) => total + item.quantity, 0);
  carrito.value = cart;
}

const router = useRouter();

onMounted(() => {
  updateCartCount();
  window.addEventListener("cartUpdated", updateCartCount);
  window.addEventListener("abrirPreview", () => {
    mostrarCarrito.value = true;
  });

  // Cierra el modal al cambiar de ruta
  router.afterEach(() => {
    mostrarCarrito.value = false;
  });
});
</script>

<template>
  <NavBar :cart-count="cartCount" @abrirPreview="mostrarCarrito = true" />

  <router-view /> <!-- Aquí se renderiza la vista actual -->

  <CarritoModalPreview
    :visible="mostrarCarrito"
    :carrito="carrito"
    @close="mostrarCarrito = false"
  />

  <footerPag />
</template>

<style>
@import url('./assets/styles/base.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
}

#app {
  background-color: var(--color-background);
  min-height: 100vh;
}
</style>