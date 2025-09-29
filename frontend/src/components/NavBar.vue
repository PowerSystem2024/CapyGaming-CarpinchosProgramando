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
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  min-height: auto;
  background: var(--color-background);
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  z-index: 1000; /*Para que el navbar siempre este por arriba de los elementos */
}

.navbar-content {
  display: flex;
  background: var(--color-background);
  justify-content: space-between;
  align-items: center;
  max-width: 1250px; /* 👈 limita el ancho */
  margin: 0 auto;    /* 👈 lo centra */
  height: 100%;
  padding-bottom: 5px;
}


.logo {
  display: flex;
  align-items: center;
  width: auto;
  max-height: 100%;
  gap: 0.5rem;
  background: none;
  padding-top: 0.5rem;
}

.logo img{
    max-height: 80px;
    background: none;
}

.logo a:hover {
  background: none;  /* evita el fondo en hover */
  color: inherit;    /* mantiene el color */
}


.search {
  position: relative;
  display: flex;
  align-items: center;
}

.search img{
  padding-top: 3px;
  max-height: 25px;
}

.search input {
  width: 550px;
  height: 45px;
  padding-left: 10px;
  padding-right: 40px;
  border-radius: 5px;
  border: 1.9px solid var(--color-primary);
  background-color: none;
  outline: none;
  font-size: 0.9rem;
}

.search button {
  position: absolute;
  right: 5px;
  margin-left: 0.5rem;
  cursor: pointer;
  background-color: #00103100;
  border: rgba(245, 245, 220, 0);
}

.user-options {
  display: flex;         /* pone los botones en fila */
  align-items: center;   /* centra verticalmente */
  gap: 1rem;             /* espacio entre “Ingresá” y carrito */
}

.user-options .user-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 1rem;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  background-color: var(--color-primary);
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  text-decoration: none; /* 👈 saca subrayado */
  transition: background 0.2s ease, transform 0.1s ease;
}

.cart-btn{
  position: relative;
  background-color: rgba(0, 0, 0, 0);
}

.user-btn{
  background-color: var(--color-primary);
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
}

.user-options button {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 1rem;
  border: none;
  color: rgb(255, 255, 255);
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  transition: background 0.2s ease, transform 0.1s ease;
}

.cart-btn img{
  max-height: 28px;
}

.cart-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: var(--color-destructive);
  color: white;
  font-size: 10px;
  font-weight: bold;
  border-radius: 50%;
  padding: 2px 6px;
}

.user-btn img{
  max-height: 28px;
}

.sub-navbar .router-link-exact-active {
  color: var(--color-primary);                 /* letras en naranja */
  border-bottom: 3px solid var(--color-primary); /* línea en naranja */
}

.linea {
  border-top: 1px solid var(--color-card);
  margin: 0px auto;
  width: 100%;
}

.logo a,
.logo a:hover,
.logo a:focus{
  background-color: rgba(245, 245, 220, 0);
}
.user-options .user-btn.router-link-active,
.user-options .user-btn.router-link-exact-active {
  background-color: var(--color-primary) !important;
  color: white !important;
}

/* Estilos para subnavbar */
/* Sub-navbar */
.sub-navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  gap: 0.1rem;
}

.sub-navbar .menu-item {
  margin: 0 1rem;
}

.sub-navbar a {
  color: var(--color-foreground);
  text-decoration: none;
  padding-bottom: 3px;
  border-bottom: 3px solid transparent; /* base invisible */
  transition: color 0.3s, border-bottom-color 0.3s;
}

.sub-navbar a:hover {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.sub-navbar a.router-link-exact-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.menu-item {
  color: var(--color-foreground);
  font-size: 1rem;
  padding: 5px 15px;
  padding-bottom: 0;
  position: relative;
  text-align: center;

  display: flex;
  border-bottom: transparent;
  transition: color 0.3s, border-bottom-color 0.3s;

}

.menu-item.active,
.menu-item:hover {
  color: var(--color-primary);
  background-color: none;
  border-bottom-color: var(--color-primary) ;
}
</style>

