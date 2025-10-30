<template>
    <div class="modal-overlay">
        <div class="modal-container">
        <div class="modal-header">
            <span class="header-title">Pago</span>
            <button @click="cerrar" class="close-btn">×</button>
        </div>

        <div class="modal-body">
            <!-- Payment Brick se renderiza aquí -->
            <div id="paymentBrick_container"></div>

            <!-- Estado del pago -->
            <div v-if="paymentStatus" class="payment-status" :class="paymentStatus.type">
            <h3>{{ paymentStatus.title }}</h3>
            <p>{{ paymentStatus.message }}</p>

            <!-- Botones de acción para success y pending -->
            <div v-if="paymentStatus.type === 'success' || paymentStatus.type === 'pending'" class="payment-actions">
                <button @click="verPedido" class="btn-secondary">
                Ver mi pedido
                </button>
                <button @click="seguirComprando" class="btn-primary">
                Seguir comprando
                </button>
            </div>

            <!-- Botón de reintentar para failure -->
            <div v-else class="payment-actions">
                <button @click="reintentar" class="btn-primary">
                Reintentar pago
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import mercadopagoClient from '../services/mercadopagoClient.js';

const router = useRouter();

const props = defineProps({
    items: Array,
    formData: Object,
    total: Number,
    shippingCost: Number,
    shippingMethod: String
});

const emit = defineEmits(['close', 'success', 'failure', 'pending']);

const paymentBrickController = ref(null);
const paymentStatus = ref(null);

onMounted(async () => {
    await initializePaymentBrick();
});

async function initializePaymentBrick() {
    try {
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

    // 3. Inicializar SDK de Mercado Pago con la public key dinámica
    const mp = new window.MercadoPago(publicKey, {
        locale: 'es-AR'
    });

    // 4. Crear Payment Brick
    const bricksBuilder = mp.bricks();

    paymentBrickController.value = await bricksBuilder.create('payment', 'paymentBrick_container', {
        initialization: {
        amount: props.total, // Monto total
        preferenceId: preferenceId, // ID de la preferencia
        },
        callbacks: {
        onReady: () => {
            // Brick listo para usar
            console.log('Payment Brick ready');
        },
        onSubmit: async ({ selectedPaymentMethod, formData }) => {
            // Cuando el usuario confirma el pago
            return handlePaymentSubmit(formData, selectedPaymentMethod);
        },
        onError: (error) => {
            // Manejo de errores
            console.error('Payment Brick error:', error);
            paymentStatus.value = {
            type: 'error',
            title: 'Error en el pago',
            message: 'Ocurrió un error al procesar tu pago. Por favor, intenta nuevamente.',
            buttonText: 'Reintentar'
            };
        }
        },
        customization: {
        visual: {
            style: {
            theme: 'dark'
            }
        },
        paymentMethods: {
            maxInstallments: 12,
            creditCard: 'all',
            debitCard: 'all',
            mercadoPago: 'all'
        }
        }
    });

    } catch (error) {
        console.error('Error initializing payment:', error);
        alert('Error al inicializar el pago');
    }
}

async function handlePaymentSubmit(formData, selectedPaymentMethod) {
    try {
        // Mostrar estado de "verificando"
        paymentStatus.value = {
            type: 'verifying',
            title: 'Verificando pago...',
            message: 'Por favor espera mientras verificamos tu pago.',
        };

        // El SDK de Mercado Pago procesa el pago automáticamente
        const orderId = localStorage.getItem('currentOrderId');

        // Polling: Intentar obtener el estado actualizado del pago
        // El webhook puede tardar varios segundos en actualizar la BD
        const maxAttempts = 15; // 15 intentos
        const delayBetweenAttempts = 2000; // 2 segundos entre intentos = 30 seg total
        let paymentInfo = null;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`🔄 Intento ${attempt}/${maxAttempts}: Consultando estado del pago...`);

            // Esperar antes de consultar
            await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));

            // Consultar estado
            paymentInfo = await mercadopagoClient.getPaymentStatus(orderId);

            // Si el pago fue aprobado o rechazado, salir del loop
            if (paymentInfo.status === 'approved' || paymentInfo.status === 'rejected') {
                console.log(`✅ Estado final obtenido: ${paymentInfo.status}`);
                break;
            }

            // Si llegamos al último intento y sigue pending, aceptarlo como pending real
            if (attempt === maxAttempts) {
                console.log('⏱️ Timeout alcanzado. El pago permanece como pending.');
            }
        }

        // Mostrar resultado final
        if (paymentInfo.status === 'approved') {
            paymentStatus.value = {
                type: 'success',
                title: '¡Pago exitoso!',
                message: `Tu pago de $${formatPrice(paymentInfo.transactionAmount)} fue aprobado.`,
                buttonText: 'Ver mi pedido'
            };
            emit('success', paymentInfo);
        } else if (paymentInfo.status === 'pending' || paymentInfo.status === 'in_process') {
            paymentStatus.value = {
                type: 'pending',
                title: 'Pago pendiente',
                message: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
                buttonText: 'Entendido'
            };
            emit('pending', paymentInfo);
        } else {
            // rejected, cancelled, etc.
            paymentStatus.value = {
                type: 'failure',
                title: 'Pago rechazado',
                message: paymentInfo.statusDetail || 'El pago no pudo ser procesado.',
                buttonText: 'Reintentar'
            };
            emit('failure', paymentInfo);
        }

    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
}

// Funciones de navegación después del pago
function verPedido() {
    const orderId = localStorage.getItem('currentOrderId');
    emit('success');
    cerrar();
    // Redirigir a la página de detalle del pedido
    if (orderId) {
        router.push(`/pedido/${orderId}`);
    } else {
        // Si no hay orderId, ir a mis pedidos
        router.push('/mis-pedidos');
    }
}

function seguirComprando() {
    emit('success');
    cerrar();
    // Volver al home
    router.push('/');
}

function reintentar() {
    // Reintentar - recargar el brick
    paymentStatus.value = null;
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

function formatPrice(price) {
    return new Intl.NumberFormat('es-AR').format(price);
}
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
    max-width: 450px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: linear-gradient(135deg, #1e2a38 0%, #2C3E50 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #ff9800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: rgb(255, 255, 255);
    transition: all 0.2s;
    font-weight: bold;
    line-height: 1;
    padding: 0;
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
    min-height: 280px;
    border-radius: 6px;
    overflow: hidden;
}

.payment-status {
    padding: 1rem;
    text-align: center;
    border-radius: 6px;
    margin-top: 0.5rem;
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

.payment-status.error,
.payment-status.failure {
    background: rgba(220, 53, 69, 0.15);
    color: #f44336;
    border: 1px solid rgba(220, 53, 69, 0.3);
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
</style>
