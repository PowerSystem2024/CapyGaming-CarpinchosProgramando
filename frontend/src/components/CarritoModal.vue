<template>
    <Modal :visible="visible" @close="$emit('close')">
        <div class="carrito-modal-container">
            <h2 class="modal-title">🛒 Tu carrito</h2>
            
            <div v-if="carrito.length === 0" class="carrito-vacio">
                <p>Tu carrito está vacío</p>
                <button @click="$emit('close')" class="btn-seguir-comprando">Seguir comprando</button>
            </div>

            <div v-else>
                <div class="productos-lista">
                    <div v-for="item in carrito" :key="item.id" class="producto-item">
                        <div class="producto-info">
                            <p class="producto-nombre"><strong>{{ item.nombre }}</strong></p>
                            <div class="producto-detalles">
                                <span class="precio-unitario">Precio unitario: ${{ item.precio.toFixed(2) }}</span>
                                <span class="cantidad">Cantidad: {{ item.quantity }}</span>
                                <span class="total-item">Total: ${{ (item.precio * item.quantity).toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <hr class="separador" />
                
                <div class="resumen-compra">
                    <div class="total-line">
                        <span>Total general:</span>
                        <span class="total-general">${{ totalGeneral.toFixed(2) }}</span>
                    </div>
                    <div class="cuotas-info">
                        <span>6 cuotas sin interés:</span>
                        <span class="cuota-mensual">${{ cuotaMensual.toFixed(2) }}</span>
                    </div>
                </div>

                <div class="acciones-modal">
                    <button @click="seguirComprando" class="btn-seguir-comprando">
                        Seguir comprando
                    </button>
                    <button @click="finalizarCompra" class="btn-finalizar-compra">
                        Finalizar compra
                    </button>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script setup>
import Modal from './Modal.vue';
import { computed } from 'vue';

const props = defineProps({
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

const seguirComprando = () => {
    emit('close');
};
</script>

<style scoped>
.carrito-modal-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    color: var(--color-primary);
    margin: 0;
    padding: 0.5rem 0;
}

.carrito-vacio {
    text-align: center;
    padding: 2rem;
    background-color: var(--color-card);
    border-radius: 8px;
    border: 1px solid var(--color-border);
}

.carrito-vacio p {
    font-size: 1.1rem;
    color: var(--color-muted-foreground);
    margin-bottom: 1.5rem;
}

.productos-lista {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 300px;
    overflow-y: auto;
    padding: 0.5rem;
}

.producto-item {
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;
}

.producto-item:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.producto-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.producto-nombre {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-foreground);
    margin: 0;
    line-height: 1.3;
}

.producto-detalles {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.precio-unitario,
.cantidad,
.total-item {
    font-size: 0.9rem;
    color: var(--color-muted-foreground);
}

.total-item {
    font-weight: 600;
    color: var(--color-primary);
}

.separador {
    border: none;
    border-top: 2px solid var(--color-border);
    margin: 0.5rem 0;
}

.resumen-compra {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    background-color: var(--color-accent);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--color-border);
}

.total-line,
.cuotas-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
}

.total-general {
    font-size: 1.3rem;
    font-weight: bold;
    color: var(--color-primary);
}

.cuota-mensual {
    font-weight: 600;
    color: var(--color-secondary);
}

.acciones-modal {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.btn-seguir-comprando,
.btn-finalizar-compra {
    flex: 1;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    min-height: 44px;
}

.btn-seguir-comprando {
    background-color: var(--color-muted);
    color: var(--color-muted-foreground);
    border: 1px solid var(--color-border);
}

.btn-seguir-comprando:hover {
    background-color: var(--color-accent);
    color: var(--color-foreground);
}

.btn-finalizar-compra {
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
}

.btn-finalizar-compra:hover {
    background-color: var(--color-secondary);
    transform: scale(1.05);
}

/* ===== RESPONSIVE DESIGN ===== */

/* Pantallas grandes (1200px+) - Ya está optimizado */

/* Tablets y pantallas medianas (768px - 1199px) */
@media (max-width: 1199px) {
    .carrito-modal-container {
        gap: 1.2rem;
    }

    .modal-title {
        font-size: 1.4rem;
    }

    .producto-item {
        padding: 0.8rem;
    }

    .producto-nombre {
        font-size: 0.95rem;
    }

    .precio-unitario,
    .cantidad,
    .total-item {
        font-size: 0.85rem;
    }

    .total-line,
    .cuotas-info {
        font-size: 0.95rem;
    }

    .total-general {
        font-size: 1.2rem;
    }

    .btn-seguir-comprando,
    .btn-finalizar-compra {
        padding: 0.7rem 1.2rem;
        font-size: 0.95rem;
    }
}

/* Tablets pequeñas (600px - 767px) */
@media (max-width: 767px) {
    .carrito-modal-container {
        gap: 1rem;
        padding: 0.5rem;
    }

    .modal-title {
        font-size: 1.3rem;
        padding: 0.3rem 0;
    }

    .carrito-vacio {
        padding: 1.5rem;
    }

    .carrito-vacio p {
        font-size: 1rem;
    }

    .productos-lista {
        max-height: 250px;
        gap: 0.8rem;
    }

    .producto-item {
        padding: 0.7rem;
    }

    .producto-info {
        gap: 0.4rem;
    }

    .producto-nombre {
        font-size: 0.9rem;
    }

    .producto-detalles {
        gap: 0.2rem;
    }

    .precio-unitario,
    .cantidad,
    .total-item {
        font-size: 0.8rem;
    }

    .resumen-compra {
        padding: 0.8rem;
        gap: 0.6rem;
    }

    .total-line,
    .cuotas-info {
        font-size: 0.9rem;
    }

    .total-general {
        font-size: 1.1rem;
    }

    .acciones-modal {
        flex-direction: column;
        gap: 0.8rem;
    }

    .btn-seguir-comprando,
    .btn-finalizar-compra {
        width: 100%;
        padding: 0.8rem 1rem;
        font-size: 0.9rem;
    }
}

/* Móviles (480px - 599px) */
@media (max-width: 599px) {
    .carrito-modal-container {
        gap: 0.8rem;
        padding: 0.3rem;
    }

    .modal-title {
        font-size: 1.2rem;
    }

    .carrito-vacio {
        padding: 1.2rem;
    }

    .carrito-vacio p {
        font-size: 0.95rem;
        margin-bottom: 1rem;
    }

    .productos-lista {
        max-height: 200px;
        gap: 0.6rem;
    }

    .producto-item {
        padding: 0.6rem;
    }

    .producto-nombre {
        font-size: 0.85rem;
    }

    .precio-unitario,
    .cantidad,
    .total-item {
        font-size: 0.75rem;
    }

    .resumen-compra {
        padding: 0.6rem;
        gap: 0.5rem;
    }

    .total-line,
    .cuotas-info {
        font-size: 0.85rem;
    }

    .total-general {
        font-size: 1rem;
    }

    .cuota-mensual {
        font-size: 0.9rem;
    }

    .acciones-modal {
        gap: 0.6rem;
    }

    .btn-seguir-comprando,
    .btn-finalizar-compra {
        padding: 0.7rem 0.9rem;
        font-size: 0.85rem;
        min-height: 42px;
    }
}

/* Móviles pequeños (hasta 479px) */
@media (max-width: 479px) {
    .carrito-modal-container {
        gap: 0.6rem;
        padding: 0.2rem;
    }

    .modal-title {
        font-size: 1.1rem;
    }

    .carrito-vacio {
        padding: 1rem;
    }

    .carrito-vacio p {
        font-size: 0.9rem;
    }

    .productos-lista {
        max-height: 180px;
        gap: 0.5rem;
    }

    .producto-item {
        padding: 0.5rem;
    }

    .producto-nombre {
        font-size: 0.8rem;
    }

    .producto-detalles {
        gap: 0.1rem;
    }

    .precio-unitario,
    .cantidad,
    .total-item {
        font-size: 0.7rem;
    }

    .resumen-compra {
        padding: 0.5rem;
        gap: 0.4rem;
    }

    .total-line,
    .cuotas-info {
        font-size: 0.8rem;
    }

    .total-general {
        font-size: 0.95rem;
    }

    .cuota-mensual {
        font-size: 0.85rem;
    }

    .btn-seguir-comprando,
    .btn-finalizar-compra {
        padding: 0.6rem 0.8rem;
        font-size: 0.8rem;
        min-height: 40px;
    }
}

/* Ajustes para pantallas muy grandes (más de 1600px) */
@media (min-width: 1600px) {
    .carrito-modal-container {
        max-width: 600px;
        margin: 0 auto;
    }
}
</style>