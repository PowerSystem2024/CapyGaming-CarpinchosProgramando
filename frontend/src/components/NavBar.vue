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
      <div class="search" ref="buscador">
        <input type="text" placeholder="Buscar productos" v-model="searchText" @keyup.enter="irAResultados" />
        <button class="search-btn" @click="irAResultados">
       <img src="../assets/IconosNavBarFooter/search.svg" alt="Buscar" />
        </button>

        <!-- Sugerencias -->
        <ul v-if="mostrarSugerencias && sugerencias.length" class="sugerencias-list">
          <li
            v-for="(producto, index) in sugerencias"
            :key="index"
            @click="irADetalle(producto.id_producto)"
          >
            {{ producto.nombre }}
          </li>
        </ul>
      </div>
      
      <div class="cart-menu-mobile"> 
      <!-- Carrito móvil -->
      <div class="cart-mobile" v-if="windowWidth <= 900">
      <router-link to="/carrito" class="cart-btn cart-mobile">
        <img src="../assets/IconosNavBarFooter/cart-svgrepo-com (2).svg" />
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </router-link>
      </div>

      <!-- Botón hamburguesa -->
      <button class="menu-toggle" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" viewBox="0 0 20 20">
          <path fill="#FDEBD0" d="M16.4 9H3.6c-.552 0-.6.447-.6 1c0 .553.048 1 .6 1h12.8c.552 0 .6-.447.6-1c0-.553-.048-1-.6-1zm0 4H3.6c-.552 0-.6.447-.6 1c0 .553.048 1 .6 1h12.8c.552 0 .6-.447.6-1c0-.553-.048-1-.6-1zM3.6 7h12.8c.552 0 .6-.447.6-1c0-.553-.048-1-.6-1H3.6c-.552 0-.6.447-.6 1c0 .553.048 1 .6 1z"/>
        </svg>
      </button>
      </div>
      <!-- Opciones usuario -->
      <div class="user-options" >
        <button class="user-btn" @click="abrirAuthModal">
          <img src="../assets/IconosNavBarFooter/profile-svgrepo-com (1).svg" />
          Ingresar
        </button>

        <router-link to="/carrito" class="cart-btn">
          <img src="../assets/IconosNavBarFooter/cart-svgrepo-com (2).svg" />
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </router-link>
      </div>
    </div>
    
      <div class="search-mobile" v-if="windowWidth <= 900">
        <input type="text" placeholder="Buscar productos" v-model="searchText" @keyup.enter="irAResultados" />
        <button class="search-btn" @click="irAResultados">
          <img src="../assets/IconosNavBarFooter/search.svg" alt="Buscar" />
        </button>
      </div>

        <div class="linea"></div>
        <div class="sub-navbar" v-if="windowWidth > 900">
          <div class="menu-item">
            <Dropdown title="Categorias" :items="Categorias" />
          </div>
          <div class="menu-item"><router-link to="/categoria/notebooks">Notebooks</router-link></div>
          <div class="menu-item"><router-link to="/categoria/hardware/placas de video">Placas de Video</router-link></div>
          <div class="menu-item"><router-link to="/categoria/hardware/motherboard">Motherboards</router-link></div>
          <div class="menu-item"><router-link to="/categoria/hardware/procesadores">Procesadores</router-link></div>
          <div class="menu-item"><router-link to="/categoria/hardware/memorias ram">Memorias Ram</router-link></div>
        </div>

        <transition name="fade">
          <div v-if="menuAbierto" class="overlay" @click="toggleMenu"></div>
        </transition>

    <!-- Menú desplegable -->
    <transition name="slide-fade">
  <div v-if="menuAbierto" class="menu-responsive">
    <!-- Título del menú -->
    <h2 class="menu-title">Menú</h2>

    <!-- Sección usuario -->
    <div class="menu-section">
      <h3 class="section-title">Tu cuenta</h3>
        <button @click="abrirAuthModal" class="menu-link">
        <span class="menu-link-content">
        <img src="../assets/IconosNavBarFooter/profile-svgrepo-com (1).svg" />
        <span>Ingresar</span>
        </span>
      </button>
    </div>

    <!-- Línea divisoria -->
    <div class="linea"></div>

    <!-- Sección categorías -->
    <div class="menu-section">
      <h3 class="section-title">Categorías</h3>
      <div class="menu-item" v-for="(categoria, index) in Categorias" :key="index">
        <router-link :to="categoria.link" class="menu-link">
          {{ categoria.title }}
        </router-link>
      </div>
    </div>
  </div>
    </transition>
  </nav>
</template>

<script>
import { getCart } from "../utils/cartUtils"; //Importamos la funcion que devuelve los productos que hay en el carrito
import Dropdown from "./Dropdown.vue";
import debounce from 'lodash.debounce'; // Importa la función debounce de lodash

