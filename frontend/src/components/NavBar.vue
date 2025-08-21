<template>
  <nav class="navbar">
    <!-- Logo -->
    <div class="logo">
      <img src="../assets/logo.png" alt="Logo" />
      <h1>CapyGaming</h1>
    </div>

    <!-- Buscador -->
    <div class="search">
      <input type="text" placeholder="Buscar productos" v-model="searchText" />
      <button @click="buscarProducto">
        🔍
      </button>
    </div>

    <!-- Opciones usuario -->
    <div class="user-options">
      <button @click="login">
        👤 Ingresá
      </button>
      <button @click="verCarrito">
        🛒
      </button>
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
.navbar {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #000000;
  box-sizing: border-box;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  width: 10px;
  gap: 0.5rem;
}

.logo img{
    width: 85px;
    height: auto;
    background: rgba(0, 0, 0, 0);
}

.search {
  display: flex;
  align-items: center;
}

.search input {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #070505;
}

.search button {
  margin-left: 0.5rem;
  cursor: pointer;
}

.user-options button {
  margin-left: 1rem;
  background: rgb(182, 65, 65);
  border: none;
  color: rgb(0, 0, 0);
  cursor: pointer;
}
</style>
