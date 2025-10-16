<template>
  <div class="checkout-modal" v-if="isOpen" @click="closeOnOverlay">
    <div class="checkout-container" @click.stop>
      <button class="close-button" @click="closeModal">×</button>

      <div class="checkout-content">
        <!-- Lado izquierdo: Formulario principal -->
        <div class="checkout-form">
          <h2>Finalizar compra</h2>

          <!-- Mostrar error general si existe -->
          <div v-if="generalError" class="error-banner">
            {{ generalError }}
          </div>

          <!-- Paso 1: Datos Personales (solo si NO está logeado) -->
          <div v-if="!isAuthenticated" class="form-section" :class="{ 'section-collapsed': currentStep !== 1 }">
            <div class="section-header" @click="goToStep(1)">
              <span class="step-number">1</span>
              <h3>Datos Personales</h3>
              <span v-if="currentStep !== 1 && formData.nombre" class="section-status">✓</span>
            </div>

            <div v-if="currentStep === 1" class="section-content">
              <div class="login-prompt">
                <p>¿Ya tienes una cuenta? <a href="#" @click.prevent="redirectToLogin">Inicia sesión</a></p>
              </div>

              <form @submit.prevent="registerAndContinue">
                <div class="form-group">
                  <label for="nombre">Nombre *</label>
                  <input type="text" id="nombre" v-model="formData.nombre" required />
                </div>

                <div class="form-group">
                  <label for="apellidos">Apellidos *</label>
                  <input type="text" id="apellidos" v-model="formData.apellidos" required />
                </div>

                <div class="form-group">
                  <label for="email">Email *</label>
                  <input type="email" id="email" v-model="formData.email" required />
                </div>

                <div class="form-group">
                  <label for="password">Contraseña *</label>
                  <input type="password" id="password" v-model="formData.password" required />
                </div>

                <div class="form-group">
                  <label for="dni">DNI *</label>
                  <input type="text" id="dni" v-model="formData.dni" required />
                </div>

                <div class="form-group">
                  <label for="telefono">Teléfono *</label>
                  <input type="tel" id="telefono" v-model="formData.telefono" required />
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" v-model="formData.privacyAccepted" required />
                    <span>Acepto la política de privacidad</span>
                  </label>
                </div>

                <button type="submit" class="btn-continue" :disabled="isLoading">
                  {{ isLoading ? 'Registrando...' : 'Continuar' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Paso 2: Direcciones -->
          <div class="form-section" :class="{ 'section-collapsed': currentStep !== (isAuthenticated ? 1 : 2) }">
            <div class="section-header" @click="goToStep(isAuthenticated ? 1 : 2)">
              <span class="step-number">{{ isAuthenticated ? 1 : 2 }}</span>
              <h3>Direcciones</h3>
            </div>

            <div v-if="currentStep === (isAuthenticated ? 1 : 2)" class="section-content">
              <form @submit.prevent="nextStep">
                <div class="form-group">
                  <label for="direccion_envio">Dirección de envío *</label>
                  <input type="text" id="direccion_envio" v-model="formData.direccion_envio" required />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="ciudad_envio">Ciudad *</label>
                    <input type="text" id="ciudad_envio" v-model="formData.ciudad_envio" required />
                  </div>

                  <div class="form-group">
                    <label for="codigo_postal_envio">C.P. *</label>
                    <input type="text" id="codigo_postal_envio" v-model="formData.codigo_postal_envio" required />
                  </div>
                </div>

                <div class="form-group">
                  <label for="provincia_envio">Provincia *</label>
                  <select id="provincia_envio" v-model="formData.provincia_envio" required>
                    <option value="">Seleccionar</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Santa Fe">Santa Fe</option>
                  </select>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" v-model="formData.usarMismaDireccion" checked />
                    <span>Usar esta dirección para facturación</span>
                  </label>
                </div>

                <button type="submit" class="btn-continue">Continuar</button>
              </form>
            </div>
          </div>

          <!-- Paso 3: Método de envío -->
          <div class="form-section" :class="{ 'section-collapsed': currentStep !== (isAuthenticated ? 2 : 3) }">
            <div class="section-header" @click="goToStep(isAuthenticated ? 2 : 3)">
              <span class="step-number">{{ isAuthenticated ? 2 : 3 }}</span>
              <h3>Método de envío</h3>
            </div>

            <div v-if="currentStep === (isAuthenticated ? 2 : 3)" class="section-content">
              <form @submit.prevent="nextStep">
                <div class="shipping-options">
                  <label class="shipping-option" :class="{ 'selected': formData.metodo_envio === 'standard' }">
                    <input type="radio" value="standard" v-model="formData.metodo_envio" required />
                    <div class="shipping-content">
                      <strong>Envío Estándar</strong>
                      <span class="shipping-price">$5.000</span>
                      <span class="shipping-time">5-7 días hábiles</span>
                    </div>
                  </label>

                  <label class="shipping-option" :class="{ 'selected': formData.metodo_envio === 'express' }">
                    <input type="radio" value="express" v-model="formData.metodo_envio" />
                    <div class="shipping-content">
                      <strong>Envío Express</strong>
                      <span class="shipping-price">$10.000</span>
                      <span class="shipping-time">2-3 días hábiles</span>
                    </div>
                  </label>

                  <label v-if="subtotal >= 100000" class="shipping-option free-shipping" :class="{ 'selected': formData.metodo_envio === 'gratis' }">
                    <input type="radio" value="gratis" v-model="formData.metodo_envio" />
                    <div class="shipping-content">
                      <strong>Envío GRATIS</strong>
                      <span class="shipping-price free">GRATIS</span>
                      <span class="shipping-time">7-10 días hábiles</span>
                    </div>
                  </label>
                </div>

                <button type="submit" class="btn-continue">Continuar</button>
              </form>
            </div>
          </div>

          <!-- Paso 4: Pago -->
          <div class="form-section" :class="{ 'section-collapsed': currentStep !== (isAuthenticated ? 3 : 4) }">
            <div class="section-header" @click="goToStep(isAuthenticated ? 3 : 4)">
              <span class="step-number">{{ isAuthenticated ? 3 : 4 }}</span>
              <h3>Pago</h3>
            </div>

            <div v-if="currentStep === (isAuthenticated ? 3 : 4)" class="section-content">
              <form @submit.prevent="procesarPago">
                <div class="payment-options">
                  <label class="payment-option">
                    <input type="radio" value="mercadopago" v-model="formData.metodoPago" required />
                    <div class="payment-info">
                      <strong>📱 Mercado Pago</strong>
                      <span>Paga con tu cuenta de MP</span>
                    </div>
                  </label>

                  <label class="payment-option">
                    <input type="radio" value="tarjeta" v-model="formData.metodoPago" />
                    <div class="payment-info">
                      <strong>💳 Tarjeta de crédito/débito</strong>
                      <span>Visa, MasterCard, American Express</span>
                    </div>
                  </label>

                  <label class="payment-option">
                    <input type="radio" value="transferencia" v-model="formData.metodoPago" />
                    <div class="payment-info">
                      <strong>🏦 Transferencia bancaria</strong>
                      <span>CBU/CVU - Alias</span>
                    </div>
                  </label>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" v-model="formData.acceptTerms" required />
                    <span>Acepto los términos y condiciones</span>
                  </label>
                </div>

                <button type="submit" class="btn-pay" :disabled="isLoading">
                  {{ isLoading ? 'Procesando...' : 'Finalizar compra' }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Lado derecho: Resumen de compra -->
        <div class="order-summary">
          <h3>Tu pedido</h3>

          <div class="summary-items">
            <div v-for="item in cartItems" :key="item.id_producto" class="summary-item">
              <span class="item-quantity">{{ item.quantity }}x</span>
              <span class="item-name">{{ item.nombre }}</span>
              <span class="item-price">${{ (item.precio * item.quantity).toLocaleString('es-AR') }}</span>
            </div>
          </div>

          <div class="summary-total">
            <div class="total-line">
              <span>Subtotal</span>
              <span>${{ subtotal.toLocaleString('es-AR') }}</span>
            </div>
            <div class="total-line">
              <span>Transporte</span>
              <span>{{ shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}` }}</span>
            </div>

            <div class="total-line total-final">
              <strong>Total</strong>
              <strong>${{ total.toLocaleString('es-AR') }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCart, getCartTotal, clearCart } from "../utils/cartUtils"
import { useAuth } from "../composables/useAuth"
import OrderService from "../services/orderService"
import AuthService from "../services/authService"

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Router
const router = useRouter()

// Auth
const { isAuthenticated, register: registerUser } = useAuth()

// State
const currentStep = ref(1)
const isLoading = ref(false)
const generalError = ref(null)
const cartItems = ref([])

const formData = reactive({
  // Datos personales (solo si no está logeado)
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  dni: '',
  telefono: '',
  privacyAccepted: false,

  // Datos de envío
  direccion_envio: '',
  ciudad_envio: '',
  codigo_postal_envio: '',
  provincia_envio: '',
  usarMismaDireccion: true,

  // Método de envío
  metodo_envio: 'standard',

  // Método de pago
  metodoPago: 'mercadopago',
  acceptTerms: false
})

// Computed
const subtotal = computed(() => {
  return getCartTotal()
})

const shippingCost = computed(() => {
  switch(formData.metodo_envio) {
    case 'standard': return 5000
    case 'express': return 10000
    case 'gratis': return 0
    default: return 5000
  }
})

const total = computed(() => {
  return subtotal.value + shippingCost.value
})

// Lifecycle
onMounted(() => {
  loadCart()
  // Si el usuario ya está logeado, empezar desde el paso de direcciones
  if (isAuthenticated.value) {
    currentStep.value = 1
    loadUserData()
  }
})

// Watch
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadCart()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

// Methods
function loadCart() {
  cartItems.value = getCart()
}

function loadUserData() {
  const user = AuthService.getCurrentUser()
  if (user) {
    formData.nombre = user.nombre || ''
    formData.apellidos = user.apellido || ''
    formData.email = user.email || ''
    formData.dni = user.dni || ''
    formData.telefono = user.telefono || ''
    formData.direccion_envio = user.direccion || ''
  }
}

function closeModal() {
  emit('close')
}

function closeOnOverlay(event) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function goToStep(step) {
  if (step <= currentStep.value) {
    currentStep.value = step
  }
}

function nextStep() {
  currentStep.value++
}

function redirectToLogin() {
  closeModal()
  // Aquí puedes emitir un evento para abrir el modal de login desde App.vue
  // o usar router.push si tienes una ruta de login
}

async function registerAndContinue() {
  isLoading.value = true
  generalError.value = null

  if (!formData.privacyAccepted) {
  generalError.value = 'Debes aceptar la política de privacidad'
  isLoading.value = false
  return
}

if (!formData.nombre || !formData.apellidos || !formData.email || !formData.password || !formData.dni || !formData.telefono) {
  generalError.value = 'Completa todos los campos obligatorios'
  isLoading.value = false
  return
}
  
  try {
    console.log('Payload de registro:', {
  nombre: formData.nombre,
  apellido: formData.apellidos,
  email: formData.email,
  password: formData.password,
  dni: formData.dni,
  telefono: formData.telefono,
  direccion: formData.direccion_envio || 'Sin dirección aún'
  })

    const result = await registerUser({
      nombre: formData.nombre,
      apellido: formData.apellidos,
      email: formData.email,
      password: formData.password,
      dni: formData.dni,
      telefono: formData.telefono,
      direccion: formData.direccion_envio || 'Sin dirección aún'

    })

    if (result.success) {
      nextStep()
    } else {
      generalError.value = result.error || 'Error al registrar el usuario'
    }
  } catch (error) {
    generalError.value = 'Error al registrar el usuario'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function procesarPago() {
  isLoading.value = true
  generalError.value = null

  try {
    // Preparar datos del pedido
    const orderData = {
      // Datos de envío
      nombre_envio: formData.nombre,
      apellido_envio: formData.apellidos,
      direccion_envio: formData.direccion_envio,
      ciudad_envio: formData.ciudad_envio,
      provincia_envio: formData.provincia_envio,
      codigo_postal_envio: formData.codigo_postal_envio,
      telefono_envio: formData.telefono,

      // Datos de facturación (igual al envío por ahora)
      nombre_facturacion: formData.nombre,
      apellido_facturacion: formData.apellidos,
      direccion_facturacion: formData.direccion_envio,
      ciudad_facturacion: formData.ciudad_envio,
      provincia_facturacion: formData.provincia_envio,
      codigo_postal_facturacion: formData.codigo_postal_envio,

      // Detalles del pedido
      metodo_envio: formData.metodo_envio,
      costo_envio: shippingCost.value,
      comentarios: '',
      subtotal: subtotal.value,
      descuento: 0,
      total: total.value,
      metodo_pago: formData.metodoPago,

      // Items del carrito
      items: cartItems.value.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.quantity
      }))
    }

    // Crear el pedido
    const result = await OrderService.createOrder(orderData)
    window.location.href = result.mercadopago.sandbox_init_point;
    console.log(result)

    // Si el método de pago es Mercado Pago, redirigir
    if (formData.metodoPago === 'mercadopago' && result.mercadopago) {
      if (result.mercadopago.init_point) {
        window.location.href = result.mercadopago.init_point
      } else {
        generalError.value = 'Error al crear la preferencia de pago'
      }
    } else {
      // Para otros métodos de pago, mostrar confirmación
      clearCart()
      alert('¡Pedido creado exitosamente! Número de pedido: ' + result.pedido.id_pedido)
      router.push('/')
      closeModal()
    }
  } catch (error) {
    generalError.value = error.message || 'Error al procesar el pago'
    console.error('Error procesando pago:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url(../assets/styles/base.css);

.checkout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.checkout-container {
  background: var(--color-background);
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  color: rgb(146, 0, 0);
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  background: transparent;
  z-index: 10;
}

.checkout-content {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.checkout-form {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.checkout-form h2 {
  margin-bottom: 30px;
  color: var(--color-primary);
}

.error-banner {
  background: #ff4444;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-section {
  background: var(--color-card);
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  cursor: pointer;
}

.step-number {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.section-content {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-foreground);
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-foreground);
}

.form-row {
  display: flex;
  gap: 20px;
}

.btn-continue,
.btn-pay {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 14px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.btn-continue:disabled,
.btn-pay:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.order-summary {
  width: 400px;
  background: var(--color-card);
  padding: 40px 30px;
  border-left: 2px solid var(--color-border);
}

.order-summary h3 {
  margin-bottom: 30px;
  color: var(--color-primary);
}

.summary-items {
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.item-quantity {
  color: var(--color-primary);
  font-weight: bold;
  min-width: 35px;
}

.item-name {
  flex: 1;
}

.item-price {
  font-weight: 600;
}

.summary-total {
  border-top: 2px solid var(--color-border);
  padding-top: 20px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.total-final {
  border-top: 2px solid var(--color-primary);
  margin-top: 10px;
  padding-top: 20px;
  font-size: 1.3rem;
}

.shipping-options,
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shipping-option,
.payment-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
}

.shipping-option.selected,
.payment-option.selected {
  border-color: var(--color-primary);
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-prompt {
  margin-bottom: 20px;
  padding: 15px;
  background: var(--color-accent);
  border-radius: 8px;
  text-align: center;
}

.login-prompt a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}

.section-collapsed .section-content {
  display: none;
}

.shipping-content,
.payment-info {
  flex: 1;
}

.shipping-price {
  display: block;
  font-weight: 600;
  color: var(--color-primary);
}

.shipping-time {
  display: block;
  font-size: 0.9rem;
  color: var(--color-muted-foreground);
}
</style>
