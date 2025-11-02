<template>
  <div class="carrito-container">
    <!-- Modal de Checkout -->
    <CheckoutForm :isOpen="showCheckout" @close="showCheckout = false" />
    <h1>Carrito de Compras</h1>
    <div v-if="cartItems.length === 0" class="carrito-vacio">
      <p>El carrito está vacío</p>
        <router-link to="/">Ir a comprar</router-link>
    </div>

    <div v-else class="products-wrapper">
      <div class="products-grid">
        <div v-for="product in cartItems" :key="product.id" class="product-card">
          <img :src="product.imagenes[0]" :alt="product.nombre" width="100" />
          <div class="product-info">
            <h3 @click="irADetalle(product.id)" class="producto-titulo-link">{{ product.nombre }}</h3>
            <p class="precio">Precio: ${{ product.precio }}</p>

            <div class="cantidad-controls">
              <button @click="decrementQuantity(product)" class="btn-cantidad" :disabled="product.quantity <= 1">-</button>
                <span class="cantidad">{{ product.quantity }}</span>
              <button @click="incrementQuantity(product)" class="btn-cantidad" :disabled="product.quantity >= product.stock">+</button>
            </div>

            <p class="Subtotal">Subtotal: ${{ product.precio * product.quantity }}</p>
            <button @click="removeItem(product.id)" class="btn-eliminar">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Solo mostrar la sección de totales si hay productos -->
    <div class="total-carrito" v-if="cartItems.length > 0">

      <!-- Resumen de totales -->
      <div class="resumen-totales">
        <div class="total-line">
          <span>Subtotal:</span>
          <span>${{ total }}</span>
        </div>
        <div class="total-line">
          <span>Envío:</span>
          <span>${{ costoEnvio }}</span>
        </div>
        <div class="total-line total-final">
          <span>TOTAL:</span>
          <span>${{ totalConEnvio }}</span>
        </div>
      </div>
      
      <div class="acciones-finales">
        <button @click="emptyCart" class="btn-eliminar btn-vaciar">
          🗑️ Vaciar carrito
        </button>
        <button @click="abrirCheckout" class="btn-comprar">Proceder al pago</button>
      </div>
    </div>
  </div>
</template>

<script>
// Importamos los productos desde el archivo de datos

import { getCart, removeFromCart, updateQuantity, getCartTotal, clearCart } from "../utils/cartUtils";
import CheckoutForm from "./CheckoutForm.vue";

export default {
  name: "Carrito",
  components: {
    CheckoutForm
  },
  data() {
    return {
      cartItems: [],
      total: 0,
      showCheckout: false, 
      // Configuración de envío
      envioSeleccionado: 'standard',
      envioStandard: 5000,
      envioExpress: 10000,
      envioGratisMinimo: 100000
    }
  },
  computed: {
    costoEnvio() {
      if (this.cartItems.length === 0) return 0;

      switch(this.envioSeleccionado) {
        case 'gratis':
          return 0;
        case 'express':
          return this.envioExpress;
        case 'standard':
        default:
          return this.envioStandard;
      }
    },
    totalConEnvio() {
      return this.total + this.costoEnvio;
    }
  },
  mounted() {
    this.loadCart();
    window.addEventListener('cartUpdated', this.loadCart);
    console.log(getCartTotal());
  },
  methods: {
    loadCart() {
      this.cartItems = getCart();
      this.total = getCartTotal();
      console.log("🛒 CART - Cart items loaded:", this.cartItems);
      console.log("🛒 CART - Total items count:", this.cartItems.reduce((sum, item) => sum + item.quantity, 0));
      console.log("🛒 CART - getCartTotal():", this.total);
      console.log("🛒 CART - Manual calculation:", this.cartItems.reduce((total, item) => total + item.precio * item.quantity, 0));

      // Auto-seleccionar envío gratis si califica
      if (this.total >= this.envioGratisMinimo) {
        this.envioSeleccionado = 'gratis';
      }
    },
    removeItem(productId) {
      removeFromCart(productId);
      this.loadCart();
    },
    changeQuantity(productId, newQuantity) {
      updateQuantity(productId, newQuantity);
      this.loadCart();
    },
    incrementQuantity(product) {
      this.changeQuantity(product.id, product.quantity + 1);
    },
    decrementQuantity(product) {
        console.log("Método decrementQuantity llamado");
        if (product.quantity > 1) {
          this.changeQuantity(product.id, product.quantity - 1);
        } else {
          const confirmar = window.confirm("¿Eliminar " + product.nombre + " del carrito?");
          if (confirmar === true) {
            this.removeItem(product.id);
        }
      }
    },
    emptyCart() {
      if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
        clearCart();
        this.loadCart();
        console.log("Carrito vaciado correctamente");
      }
    },
    irADetalle(productId) {
      this.$router.push(`/productoDetalle/${productId}`);
},
    abrirCheckout() {
      if (this.cartItems.length > 0) {
        this.showCheckout = true;
      } else {
        alert("El carrito está vacío. Agrega productos antes de proceder al pago.");
      }
    }
  }
};
</script>

