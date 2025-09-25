<!-- ProductoDetalle.vue -->
<template>
  <div v-if="producto" class="producto-detalle">
    <img :src="producto.imagenes[0]" :alt="producto.nombre" />
    <h2>{{ producto.nombre }}</h2>
    <p>{{ producto.descripcion }}</p>
    <p>Precio: ${{ producto.precio.toLocaleString() }}</p>
    <button @click="$emit('agregar', producto)">Agregar al carrito</button>
  </div>

    <div v-else>
    <p>Cargando producto...</p>
  </div>
  
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const producto = ref(null);
const route = useRoute();

onMounted(async () => {
  const id = route.params.id; // id de la URL
  try {
    const res = await axios.get(`http://localhost:3001/api/productos/${id}`);
    producto.value = res.data;
  } catch (err) {
    console.error('No se pudo cargar el producto', err);
  }
});
</script>

<style scoped>
/* Estilos básicos, podés mejorar luego */
.producto-detalle img { max-width: 100%; }
</style>