export default {
  name: "NavBar",
  components: {
    Dropdown
  },
  data() {
    return {
      menuAbierto: false,
      windowWidth: window.innerWidth, // Ancho de la ventana para manejar el responsive
      searchText: '',
      sugerencias: [], // 🔴 resultados de la búsqueda
      mostrarSugerencias: false,
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
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("cartUpdated", this.updateCartCount);
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
  },

  watch: {
    searchText: debounce(function (nuevoTexto) {
      this.buscarSugerencias(nuevoTexto);
    }, 400)
  },
  methods: {
    toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  },
  handleResize() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth > 900) {
      this.menuAbierto = false;
    }
  },
    buscarProducto() {
      console.log("Buscando:", this.searchText);
    },
    updateCartCount() {
      const cart = getCart();
      this.cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      //cart.value = cart;
    },
    async buscarSugerencias(texto) {
      if (texto.trim().length < 2) {
        this.sugerencias = [];
        return;
      }
      this.mostrarSugerencias = true;
      try {      
        const res = await fetch(`/api/productos/buscar?nombre=${encodeURIComponent(texto)}`);
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        const productos = await res.json();
        if (!Array.isArray(productos)) throw new Error('Respuesta no es un array');
        this.sugerencias = productos.slice(0, 5);
      } catch (error) {
        console.error('Error al buscar sugerencias:', error.message);
        this.sugerencias = [];
      }
    },
    irAResultados() {
      if (this.searchText.trim().length < 2) return;
      this.mostrarSugerencias = false; //ocultar sugerencias cuando se hace la búsqueda
      this.$router.push({ path: '/resultados', query: { q: this.searchText } });
    },
    handleClickOutside(event) {
    const buscador = this.$el.querySelector('.search');
    if (buscador && !buscador.contains(event.target)) {
      this.mostrarSugerencias = false;
    }
    },
    irADetalle(id) {
      this.mostrarSugerencias = false;
      this.searchText = '';
      this.$router.push({ path: `/productoDetalle/${id}` });
    },
    // MÉTODO: abrir AuthModal 
    abrirAuthModal() {
      this.$emit('abrirAuth');
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
  outline: none;
}

.sugerencias-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background: var(--color-card) !important;
  text-align: left;
  border: var(--color-border);
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.sugerencias-list li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;         /* No permite saltos de línea */
  overflow: hidden;            /* Oculta el texto que se pasa del ancho */
  text-overflow: ellipsis;     /* Agrega "..." al final si se corta */
  background: var(--color-card);
}

.sugerencias-list li:hover {
  background-color: var(--color-primary);
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

/* === 🔹 Modo responsive === */

/* 🔸 Botón hamburguesa */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}
.cart-menu-mobile{
  gap: 0.5rem;
  display: flex;
  padding-right: 1rem;
}
.menu-toggle svg {
  width: 32px;
  height: 32px;
  margin: 0rem;
  outline: none;
}

/* 🔸 Menú oculto por defecto */
.menu-responsive {
  display: none;
}

/* 📱 Mobile */
@media (max-width: 900px) {

  .navbar-content {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between; /* Espacio entre logo y botón */
    padding: 0.5rem 1rem;
    position: relative;
    z-index: 5;
    padding: 0.5rem;
  }

  /* Mostrar botón hamburguesa */
  .menu-toggle {
    display: block;
 
  }

  /* Ocultar cosas grandes en móvil */
  .search,
  .user-options {
    display: none;
  }

  /* Menú desplegable al hacer clic */
  .menu-responsive {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 200px; 
    background: var(--color-background);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
    padding: 1.5rem 1rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .menu-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-primary);
  text-align: center;
}

.menu-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-primary);
  padding-bottom: 0.3rem;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}
.menu-link-content {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: var(--color-text);

}
.menu-link-content:hover {
  color: var(--color-primary);
}

.menu-link-content img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.menu-link:hover {
  color: var(--color-primary);
}

.menu-link img {
  width: 20px;
  height: 20px;
}
.menu-responsive .sub-navbar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  background-color: transparent;
}
  .sub-navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .menu-item {
    margin: 0.3rem 0;
    background: transparent;
  }
    /* 🔹 Buscador móvil */
.search-mobile {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;

}
.search-mobile img{
  padding-top: 3px;
  max-height: 25px;
}

.search-mobile input {
  flex: 1;
  height: 40px;
  padding: 0 10px;
  font-size: 0.9rem;
  border: 1px solid var(--color-primary);
  outline:none;
  border-radius: 5px;
}

.search-mobile button {
  position: absolute;
  right: 20px;
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  padding: 5px;
  outline: none;
}
  .search-mobile {
    width: 100%;
    margin-top: 0.5rem;
  }
   .search-responsive {
    display: flex;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .search-responsive input {
    flex: 1;
    height: 40px;
    padding: 0 10px;
    font-size: 0.9rem;
  }

  .search-responsive button {
    width: 40px;
    height: 40px;
    padding: 5px;
  }
  
/* 🔹 Animación suave */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.cart-mobile {
    display: flex;
    align-items: center;
    margin-left: 5rem;
    position: relative;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

}


  @media (max-width: 400px) {
.cart-mobile {
    margin-left: 2.8rem;
}
  }

</style>