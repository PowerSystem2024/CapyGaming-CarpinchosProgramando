<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <div class="logo">
        <img src="../assets/logoconletrasamarillo.png" alt="Logo" />
      </div>

      <!-- Buscador -->
      <div class="search">
        <input type="text" placeholder="Buscar productos" v-model="searchText" />
        <button  class="search-btn" @click="buscarProducto">
          <img src="../assets/search.svg" alt="Buscar"/>
        </button>
      </div>

      <!-- Opciones usuario -->
      <div class="user-options">
        <button class="user-btn" @click="login">
          <img src="../assets/profile-svgrepo-com (1).svg"/>
          Ingresar</button>
        <button class="cart-btn" @click="verCarrito">
          <img src="../assets/cart-svgrepo-com (2).svg"/>
        </button>
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



</style>

