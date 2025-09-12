<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-content">
        <slot />
        <button @click="close" class="close-btn">Cerrar</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    visible: Boolean
});
const emit = defineEmits(['close']);
const close = () => emit('close');
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000;
}
.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    min-width: 300px;
    max-width: 600px;
}
.close-btn {
    margin-top: 1rem;
}
</style>