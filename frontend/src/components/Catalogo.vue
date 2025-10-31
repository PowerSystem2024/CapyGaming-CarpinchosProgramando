<!-- Este fue creado para ver si funcionaba desde la base de datos, hay que quitarlo de las rutas para que el
 usuario navegue solo por CatalogoCategoria.vue -->
<template>
  <div>
    <h1>Catálogo</h1>
    <div v-if="loading">Cargando...</div>
    <div v-if="error">{{ error }}</div>

    <div class="grid">
      <ProductCard 
        v-for="p in productos" 
        :key="p.id" 
        :producto="p" 
        @agregar="onAgregar"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../api/apiClient';
import ProductCard from './ProductCard.vue';

const productos = ref([]);
const loading = ref(false);
const error = ref(null);

const load = async () => {
  loading.value = true;
  try {
    const res = await apiClient.get('/api/productos');
    console.log(res.data);
    productos.value = res.data;
  } catch (err) {
    error.value = 'No se pudieron cargar los productos';
    console.error(err);
  } finally { loading.value = false; }
};

onMounted(load);

const onAgregar = (prod) => {
  // por ahora, solo un console.log; luego se integra carrito
  console.log('Agregar al carrito:', prod.id);
};
</script>

<style>
.grid { display:flex; flex-wrap:wrap; gap:16px; }
</style>
