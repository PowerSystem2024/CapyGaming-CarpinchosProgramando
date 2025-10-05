<template>
  <div>
    <h2>Resultados para "{{ $route.query.q }}"</h2>
    <p v-if="productos.length === 0">No se encontraron productos para "{{ $route.query.q }}"</p>
    <div class="grid">
      <ProductCard v-for="p in productos" :key="p.id_producto" :producto="p" />
    </div>
  </div>
</template>

<script>
import ProductCard from '../components/ProductCard.vue';


export default {
  components: { ProductCard },
  data() {
    return {
      productos: []
    };
  },
  async mounted() {
    const q = this.$route.query.q;
    if (!q) return;

    try {
      const res = await fetch(`/api/productos/buscar?nombre=${encodeURIComponent(q)}`);
      this.productos = await res.json();
    } catch (error) {
      console.error('Error al cargar resultados:', error);
    }
  },
  watch: {
  '$route.query.q': {
    immediate: true,
    handler(nuevaBusqueda) {
      if (!nuevaBusqueda) return;

      fetch(`/api/productos/buscar?nombre=${encodeURIComponent(nuevaBusqueda)}`)
        .then(res => res.json())
        .then(data => {
          this.productos = Array.isArray(data) ? data : [];
        })
        .catch(err => {
          console.error('Error al cargar resultados:', err);
          this.productos = [];
        });
    }
  }
}

};
</script>
