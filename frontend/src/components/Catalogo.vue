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
import axios from 'axios';
import ProductCard from './ProductCard.vue';
import { addToCart } from '../utils/cartUtils';

const productos = ref([]);
const loading = ref(false);
const error = ref(null);

const load = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:3001/api/productos');
    console.log(res.data);
    productos.value = res.data;
  } catch (err) {
    error.value = 'No se pudieron cargar los productos';
    console.error(err);
  } finally { loading.value = false; }
};

onMounted(load);

const onAgregar = (prod) => {
  const result = addToCart(prod);
  if (result.success) {
    console.log('✅ Producto agregado al carrito:', prod.nombre);
  } else {
    console.warn('⚠️ Error:', result.message);
    alert(result.message);
  }
};
</script>

<style>
.grid { display:flex; flex-wrap:wrap; gap:16px; }
</style>