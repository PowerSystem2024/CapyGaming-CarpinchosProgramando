<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <img src="../assets/IconosNavBarFooter/logoconletrasamarillo.png" alt="Logo" />
        </router-link>
      </div>

      <!-- Buscador -->
      <div class="search">
        <input type="text" placeholder="Buscar productos" v-model="searchText" />
        <button  class="search-btn" @click="buscarProducto">
          <img src="../assets/IconosNavBarFooter/search.svg" alt="Buscar"/>
        </button>
      </div>

      <!-- Opciones usuario -->
      <div class="user-options">
          <router-link to="/inicioSesion" class="user-btn">
            <img src="../assets/IconosNavBarFooter/profile-svgrepo-com (1).svg"/>
            Ingresar
          </router-link>

          <router-link to="carrito" class="cart-btn">
          <img src="../assets/IconosNavBarFooter/cart-svgrepo-com (2).svg"/>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
      </div>

    </div>
<div class="linea"></div>

      <!-- Sub menu -->
      <div class="sub-navbar">
        <div class="menu-item">
          <Dropdown title="Categorias" :items="Categorias" />
        </div>
        <div class="menu-item">
          <router-link to="/ofertas">Notebooks</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/ofertas">Placas de Video</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/ofertas">Motherboards</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/ofertas">Procesadores</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/ofertas">Memoria RAM</router-link>
        </div>
      </div>

  </nav>
</template>

<script>
import { getCart } from "../utils/cartUtils"; //Importamos la funcion que devuelve los productos que hay en el carrito
import Dropdown from "./Dropdown.vue";

export default {
  name: "NavBar",
  components: {
    Dropdown
  },
  data() {
    return {
      searchText: "",
      cartCount: 0, // 🔴 número de productos visible que se muestra en el carrito en el carrito
      Categorias: [
        {
          title: 'Hardware',
          link: '/categoria/hardware',
          children: [
            {title: 'Procesadores', link: '#'},
            {title: 'Placas de Video', link: '#'},
            {title: 'Motherboards', link:'#'},
            {title: 'Memorias Ram', link: '#'},
            {title: 'Discos Rígidos/SSD', link: '#'},
            {title: 'Refrigeración', link: '#'},
            {title: 'Gabinetes', link: '#'},
            {title: 'Fuentes', link: '#'},
            {title: 'Energía', link: '#'},
            {title: 'Kits de Actualización', link: '#'}
          ]
        },
        {
          title: 'Notebooks',
          link: '#'
        },
        {
          title: 'Monitores',
          link: '#'
        },
        {
          title: 'Perifericos',
          link: '#',
          children:[
            {title: 'Teclados', link: '#'},
            {title: 'Mouse', link: '#'},
            {title: 'Auriculares', link:'#'},
            {title: 'Micrófonos', link: '#'},
            {title: 'Webcams', link: '#'},
            {title: 'Joystick', link: '#'},
            {title: 'Volantes', link: '#'},
            {title: 'Mousepad', link: '#'},
            {title: 'Stream Deck', link: '#'},
            {title: 'Parlantes', link: '#'},
            {title: 'Combos', link: '#'}
          ]
        },
        {
          title: 'Conectividad',
          link: '#',
          children: [
            {title: 'Placas de Red', link: '#'},
            {title: 'Adaptadores WiFi', link: '#'}
          ]
        },
        {
          title: 'Gaming House',
          link: '#',
          children: [
            {title: 'Consolas', link: '#'},
            {title: 'Sillas Gamer', link: '#'}
          ]
        },
        {
          title: 'Impresoras',
          link: '#'
        }
    ],
    };
  },
  mounted() {
    this.updateCartCount(); // inicializa el número
    window.addEventListener("cartUpdated", this.updateCartCount); // escucha el evento "cartUpdated" Cada vez que alguien agrega/quita un producto, este evento dispara y automaticamente actualiza el numero del carrito.
  },
  beforeUnmount() {
    window.removeEventListener("cartUpdated", this.updateCartCount);
  },
  methods: {
    buscarProducto() {
      console.log("Buscando:", this.searchText);
    },
    updateCartCount() {
      const cart = getCart();
      this.cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      //cart.value = cart;
    }
  }
};

</script>

<style scoped>
@import url(../assets/styles/base.css);
.navbar {
  background-color: #161e35;
  padding: 15px 0;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo img {
  height: 50px;
}

.search {
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 20px;
  max-width: 500px;
}

.search input {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px 0 0 5px;
}

.search-btn {
  background-color: #fbbf24;
  border: none;
  padding: 10px 15px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.search-btn img {
  width: 20px;
  height: 20px;
}

.user-options {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-btn, .cart-btn {
  background-color: transparent;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  position: relative;
}

.user-btn img, .cart-btn img {
  width: 24px;
  height: 24px;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #fbbf24;
  color: #161e35;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}

.linea {
  border-bottom: 1px solid #fbbf24;
  margin-top: 15px;
}

.sub-navbar {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 10px 0;
  background-color: #161e35;
}

.menu-item a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.menu-item a:hover {
  color: #fbbf24;
}
</style>