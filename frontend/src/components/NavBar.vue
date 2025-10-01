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

          <router-link to="/carrito" class="cart-btn">
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
          <router-link to="/categoria/notebooks">Notebooks</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/categoria/hardware/placas de video">Placas de Video</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/categoria/hardware/motherboard">Motherboards</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/categoria/hardware/procesadores">Procesadores</router-link>
        </div>
        <div class="menu-item">
          <router-link to="/categoria/hardware/memorias ram">Memorias Ram</router-link>
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
            {title: 'Procesadores', link: '/categoria/hardware/procesadores'},
            {title: 'Placas de Video', link: '/categoria/hardware/placas de video'},
            {title: 'Motherboards', link:'/categoria/hardware/motherboard'},
            {title: 'Memorias Ram', link: '/categoria/hardware/memorias ram'},
            {title: 'Almacenamiento', link: '/categoria/hardware/almacenamiento'},
            {title: 'Refrigeración', link: '/categoria/hardware/refrigeracion'},
            {title: 'Gabinetes', link: '/categoria/hardware/gabinetes'},
            {title: 'Fuentes', link: '/categoria/hardware/fuentes'},
            {title: 'Energía', link: '/categoria/hardware/energia'},
            {title: 'Kits de Actualización', link: '/categoria/hardware/kit actualizacion'}
          ]
        },
        {
          title: 'Notebooks',
          link: '/categoria/notebooks'
        },
        {
          title: 'Monitores',
          link: '/categoria/monitores'
        },
        {
          title: 'Perifericos',
          link: '/categoria/perifericos',
          children:[
            {title: 'Teclados', link: '/categoria/perifericos/teclado'},
            {title: 'Mouse', link: '/categoria/perifericos/mouse'},
            {title: 'Auriculares', link:'/categoria/perifericos/auriculares'},
            {title: 'Micrófonos', link: '/categoria/perifericos/microfono'},
            {title: 'Webcams', link: '/categoria/perifericos/webcam'},
            {title: 'Joystick', link: '/categoria/perifericos/joystick'},
            {title: 'Volantes', link: '/categoria/perifericos/volante'},
            {title: 'Mousepad', link: '/categoria/perifericos/mouse pad'},
            {title: 'Stream Deck', link: '/categoria/perifericos/streamdeck'},
            {title: 'Parlantes', link: '/categoria/perifericos/parlante'},
            {title: 'Combos', link: '/categoria/perifericos/combo'}
          ]
        },
        {
          title: 'Conectividad',
          link: '/categoria/conectividad',
          children: [
            {title: 'Placas de Red', link: '/categoria/conectividad/placas de red'},
            {title: 'Adaptadores WiFi', link: '/categoria/conectividad/adaptador wifi'}
          ]
        },
        {
          title: 'Gaming',
          link: '/categoria/gaming',
          children: [
            {title: 'Consolas', link: '/categoria/gaming/consolas'},
            {title: 'Sillas Gamer', link: '/categoria/gaming/silla'}
          ]
        },
        {
          title: 'Impresoras',
          link: '/categoria/impresoras'
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