<style scoped>
  @import url(../assets/styles/base.css);

  .carrito-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.75rem;
    font-family: 'Poppins', sans-serif;
    padding: 2.5rem 0 1.5rem 0;
    background-color: var(--color-background) !important;
    color: var(--color-foreground);
    width: 100%;
    margin: 0 auto;
    min-height: calc(100vh - 135px);
    box-sizing: border-box;
  }
  
  /* No aplicar herencia de fondo a todos los elementos */

  .carrito-container h1 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
    padding: 1rem 1.5rem;
    color: var(--color-primary) !important;
    background-color: var(--color-accent) !important;
    border-radius: 8px;
    width: calc(100% - 2rem);
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    display: block;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    margin-top: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.3;
  }

  .carrito-vacio {
    text-align: center;
    padding: 50px;
    background-color: var(--color-card) !important;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .carrito-vacio * {
    background-color: transparent !important;
  }

  .carrito-vacio p {
    color: var(--color-foreground) !important;
    font-size: 1.2rem;
    margin-bottom: 20px;
    background-color: transparent !important;
  }

  .carrito-vacio a {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 0.5rem;
    background-color: var(--color-primary) !important;
    color: var(--color-primary-foreground) !important;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    display: inline-block;
  }

  .carrito-vacio a:hover {
    background-color: var(--sidebar-ring) !important;
    color: var(--color-foreground) !important;
    transform: scale(1.1);
  }

  .products-wrapper {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  /* El contenido dentro del wrapper tiene este ancho efectivo */

  .products-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    background-color: var(--color-background) !important;
    padding: 0;
    margin: 0;
  }
  
  .product-grid * {
    background-color: transparent;
  }

  .product-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    background-color: var(--color-card) !important;
    color: var(--color-card-foreground);
    border: 1px solid var(--color-border);
    margin: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease;
    max-width: 100%;
  }
  .product-card * {
    background-color: transparent !important;
  }

  .product-card:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.2) !important;
  }

  .product-card img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
    flex-shrink: 0;
    background-color: var(--color-background) !important;
    border: 1px solid var(--color-border);
    padding: 0.5rem;
    margin: 0;
  }

  .product-info {
    flex: 1;
    background-color: transparent !important;
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-template-rows: auto auto;
    align-items: center;
    gap: 0.75rem 1.5rem;
    text-align: left;
  }

  .product-info h3 {
    margin: 0;
    font-size: 1rem;
    color: var(--color-primary);
    font-weight: 600;
    line-height: 1.3;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .producto-titulo-link {
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .producto-titulo-link:hover {
    color: var(--sidebar-ring);
  }

  .precio {
    font-weight: 600;
    color: var(--color-foreground);
    font-size: 0.9rem;
    margin: 0;
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  .cantidad-controls {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    margin: 0;
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  .btn-cantidad {
    width: 32px;
    height: 32px;
    border: 2px solid var(--color-border);
    background-color: var(--color-background) !important;
    color: var(--color-foreground) !important;
    border-radius: 6px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-cantidad:hover:not(:disabled) {
    background-color: var(--color-primary) !important;
    color: var(--color-primary-foreground) !important;
    border-color: var(--color-primary);
  }

  .btn-cantidad:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-muted) !important;
    color: var(--color-muted-foreground) !important;
  }

  .cantidad {
    font-weight: 700;
    font-size: 1.2rem;
    min-width: 35px;
    text-align: center;
    color: var(--color-foreground);
  }

  .Subtotal {
    font-weight: 600;
    color: var(--color-primary);
    font-size: 0.95rem;
    margin: 0;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    text-align: right;
  }

  .btn-eliminar {
    background-color: var(--color-destructive) !important;
    color: var(--color-destructive-foreground) !important;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 0;
    grid-column: 3 / 4;
    grid-row: 1 / 3;
  }

  .btn-eliminar:hover {
    opacity: 0.9;
    transform: scale(1.05);
    background-color: var(--color-destructive) !important;
  }
  
  /* Botón eliminar más pequeño en las tarjetas de producto */
  .product-card .btn-eliminar {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
  
  /* Modificador para el botón vaciar en acciones finales */
  .acciones-finales .btn-eliminar.btn-vaciar {
    padding: 0.6rem 1.5rem;
    font-size: 0.95rem;
  }

  /* Sección del total - debe coincidir exactamente con products-wrapper */
  .total-carrito {
    width: 100%;
    max-width: 900px;
    border-top: 2px solid var(--color-border);
    background-color: var(--color-card) !important;
    padding: 1rem;
    margin: 1rem auto 0 auto;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-sizing: border-box;
  }
  
  .total-carrito * {
    background-color: inherit;
  }

  .acciones-finales {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
    background-color: transparent !important;
  }
  
  .acciones-finales button {
    flex: 0 0 auto;
  }

  .total-carrito h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: var(--color-primary);
    text-align: right;
  }

  .btn-comprar {
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
    border: none;
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
    align-self: flex-end;
  }

  .btn-comprar:hover {
    background-color: var(--sidebar-ring);
    color: var(--color-foreground);
    transform: scale(1.1);
  }

  /* Estilos para sección de envío */
  .envio-section {
    background-color: var(--color-accent) !important;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
    border: 1px solid var(--color-border);
  }

  .envio-section h3 {
    color: var(--color-primary);
    margin-bottom: 10px;
    font-size: 1.1rem;
    background-color: transparent !important;
  }

  .envio-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: transparent !important;
  }

  .envio-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background-color: var(--color-background) !important;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid var(--color-border);
  }

  .envio-option:hover {
    background-color: var(--color-card) !important;
    border-color: var(--color-primary);
  }

  .envio-option input[type="radio"] {
    cursor: pointer;
    background-color: transparent;
  }

  .envio-option span {
    color: var(--color-foreground);
    background-color: transparent !important;
  }

  /* Resumen de totales */
  .resumen-totales {
    background-color: transparent !important;
    padding: 0.5rem 0;
    border-radius: 0;
    margin: 0;
    border: none;
  }

  .total-line {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0;
    color: var(--color-foreground);
    font-size: 0.95rem;
    background-color: transparent !important;
  }
  
  .total-line span {
    background-color: transparent !important;
  }

  .total-line.total-final {
    border-top: 2px solid var(--color-primary);
    padding-top: 0.6rem;
    margin-top: 0.4rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--color-primary);
    background-color: transparent !important;
  }

  /* ===== RESPONSIVE DESIGN ===== */

  /* Tablets y pantallas medianas (768px - 1199px) */
  @media (max-width: 1199px) {
    .carrito-container {
      padding: 2rem 1.5rem 1.5rem 1.5rem;
    }

    .carrito-container h1 {
      font-size: 1.6rem;
      padding: 0.8rem 1.2rem;
      width: calc(100% - 2rem);
    }

    .product-card {
      padding: 0.9rem;
      gap: 0.9rem;
    }

    .product-card img {
      width: 100px;
      height: 100px;
    }

    .product-info h3 {
      font-size: 0.95rem;
    }

    .precio {
      font-size: 1.1rem;
    }

    .btn-comprar {
      padding: 10px 25px;
      font-size: 1rem;
    }
  }

  /* Tablets pequeñas (600px - 767px) */
  @media (max-width: 767px) {
    .carrito-container {
      padding: 1.75rem 1rem 1rem 1rem;
      gap: 0.8rem;
    }

    .carrito-container h1 {
      font-size: 1.4rem;
      padding: 0.7rem 1rem;
      width: calc(100% - 1.5rem);
    }

    .product-card {
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
      align-items: flex-start;
    }

    .product-card img {
      width: 100%;
      max-width: 200px;
      height: auto;
      align-self: center;
    }

    .product-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .product-info h3 {
      font-size: 1rem;
      text-align: center;
      grid-column: unset;
      grid-row: unset;
    }

    .precio {
      font-size: 0.95rem;
      text-align: center;
      grid-column: unset;
      grid-row: unset;
    }

    .cantidad-controls {
      justify-content: center;
      grid-column: unset;
      grid-row: unset;
    }

    .Subtotal {
      text-align: center;
      grid-column: unset;
      grid-row: unset;
    }

    .btn-eliminar {
      align-self: center;
      grid-column: unset;
      grid-row: unset;
    }

    .carrito-vacio {
      padding: 30px;
      max-width: 500px;
    }

    .carrito-vacio p {
      font-size: 1.1rem;
    }

    .carrito-vacio a {
      font-size: 0.9rem;
      padding: 0.5rem 0.9rem;
    }

    .total-carrito {
      padding: 15px;
    }

    .acciones-finales {
      flex-direction: column;
      gap: 15px;
    }

    .acciones-finales .btn-eliminar.btn-vaciar,
    .acciones-finales .btn-comprar {
      width: 100%;
      justify-content: center;
    }

    .btn-comprar {
      padding: 12px 20px;
      font-size: 1rem;
    }
  }

  /* Móviles (480px - 599px) */
  @media (max-width: 599px) {
    .carrito-container {
      padding: 1.5rem 0.8rem 0.8rem 0.8rem;
      gap: 0.6rem;
    }

    .carrito-container h1 {
      font-size: 1.2rem;
      padding: 0.6rem 0.8rem;
      width: calc(100% - 1rem);
    }

    .product-card {
      padding: 0.8rem;
      gap: 0.8rem;
    }

    .product-card img {
      width: 85px;
      height: 85px;
    }

    .product-info h3 {
      font-size: 0.85rem;
    }

    .precio {
      font-size: 1rem;
    }

    .carrito-vacio {
      padding: 25px;
      max-width: 400px;
    }

    .carrito-vacio p {
      font-size: 1rem;
    }

    .carrito-vacio a {
      font-size: 0.85rem;
      padding: 0.4rem 0.8rem;
    }

    .cantidad-controls {
      gap: 10px;
    }

    .btn-cantidad {
      width: 25px;
      height: 25px;
      font-size: 14px;
    }

    .cantidad {
      font-size: 0.95rem;
    }

    .Subtotal {
      font-size: 0.95rem;
    }

    .btn-eliminar {
      font-size: 0.8rem;
      padding: 6px 12px;
    }

    .total-carrito {
      padding: 12px;
    }

    .resumen-totales {
      padding: 12px;
    }

    .total-line {
      font-size: 0.9rem;
    }

    .total-line.total-final {
      font-size: 1.1rem;
    }

    .btn-comprar {
      padding: 10px 18px;
      font-size: 0.9rem;
    }
  }

  /* Móviles pequeños (hasta 479px) */
  @media (max-width: 479px) {
    .carrito-container {
      padding: 1.2rem 0.5rem 0.5rem 0.5rem;
      gap: 0.5rem;
    }

    .carrito-container h1 {
      font-size: 1.1rem;
      padding: 0.5rem 0.7rem;
      width: calc(100% - 0.5rem);
    }

    .carrito-vacio {
      padding: 20px;
      max-width: 350px;
    }

    .carrito-vacio p {
      font-size: 0.9rem;
    }

    .carrito-vacio a {
      font-size: 0.8rem;
      padding: 0.3rem 0.7rem;
    }

    .product-card {
      padding: 0.6rem;
      gap: 0.6rem;
    }

    .product-card img {
      width: 70px;
      height: 70px;
    }

    .product-info h3 {
      font-size: 0.8rem;
    }

    .precio {
      font-size: 0.9rem;
    }

    .cantidad-controls {
      gap: 8px;
    }

    .btn-cantidad {
      width: 22px;
      height: 22px;
      font-size: 12px;
    }

    .cantidad {
      font-size: 0.85rem;
    }

    .Subtotal {
      font-size: 0.85rem;
    }

    .product-card .btn-eliminar {
      padding: 6px 10px;
      font-size: 0.75rem;
    }

    .total-carrito {
      padding: 10px;
    }

    .resumen-totales {
      padding: 10px;
    }

    .total-line {
      font-size: 0.85rem;
    }

    .total-line.total-final {
      font-size: 1rem;
    }

    .acciones-finales .btn-eliminar.btn-vaciar {
      padding: 10px 20px;
      font-size: 0.9rem;
    }

    .btn-comprar {
      padding: 8px 16px;
      font-size: 0.85rem;
    }
  }

  /* Ajustes para pantallas muy grandes (más de 1600px) */
  @media (min-width: 1600px) {
    .carrito-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .products-wrapper {
      max-width: 900px;
    }

    .products-grid {
      max-width: 100%;
    }

    .total-carrito {
      max-width: 900px;
    }
  }

  /* Mejoras de accesibilidad para botones en móviles */
  @media (max-width: 767px) {
    .btn-cantidad,
    .btn-eliminar,
    .btn-comprar {
      min-height: 44px;
      min-width: 44px;
    }

    .product-card .btn-eliminar {
      min-height: 40px;
    }
  }
</style>