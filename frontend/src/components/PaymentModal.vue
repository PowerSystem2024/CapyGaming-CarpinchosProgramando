<template>
    <div class="modal-overlay">
        <div class="modal-container">
        <div class="modal-header">
            <span class="header-title">Pago con Mercado Pago</span>
            <button @click="cerrar" class="close-btn">×</button>
        </div>

        <div class="modal-body">
            <!-- Wallet Brick se renderiza aquí -->
            <div id="paymentBrick_container"></div>

            <!-- Mensaje de error si falla la inicialización -->
            <div v-if="initError" class="payment-status error">
                <h3>Error al inicializar el pago</h3>
                <p>{{ initError }}</p>
                <div class="payment-actions">
                    <button @click="reintentar" class="btn-primary">
                        Reintentar
                    </button>
                    <button @click="cerrar" class="btn-secondary">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mercadopagoClient from '../services/mercadopagoClient.js';

const props = defineProps({
    items: Array,
    formData: Object,
    total: Number,
    shippingCost: Number,
    shippingMethod: String
});

const emit = defineEmits(['close', 'success']);

const paymentBrickController = ref(null);
const initError = ref(null);

onMounted(async () => {
    await initializePaymentBrick();
});

async function initializePaymentBrick() {
    try {
        initError.value = null;

        // 1. Obtener public key desde el backend
        const { publicKey } = await mercadopagoClient.getPublicKey();
        console.log('✅ Public key obtenida desde backend');

        // 2. Preparar items con envío incluido
        const itemsWithShipping = [...props.items];

        // Agregar envío como item si tiene costo
        if (props.shippingCost && props.shippingCost > 0) {
            itemsWithShipping.push({
                id: 'shipping',
                title: props.shippingMethod === 'express' ? 'Envío Express' : 'Envío Estándar',
                quantity: 1,
                unit_price: props.shippingCost,
                description: `Costo de envío: ${props.shippingMethod === 'express' ? 'Envío Express' : 'Envío Estándar'}`
            });
        }

        // 3. Crear preferencia en tu backend
        const { preferenceId, orderId } = await mercadopagoClient.createPreference({
            items: itemsWithShipping,
            payer: {
                name: props.formData.nombre,
                surname: props.formData.apellidos,
                email: props.formData.email,
                identification: {
                    type: 'DNI',
                    number: String(props.formData.dni)
                }
            }
        });

        // Guardar orderId para tracking
        localStorage.setItem('currentOrderId', orderId);

        // 4. Inicializar SDK de Mercado Pago
        const mp = new window.MercadoPago(publicKey, {
            locale: 'es-AR'
        });

        // 5. Crear Wallet Brick (solo pagos con cuenta de MercadoPago)
        const bricksBuilder = mp.bricks();

        paymentBrickController.value = await bricksBuilder.create('wallet', 'paymentBrick_container', {
            initialization: {
                preferenceId: preferenceId,
                // IMPORTANTE: 'self' abre en la misma pestaña, 'blank' abre en nueva pestaña
                redirectMode: 'self'
            },
            customization: {
                visual: {
                    style: {
                        theme: 'dark'
                    }
                },
                texts: {
                    valueProp: 'smart_option'
                }
            }
        });

    } catch (error) {
        console.error('Error al inicializar el pago:', error);
        initError.value = error.message || 'Error al inicializar el pago. Por favor, intenta nuevamente.';
    }
}

function reintentar() {
    initError.value = null;
    if (paymentBrickController.value) {
        paymentBrickController.value.unmount();
    }
    initializePaymentBrick();
}

function cerrar() {
    emit('close');
}

onUnmounted(() => {
    // Limpiar el brick al cerrar el modal
    if (paymentBrickController.value) {
        paymentBrickController.value.unmount();
    }
});
</script>

<style scoped>
/* Estilos del modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
}

.modal-container {
    background: #2C3E50;
    border-radius: 8px;
    width: fit-content;
    min-width: 240px;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0.5rem;
    background: linear-gradient(135deg, #1e2a38 0%, #2C3E50 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    white-space: nowrap;
}

.header-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #ff9800;
    letter-spacing: 0.1px;
    text-transform: uppercase;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    color: rgb(255, 255, 255);
    transition: all 0.2s;
    font-weight: bold;
    line-height: 1;
    padding: 0;
    margin-left: 0.3rem;
    opacity: 0.7;
}

.close-btn:hover {
    opacity: 1;
    transform: scale(1.15);
}

.modal-body {
    padding: 0.5rem;
    background-color: #2C3E50;
}

#paymentBrick_container {
    min-height: 0;
    height: auto;
    border-radius: 4px;
    overflow: hidden;
}

.payment-status {
    padding: 1rem;
    text-align: center;
    border-radius: 6px;
    margin-top: 0.5rem;
    min-width: 250px;
    max-width: 450px;
}

.payment-status h3 {
    font-size: 0.95rem;
    margin: 0 0 0.5rem 0;
}

.payment-status p {
    font-size: 0.85rem;
    margin: 0 0 0.75rem 0;
}

.payment-status.success {
    background: rgba(40, 167, 69, 0.15);
    color: #4caf50;
    border: 1px solid rgba(40, 167, 69, 0.3);
}

.payment-status.pending {
    background: rgba(255, 193, 7, 0.15);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
}

.payment-status.verifying {
    background: rgba(33, 150, 243, 0.15);
    color: #2196f3;
    border: 1px solid rgba(33, 150, 243, 0.3);
}

.payment-status {
    padding: 1rem;
    text-align: center;
    border-radius: 6px;
    margin-top: 0.5rem;
    min-width: 250px;
    max-width: 450px;
}

.payment-status.error {
    background: rgba(220, 53, 69, 0.15);
    color: #f44336;
    border: 1px solid rgba(220, 53, 69, 0.3);
}

.payment-status.processing {
    background: rgba(33, 150, 243, 0.15);
    color: #2196f3;
    border: 1px solid rgba(33, 150, 243, 0.3);
}

.payment-status.success {
    background: rgba(40, 167, 69, 0.15);
    color: #4caf50;
    border: 1px solid rgba(40, 167, 69, 0.3);
}

.payment-status.pending {
    background: rgba(255, 193, 7, 0.15);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
}

.payment-status.failure {
    background: rgba(220, 53, 69, 0.15);
    color: #f44336;
    border: 1px solid rgba(220, 53, 69, 0.3);
}

.payment-status h3 {
    font-size: 0.95rem;
    margin: 0 0 0.5rem 0;
}

.payment-status p {
    font-size: 0.85rem;
    margin: 0 0 0.75rem 0;
}

/* Spinner */
.spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 1rem;
    border: 4px solid rgba(33, 150, 243, 0.2);
    border-top: 4px solid #2196f3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.close-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.payment-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.75rem;
    justify-content: center;
}

