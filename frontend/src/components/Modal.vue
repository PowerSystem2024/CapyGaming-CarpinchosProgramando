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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
    box-sizing: border-box;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    min-width: 300px;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
}

.close-btn {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
    width: 100%;
}

.close-btn:hover {
    background: #4338ca;
    transform: translateY(-1px);
}

.close-btn:active {
    transform: translateY(0);
}

/* Responsive para pantallas grandes (desktop) */
@media (min-width: 1200px) {
    .modal-content {
        max-width: 650px;
        padding: 2.5rem;
    }
}

/* Responsive para pantallas medianas (tabletas) */
@media (max-width: 1199px) and (min-width: 768px) {
    .modal-content {
        max-width: 550px;
        padding: 2rem;
    }
    
    .close-btn {
        padding: 0.7rem 1.4rem;
        font-size: 0.95rem;
    }
}

/* Responsive para pantallas pequeñas (móviles) */
@media (max-width: 767px) {
    .modal-overlay {
        padding: 0.5rem;
        align-items: flex-start;
        padding-top: 2rem;
    }
    
    .modal-content {
        max-width: 100%;
        min-width: unset;
        padding: 1.5rem;
        border-radius: 10px;
        max-height: 85vh;
    }
    
    .close-btn {
        margin-top: 1.25rem;
        padding: 0.6rem 1.2rem;
        font-size: 0.9rem;
    }
}

/* Para pantallas muy pequeñas (móviles pequeños) */
@media (max-width: 480px) {
    .modal-overlay {
        padding: 0.25rem;
        padding-top: 1.5rem;
    }
    
    .modal-content {
        padding: 1.25rem;
        border-radius: 8px;
    }
    
    .close-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
    }
}

/* Para dispositivos con alturas muy pequeñas */
@media (max-height: 500px) {
    .modal-overlay {
        align-items: flex-start;
        padding-top: 1rem;
    }
    
    .modal-content {
        max-height: 95vh;
    }
}
</style>