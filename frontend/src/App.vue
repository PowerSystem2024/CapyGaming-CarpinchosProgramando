<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from "./components/NavBar.vue";
import FooterPag from "./components/FooterPag.vue";
import CarritoModalPreview from "./components/CarritoModalPreview.vue";
import AuthModal from "./components/AuthModal.vue"; // NUEVO IMPORT
import { getCartCount, getCart } from "./utils/cartUtils";
import { ultimoProducto } from "./composables/ultimoProducto";

// Estado reactivo
const cartCount = ref(0);
const mostrarCarrito = ref(false);
const mostrarAuthModal = ref(false); // NUEVO ESTADO
const carrito = ref([]);

// Función para actualizar el contador del carrito
function updateCartCount() {
  const cart = getCart();
  cartCount.value = cart.reduce((total, item) => total + item.quantity, 0);
  carrito.value = cart;
}

const router = useRouter();

// NUEVA FUNCIÓN: Abrir modal de autenticación
function openAuthModal() {
  mostrarAuthModal.value = true;
}

// NUEVA FUNCIÓN: Cuando el login/registro es exitoso
function onAuthSuccess() {
  // Puedes actualizar el estado del usuario aquí si necesitas
  console.log('Autenticación exitosa');
  updateCartCount(); // Por si el carrito necesita actualizarse
}

onMounted(() => {
  updateCartCount();
  window.addEventListener("cartUpdated", updateCartCount);
  window.addEventListener("abrirPreview", () => {
    mostrarCarrito.value = true;
  });

  // Cierra los modales al cambiar de ruta
  router.afterEach(() => {
    mostrarCarrito.value = false;
    mostrarAuthModal.value = false;
  });
});
</script>

<template>
  <!-- Barra de navegación -->
  <NavBar 
    :cart-count="cartCount" 
    @abrirPreview="mostrarCarrito = true"
    @abrirAuth="openAuthModal"
  />

  <!-- Renderizado de la ruta correspondiente -->
  <router-view 
    @abrirPreview="mostrarCarrito = true"
    @abrirAuth="openAuthModal" 
  />

  <!-- Modal del carrito -->
  <CarritoModalPreview
    :visible="mostrarCarrito"
    :carrito="carrito"
    :ultimoProducto="ultimoProducto"
    @close="mostrarCarrito = false"
  />

  <!-- NUEVO: Modal de autenticación -->
  <AuthModal
    :visible="mostrarAuthModal"
    @close="mostrarAuthModal = false"
    @success="onAuthSuccess"
  />

  <FooterPag />
</template>

<style>
@import url(./assets/styles/base.css);

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