.btn-primary {
    padding: 0.6rem 1.5rem;
    background: #ff9800;
    color: black;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s;
    flex: 1;
}

.btn-primary:hover {
    background: #fb8c00;
    transform: translateY(-1px);
}

.btn-secondary {
    padding: 0.6rem 1.5rem;
    background: transparent;
    color: #ecf0f1;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s;
    flex: 1;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
}

/* Media Queries para Responsive */
/* Pantallas grandes (desktops, 1200px en adelante) */
@media (min-width: 1200px) {
    .modal-container {
        max-width: 500px;
        max-height: 85vh;
    }
    
    .modal-header {
        padding: 1rem 1.25rem;
    }
    
    .header-title {
        font-size: 1.1rem;
    }
    
    .close-btn {
        font-size: 1.8rem;
    }
    
    .modal-body {
        padding: 1rem;
    }
    
    #paymentBrick_container {
        min-height: 0;
    }
    
    .payment-status {
        padding: 1.5rem;
        margin-top: 1rem;
    }
    
    .payment-status h3 {
        font-size: 1.2rem;
        margin-bottom: 0.75rem;
    }
    
    .payment-status p {
        font-size: 1rem;
        margin-bottom: 1rem;
    }
    
    .payment-actions {
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .btn-primary, .btn-secondary {
        padding: 0.8rem 1.75rem;
        font-size: 1rem;
    }
}

/* Pantallas medianas (tablets, 768px a 1199px) */
@media (max-width: 1199px) and (min-width: 768px) {
    .modal-container {
        max-width: 500px;
        max-height: 85vh;
    }
    
    .modal-header {
        padding: 0.75rem 1rem;
    }
    
    .header-title {
        font-size: 1rem;
    }
    
    .modal-body {
        padding: 0.75rem;
    }
    
    #paymentBrick_container {
        min-height: 0;
    }
    
    .payment-status {
        padding: 1.25rem;
    }
    
    .payment-status h3 {
        font-size: 1.1rem;
    }
    
    .payment-status p {
        font-size: 0.9rem;
    }
    
    .payment-actions {
        gap: 0.9rem;
    }
    
    .btn-primary, .btn-secondary {
        padding: 0.7rem 1.6rem;
    }
}

/* Pantallas pequeñas (móviles, hasta 767px) */
@media (max-width: 767px) {
    .modal-overlay {
        padding: 15px;
        align-items: flex-start;
        padding-top: 10vh;
    }
    
    .modal-container {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 12px;
    }
    
    .modal-header {
        padding: 1rem;
        position: sticky;
        top: 0;
        z-index: 10;
    }
    
    .header-title {
        font-size: 1rem;
    }
    
    .close-btn {
        font-size: 1.8rem;
    }
    
    .modal-body {
        padding: 1rem;
    }
    
    #paymentBrick_container {
        min-height: 0;
        border-radius: 8px;
    }
    
    .payment-status {
        padding: 1.25rem;
        margin-top: 1rem;
        border-radius: 8px;
    }
    
    .payment-status h3 {
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
    }
    
    .payment-status p {
        font-size: 0.9rem;
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    
    .payment-actions {
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .btn-primary, .btn-secondary {
        padding: 0.8rem 1.5rem;
        font-size: 0.95rem;
        width: 100%;
    }
}

/* Pantallas muy pequeñas (móviles pequeños, hasta 480px) */
@media (max-width: 480px) {
    .modal-overlay {
        padding: 10px;
        padding-top: 5vh;
    }
    
    .modal-container {
        max-height: 95vh;
        border-radius: 10px;
    }
    
    .modal-header {
        padding: 0.875rem;
    }
    
    .header-title {
        font-size: 0.95rem;
    }
    
    .close-btn {
        font-size: 1.6rem;
    }
    
    .modal-body {
        padding: 0.875rem;
    }
    
    #paymentBrick_container {
        min-height: 0;
    }
    
    .payment-status {
        padding: 1rem;
    }
    
    .payment-status h3 {
        font-size: 1rem;
    }
    
    .payment-status p {
        font-size: 0.85rem;
    }
    
    .btn-primary, .btn-secondary {
        padding: 0.75rem 1.25rem;
        font-size: 0.9rem;
    }
}
</style>