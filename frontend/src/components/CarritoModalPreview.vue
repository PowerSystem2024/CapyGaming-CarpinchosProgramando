<template>
    <div v-if="visible" class="modal-overlay" @click.self="cerrar">
        <div class="modal-content">
        <h2>🛒 Tu carrito</h2>
        <div v-for="item in carrito" :key="item.id" class="item">
            <img :src="item.image" alt="Producto" class="item-img" />
            <div class="item-info">
            <p><strong>{{ item.nombre }}</strong></p>
            <p>Cantidad: {{ item.cantidad }}</p>
            <p>Precio unitario: ${{ item.precio.toFixed(2) }}</p>
            <p>Total: ${{ (item.precio * item.quantity).toFixed(2) }}</p>
            </div>
        </div><br>
        <hr /><br></br>
        <p><strong>Total: ${{ totalGeneral.toFixed(2) }}</strong></p>
        <p>6 cuotas sin interés: ${{ cuotaMensual.toFixed(2) }}</p>
        <button @click="cerrar">Cerrar</button>
        </div>
    </div>
    </template>

    <script setup>
        import { computed } from 'vue';

        // Recibimos las props del padre (App.vue)
            const props = defineProps({
            visible: Boolean,
            carrito: Array
            });

        // Emitimos el evento 'close' cuando el usuario cierra el modal
        const emit = defineEmits(['close']);

        // Calculamos el total general del carrito
        const totalGeneral = computed(() =>
        props.carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0)
        );

        // Calculamos el valor de las 6 cuotas sin interés
        const cuotaMensual = computed(() => totalGeneral.value / 6);

        // Función para cerrar el modal
        const cerrar = () => emit('close');
    </script>
    
    <style scoped>
    @import url(../assets//styles/base.css);

    .modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000;
    }

    .modal-content {
    background-color: var(--color-border) ;
    padding: 2rem;
    border-radius: 10px;
    max-width: 600px;
    width: 90%;
    color: var(--chart-1);
    }

    .item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    }

    .item-img {
    width: 35%;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    }
    .item-info p {
    margin: 0.2rem 0;
    text-align: right;
    flex: 1;
    }

    h2, .item, .item-info, strong,  p{
        background-color: var(--color-border) ;
    }
    h2{
        color: var(--sidebar-primary);
    }
</style>