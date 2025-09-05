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
         </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      searchText: "" // lo que el usuario escribe en el buscador
    }
  },
  methods: {
    buscarProducto() {
      console.log("Buscando:", this.searchText);
    },
    login() {
      console.log("Ir a login");
    },
    verCarrito() {
      console.log("Abrir carrito");
    }
  }
}
</script>

<style scoped>
@import url(../assets/styles/base.css);

.navbar {
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  height: 88px;
  background: var(--color-background);
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1250px; /* 👈 limita el ancho */
  margin: 0 auto;    /* 👈 lo centra */
  height: 100%;
}


.logo {
  display: flex;
  align-items: center;
  width: auto;
  max-height: 100%;
  gap: 0.5rem;
}

.logo img{
    max-height: 78px;
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
  width: 450px;
  height: 40px;
  padding-left: 10px;
  padding-right: 40px;
  border-radius: 5px;
  border: 1.9px solid var(--color-primary);
  background-color: #00103100;
  outline: none;
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
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  text-decoration: none; /* 👈 saca subrayado */
  transition: background 0.2s ease, transform 0.1s ease;
}

.cart-btn{
  background-color: rgba(0, 0, 0, 0);
}

.user-btn{
  background-color: var(--color-primary);
  font-family: 'Roboto', sans-serif;
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

.user-btn img{
  max-height: 28px;
}

/* Elimina cualquier estilo que Vue Router agregue */
.router-link-active,
.router-link-exact-active {
  background: none !important;
  color: inherit !important;
}

.user-options .user-btn.router-link-active,
.user-options .user-btn.router-link-exact-active {
  background-color: var(--color-primary) !important;
  color: white !important;
}


</style>

