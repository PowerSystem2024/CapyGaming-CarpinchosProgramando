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
      <!-- Sección de envío -->
      <div class="envio-section">
        <h3>Opciones de envío:</h3>
        <div class="envio-options">
          <label class="envio-option">
            <input type="radio" v-model="envioSeleccionado" value="standard" />
            <span>Envío Estándar (5-7 días) - ${{ envioStandard }}</span>
          </label>
          <label class="envio-option">
            <input type="radio" v-model="envioSeleccionado" value="express" />
            <span>Envío Express (2-3 días) - ${{ envioExpress }}</span>
          </label>
          <label class="envio-option" v-if="total >= envioGratisMinimo">
            <input type="radio" v-model="envioSeleccionado" value="gratis" />
            <span>✨ Envío GRATIS (compras sobre ${{ envioGratisMinimo }})</span>
          </label>
        </div>
      </div>

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
        <button class="btn-comprar">Proceder al pago</button>
      </div>
    </div>
  </div>
</template>

<script>
// Importamos los productos desde el archivo de datos

import { getCart, removeFromCart, updateQuantity, getCartTotal, clearCart } from "../utils/cartUtils";

export default {
  name: "Carrito",
  data() {
    return {
      cartItems: [],
      total: 0,
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
  },
  methods: {
    loadCart() {
      this.cartItems = getCart();
      this.total = getCartTotal();
      
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
        alert("✅ Carrito vaciado correctamente");
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
    gap: 1rem;
    font-family: 'Poppins', sans-serif;
    padding: 2rem;
    background-color: var(--color-background) !important;
    color: var(--color-foreground);
    width: 100%;
    margin: 0 auto;
    min-height: calc(100vh - 100px);
  }
  
  /* No aplicar herencia de fondo a todos los elementos */

  .carrito-container h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
    padding: 20px;
    color: var(--color-primary) !important;
    background-color: var(--color-accent) !important;
    padding: 1rem;
    border-radius: 8px;
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    display: block;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    margin-top: 7%;
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

  .products-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    background-color: var(--color-background) !important;
    padding: 0;
    margin: 0;
  }
  
  .product-grid * {
      background-color: transparent;
  } 

   .product-card {
    display: flex;
    align-items: center;  
    gap: 20px;
    border-radius: 8px;
    padding: 1rem;
    background-color: var(--color-card) !important;
    color: var(--color-card-foreground);
    border: 1px solid var(--color-border);
    margin: 0;
    box-shadow: none !important;
    transition: none;
  }
  .product-card * {
    background-color: transparent !important;
  } 

  /* Sin efecto hover que levanta la tarjeta */
  .product-card:hover {
    /* Solo cambio sutil de borde */
    border-color: var(--color-primary);
  }

  .product-card img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 4px;
    flex-shrink: 0;
    background-color: transparent !important;
    border: none;
  }

  .product-info {
    flex: 1;
    background-color: transparent !important;
  }

  .product-info h3 {
    margin: 0 0 10px 0;
    font-size: 1rem;
    color: var(--color-primary);
   
  }

  .precio {
    font-weight: bold;
    color: var(--color-foreground);
    font-size: 1.2rem;
    margin: 0.5rem 0;
   
  }

  .cantidad-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 15px 0;
  }

  .btn-cantidad {
    width: 28px;
    height: 28px;
    border: 1px solid var(--color-border);
    background-color: var(--color-background) !important;
    color: var(--color-foreground) !important;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
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
    font-weight: bold;
    font-size: 1.1rem;
    min-width: 30px;
    text-align: center;
    color: var(--color-foreground);
  }

  .Subtotal {
    font-weight: bold;
    color: var(--color-secondary);
    font-size: 1.1rem;
    margin: 10px 0;
  }

  .btn-eliminar {
    background-color: var(--color-destructive) !important;
    color: var(--color-destructive-foreground) !important;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 5px;
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
    padding: 12px 24px;
    font-size: 1rem;
  }

  /* Sección del total */
  .total-carrito {
    width: 100%;
    max-width: 1200px;
    border-top: 2px solid var(--color-border);
    padding-top: 20px;
    background-color: var(--color-card) !important;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .total-carrito * {
    background-color: inherit;
  }

  .acciones-finales {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    padding-top: 20px;
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
    padding: 12px 30px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
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
    background-color: var(--color-accent) !important;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
    border: 1px solid var(--color-border);
  }

  .total-line {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    color: var(--color-foreground);
    font-size: 1rem;
    background-color: transparent !important;
  }
  
  .total-line span {
    background-color: transparent !important;
  }

  .total-line.total-final {
    border-top: 2px solid var(--color-primary);
    padding-top: 12px;
    margin-top: 8px;
    font-size: 1.3rem;
    font-weight: bold;
    color: var(--color-primary);
    background-color: transparent !important;
  }
  </style>