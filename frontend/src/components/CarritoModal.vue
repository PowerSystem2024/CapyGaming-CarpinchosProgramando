<template>
    <Modal :visible="visible" @close="$emit('close')">
    <h2>🛒 Tu carrito</h2>
    <div v-for="item in carrito" :key="item.id" class="producto">
        <p><strong>{{ item.nombre }}</strong></p>
        <p>Precio unitario: ${{ item.precio.toFixed(2) }}</p>
        <p>Cantidad: {{ item.quantity }}</p>
      <p>Total: ${{ (item.precio * item.quantity).toFixed(2) }}</p>
    </div>
    <hr />
    <p><strong>Total general: ${{ totalGeneral.toFixed(2) }}</strong></p>
    <p>6 cuotas sin interés: ${{ cuotaMensual.toFixed(2) }}</p>
    <button @click="finalizarCompra">Finalizar compra</button>
    </Modal>
</template>

<script setup>
import Modal from './Modal.vue';
defineProps({
    visible: Boolean,
    carrito: Array
});
const emit = defineEmits(['close']);

const totalGeneral = computed(() =>
  props.carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0)
);
const cuotaMensual = computed(() => totalGeneral.value / 6);

const finalizarCompra = () => {

    alert('Compra finalizada');
    emit('close');
};
</script>

<style scoped>
.producto {
    margin-bottom: 1rem;
}
</style>