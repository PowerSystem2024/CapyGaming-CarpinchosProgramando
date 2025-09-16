import { ref } from 'vue';
export const ultimoProducto = ref({});
export function setUltimoProducto(producto) {
  ultimoProducto.value = producto;
}
