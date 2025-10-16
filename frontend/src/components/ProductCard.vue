<!-- Es la “tarjeta individual” de un producto; se encarga solo de cómo se ve y se comporta un producto dentro del catálogo.-->
<template>
  <article class="product-card" @click="abrirDetalle(producto)">
    <!-- Sección de imagen del producto -->
    <div class="img-wrap">
      <img :src="imagen" :alt="producto.nombre" @error="onError" />
       <!-- Etiqueta visual que indica si hay stock o no -->
      <span class="badge" :class="badgeClass">{{ badgeText }}</span>
    </div>

    <div class="info">
      <h3 class="nombre">{{ producto.nombre }}</h3>
      <p class="marca" v-if="producto.marca">{{ producto.marca }}</p>
      <p class="precio">$ {{ producto.precio.toLocaleString() }}</p>
      <p class="stock" v-if="showStock">Stock: {{ producto.stock }}</p>
     
       <!-- Botón para agregar al carrito; se desactiva si no hay stock -->
      <button 
        class="btn-add" 
        :disabled="producto.stock <= 0" 
        @click.stop="$emit('agregar',{ ...producto, id: producto.id_producto})"
      >
      <!-- Íconos SVG para el carrito (normal y hover) -->
        <span class="icon-wrapper">
            <svg class="icon-cart default" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16">
            <path fill="#161e35" d="M14 13.1V12H4.6l.6-1.1l9.2-.9L16 4H3.7L3 1H0v1h2.2l2.1 8.4L3 13v1.5c0 .8.7 1.5 1.5 1.5S6 15.3 6 14.5S5.3 13 4.5 13H12v1.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.7-.4-1.2-1-1.4z"/>
            </svg>
            <svg class="icon-cart hover" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16">
            <path fill="currentColor" d="M14 13.1V12H4.6l.6-1.1l9.2-.9L16 4H3.7L3 1H0v1h2.2l2.1 8.4L3 13v1.5c0 .8.7 1.5 1.5 1.5S6 15.3 6 14.5S5.3 13 4.5 13H12v1.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.7-.4-1.2-1-1.4z"/>
            </svg>
        </span>
        <!-- Texto del botón según disponibilidad -->
        {{ producto.stock > 0 ? 'Agregar al carrito' : 'Sin stock' }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import fallbackImg from '../assets/IconosNavBarFooter/placeholder.png'; // crea un placeholder o ajusta ruta

const router = useRouter();

// Define las propiedades que recibe el componente
const props = defineProps({
  producto: { type: Object, required: true }, // Producto a mostrar
  showStock: { type: Boolean, default: true } // Si se debe mostrar el stock
});

// Computa la imagen principal del producto o usa el placeholder si no hay
const imagen = computed(() => {
  if (props.producto.imagenes && props.producto.imagenes.length) return props.producto.imagenes[0];
  return fallbackImg;
});

// Función que navega al detalle del producto al hacer clic en la tarjeta
const abrirDetalle = (prod) => {
    router.push({ name: 'ProductoDetalle', params: { id: prod.id_producto } });
};

// Texto de la etiqueta de stock
const badgeText = computed(() => (props.producto.stock > 0 ? 'En stock' : 'Sin stock'));
// Clase CSS para la etiqueta según disponibilidad
const badgeClass = computed(() => (props.producto.stock > 0 ? 'in-stock' : 'out-stock')); 

// Si la imagen falla al cargar, se reemplaza por el placeholder
const onError = (e) => {
  e.target.src = fallbackImg;
};
</script>

<style scoped>
@import url(../assets/styles/base.css);
.product-card { cursor: pointer; border: 1px solid var(--color-border); width: 260px; min-height: 440px; max-height: 440px; border-radius: 12px; box-shadow: var(--card-shadow); overflow: hidden; background: var(--color-card); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.3s ease, box-shadow 0.3s ease;}
.product-card:hover { transform: scale(1.01); box-shadow: 0 2px 10px #111920; }
.img-wrap { position: relative; min-height: 55%; display:flex; align-items:center; justify-content:center; background: var(--color-card)}
.img-wrap img { max-width:85%; max-height:85%; width: auto; height: auto; object-fit:contain; transition: transform 0.3s ease; }
.product-card:hover img { transform: scale(1.1);}
.badge { position:absolute; top:8px; left:8px; padding:4px 8px; border-radius:12px; font-weight:600; font-size:0.8rem; }
.badge.in-stock { background: var(--color-secondary); color: white; } /* celeste/verde */
.badge.out-stock { background:var(--color-destructive); color: white; }
.info { flex:1; display: flex; flex-direction: column; justify-content: space-between; padding: 10px; text-align:center; background: var(--color-card); }
.nombre { background-color: transparent; color: var(--color-primary); font-size:1rem; font-weight: 600;  line-clamp: 2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; margin:0 0 6px; }
.precio { background-color: transparent; color: var(--color-secondary); font-weight:700; margin:6px 0; font-size: 1.2rem; }
.marca, .stock { background-color: var(--color-card); color: #ffffff59; font-size: 0.8rem; color: #999; }
.btn-add { margin-top: auto; width:100%; padding:0.6rem 1rem; border:none; border-radius:8px; background:var(--color-primary); color:var(--color-background); cursor:pointer; transition: all 0.25s ease-in-out; font-weight: 600}
.btn-add:hover { background-color: var(--sidebar-ring); color: var(--color-foreground); }
.btn-add[disabled] { opacity:0.6; cursor:not-allowed; background:#999; }
.icon-wrapper {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  background: transparent;
}

.icon-cart {
  position: absolute;
  left: 0;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  transition: all 0.25s ease-in-out;
  margin-top: 3px;
  background: transparent;
}

.icon-cart.hover {
  opacity: 0;
}

.btn-add:hover .icon-cart.default {
  opacity: 0;
}

.btn-add:hover .icon-cart.hover {
  opacity: 1;
}
</style>
