<template>
  <div class="carrito-container">
    <h1>Carrito de Compras</h1>
    <div v-if="cartItems.length === 0" class="carrito-vacio">
      <p>El carrito está vacío</p>
      <router-link to="/">Ir a comprar</router-link>
    </div>

    <div v-else>
      <div class="products-grid">
        <div v-for="product in cartItems" :key="product.id" class="product-card">
          <img :src="product.imagenes[0]" :alt="product.nombre" width="100" />
          <div class="product-info">
            <h3>{{ product.nombre }}</h3>
            <p class="precio">Precio: ${{ product.precio }}</p>
            
            <p>Cantidad: {{ product.quantity }}</p>
            <p>Subtotal: ${{ product.quantity * product.precio }}</p>
      
            <div class="cantidad-controls">
              <button @click="decrementQuantity(product)" class="btn-cantidad">-</button>
              <span class="cantidad">{{ product.quantity }}</span>
              <button @click="incrementQuantity(product)" class="btn-cantidad">+</button>
            </div>

            <p class="Subtotal">Subtotal: ${{ product.precio * product.quantity }}</p>
            <button @click="removeItem(product.id)" class="btn-eliminar">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="total-carrito">
      <h2>Total: ${{ total }}</h2>
      <button class="btn-comprar">Proceder al pago</button>
    </div>
  </div>
</template>

<script>
// Importamos los productos desde el archivo de datos
import { defineSSRCustomElement } from "vue";
import { getCart, removeFromCart, updateQuantity, getCartTotal } from "../utils/cartUtils";

export default {
  name: "Carrito",
  data() {
    return {
      cartItems: [],
      total: 0 
    }
  },
  mounted() {
    this.loadCart();
    window.addEventListener('cartUpdated', this.loadCart);
  },
  methods: {
    loadCart() {
      this.cartItems = getCart();
      this.total = getCartTotal();
    },
    removeItem(productId) {
      removeFromCart(productId);
      this.loadCart();
    },
    changeQuantity(productId, newQuantity) {
      updateQuantity(productId, newQuantity);
      this.loadCart();
    }
  }
};
</script>

<style scoped>
.carrito-container {
  padding: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.product-card img {
  object-fit: cover;
  border-radius: 4px;
}
</style>