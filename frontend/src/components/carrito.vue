<template>
  <div class="carrito-container">
    <h1>Carrito de Compras</h1>
    <div class="products-grid">
      <div v-for="product in cartItems" :key="product.id" class="product-card">
        <p>Cantidad: {{ product.quantity }} </p>
        <p>Subtotal: ${{ product.quantity * product.precio }}</p>
        <button @click="removeItem(product.id)">Eliminar</button>
        total: ${{ total }}
        <h2>{{ product.nombre }}</h2>
        <p>Price: ${{ product.precio }}</p>
        <img :src="product.imagenes[0]" :alt="product.nombre" width="150" height="150" />
      </div>
    </div>
  </div>
</template>

<script>
// Importamos los productos desde el archivo de datos
import { getCart , removeFromCart, updateQuantity,getCartTotal } from "../utils/cartUtils";
export default {
  name: "Carrito",
  data(){
    return{
      cartItems:[],
      total :0 
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