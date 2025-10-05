<template>
  <div class="checkout-modal" v-if="isOpen" @click="closeOnOverlay">
    <div class="checkout-container" @click.stop>
      <button class="close-button" @click="closeModal">×</button>

      <div class="checkout-content">
        <!-- Lado izquierdo: Formulario principal -->
        <div class="checkout-form">
          <h2>Finalizar compra</h2>

          <!-- Paso 1: Datos Personales -->
          <div class="form-section" :class="{ 'section-collapsed': currentStep !== 1 }">
            <div class="section-header" @click="goToStep(1)">
              <span class="step-number">1</span>
              <h3>Datos Personales</h3>
              <span v-if="currentStep !== 1 && formData.nombre" class="section-status">✓</span>
            </div>

            <div v-if="currentStep === 1" class="section-content">
              <div class="login-prompt">
                <p>¿Ya tienes una cuenta? <a href="#" @click.prevent="showLogin">Inicia sesión</a></p>
              </div>

              <form @submit.prevent="nextStep">
                <div class="form-group">
                  <label for="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    v-model="formData.nombre"
                    @input="validateNombre"
                    placeholder="Ej: Juan"
                    required
                  />
                  <span v-if="errors.nombre" class="error">{{ errors.nombre }}</span>
                </div>

                <div class="form-group">
                  <label for="apellidos">Apellidos *</label>
                  <input
                    type="text"
                    id="apellidos"
                    v-model="formData.apellidos"
                    @input="validateApellidos"
                    placeholder="Ej: Pérez García"
                    required
                  />
                  <span v-if="errors.apellidos" class="error">{{ errors.apellidos }}</span>
                </div>

                <div class="form-group">
                  <label for="email">Dirección de correo electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    placeholder="tu@email.com"
                    required
                  />
                  <span v-if="errors.email" class="error">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                  <label for="password">Contraseña *</label>
                  <div class="password-input">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="formData.password"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      class="toggle-password"
                      @click="showPassword = !showPassword"
                    >
                      {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                    </button>
                  </div>
                  <span v-if="errors.password" class="error">{{ errors.password }}</span>
                </div>

                <div class="form-group">
                  <label for="dni">DNI *</label>
                  <input
                    type="text"
                    id="dni"
                    v-model="formData.dni"
                    placeholder="12345678"
                    required
                  />
                  <span v-if="errors.dni" class="error">{{ errors.dni }}</span>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      v-model="formData.privacyAccepted"
                      required
                    />
                    <span>Acepto la política de privacidad de los datos del cliente</span>
                  </label>
                  <small>Sus datos serán usados únicamente para procesar su pedido y pueden ser modificados en cualquier momento.</small>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      v-model="formData.newsletter"
                    />
                    <span>Suscribirse a nuestro boletín de noticias</span>
                  </label>
                </div>

                <button type="submit" class="btn-continue">Continuar</button>
              </form>
            </div>
          </div>

          <!-- Paso 2: Direcciones -->
          <div class="form-section" :class="{ 'section-collapsed': currentStep !== 2 }">
            <div class="section-header" @click="goToStep(2)" :class="{ 'disabled': currentStep < 2 }">
              <span class="step-number">2</span>
              <h3>Direcciones</h3>
              <span v-if="currentStep > 2 && formData.direccion" class="section-status">✓</span>
            </div>

            <div v-if="currentStep === 2" class="section-content">
              <form @submit.prevent="nextStep">
                <div class="form-group">
                  <label for="alias">Alias (Opcional)</label>
                  <input
                    type="text"
                    id="alias"
                    v-model="formData.alias"
                    placeholder='Ej: "Casa", "Oficina", "Casa de mis padres"'
                  />
                  <small>Nombre para identificar esta dirección</small>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="nombreDireccion">Nombre *</label>
                    <input
                      type="text"
                      id="nombreDireccion"
                      v-model="formData.nombreDireccion"
                      placeholder="Juan"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="apellidosDireccion">Apellidos *</label>
                    <input
                      type="text"
                      id="apellidosDireccion"
                      v-model="formData.apellidosDireccion"
                      placeholder="Pérez García"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="dniDireccion">DNI *</label>
                  <input
                    type="text"
                    id="dniDireccion"
                    v-model="formData.dniDireccion"
                    placeholder="12345678"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="direccion">Dirección *</label>
                  <input
                    type="text"
                    id="direccion"
                    v-model="formData.direccion"
                    placeholder="Av. Corrientes 1234, Piso 2, Depto B"
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="codigoPostal">Código Postal *</label>
                    <input
                      type="text"
                      id="codigoPostal"
                      v-model="formData.codigoPostal"
                      placeholder="1043"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="ciudad">Ciudad *</label>
                    <input
                      type="text"
                      id="ciudad"
                      v-model="formData.ciudad"
                      placeholder="Buenos Aires"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="provincia">Provincia *</label>
                    <select id="provincia" v-model="formData.provincia" required>
                      <option value="">Seleccionar provincia</option>
                      <option value="buenos-aires">Buenos Aires</option>
                      <option value="caba">Ciudad Autónoma de Buenos Aires</option>
                      <option value="catamarca">Catamarca</option>
                      <option value="chaco">Chaco</option>
                      <option value="chubut">Chubut</option>
                      <option value="cordoba">Córdoba</option>
                      <option value="corrientes">Corrientes</option>
                      <option value="entre-rios">Entre Ríos</option>
                      <option value="formosa">Formosa</option>
                      <option value="jujuy">Jujuy</option>
                      <option value="la-pampa">La Pampa</option>
                      <option value="la-rioja">La Rioja</option>
                      <option value="mendoza">Mendoza</option>
                      <option value="misiones">Misiones</option>
                      <option value="neuquen">Neuquén</option>
                      <option value="rio-negro">Río Negro</option>
                      <option value="salta">Salta</option>
                      <option value="san-juan">San Juan</option>
                      <option value="san-luis">San Luis</option>
                      <option value="santa-cruz">Santa Cruz</option>
                      <option value="santa-fe">Santa Fe</option>
                      <option value="santiago">Santiago del Estero</option>
                      <option value="tierra-fuego">Tierra del Fuego</option>
                      <option value="tucuman">Tucumán</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="pais">País *</label>
                    <input
                      type="text"
                      id="pais"
                      value="Argentina"
                      disabled
                      style="background: var(--color-muted); cursor: not-allowed;"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="telefono">Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    id="telefono"
                    v-model="formData.telefono"
                    placeholder="+54 11 1234-5678"
                  />
                  <small>Teléfono de contacto para la entrega</small>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      v-model="formData.usarMismaDireccion"
                      checked
                    />
                    <span>Usar esta dirección para facturar también</span>
                  </label>
                  <small>Si desmarcas esta opción, podrás ingresar una dirección de facturación diferente</small>
                </div>

                <!-- Dirección de facturación (solo si no usa la misma) -->
                <div v-if="!formData.usarMismaDireccion" class="billing-address">
                  <h4>Dirección de Facturación</h4>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="nombreFacturacion">Nombre *</label>
                      <input
                        type="text"
                        id="nombreFacturacion"
                        v-model="formData.nombreFacturacion"
                        placeholder="Juan"
                        :required="!formData.usarMismaDireccion"
                      />
                    </div>

                    <div class="form-group">
                      <label for="apellidosFacturacion">Apellidos *</label>
                      <input
                        type="text"
                        id="apellidosFacturacion"
                        v-model="formData.apellidosFacturacion"
                        placeholder="Pérez García"
                        :required="!formData.usarMismaDireccion"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="direccionFacturacion">Dirección *</label>
                    <input
                      type="text"
                      id="direccionFacturacion"
                      v-model="formData.direccionFacturacion"
                      placeholder="Av. San Martín 567"
                      :required="!formData.usarMismaDireccion"
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="codigoPostalFacturacion">Código Postal *</label>
                      <input
                        type="text"
                        id="codigoPostalFacturacion"
                        v-model="formData.codigoPostalFacturacion"
                        placeholder="1043"
                        :required="!formData.usarMismaDireccion"
                      />
                    </div>

                    <div class="form-group">
                      <label for="ciudadFacturacion">Ciudad *</label>
                      <input
                        type="text"
                        id="ciudadFacturacion"
                        v-model="formData.ciudadFacturacion"
                        placeholder="Buenos Aires"
                        :required="!formData.usarMismaDireccion"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="provinciaFacturacion">Provincia *</label>
                    <select
                      id="provinciaFacturacion"
                      v-model="formData.provinciaFacturacion"
                      :required="!formData.usarMismaDireccion"
                    >
                      <option value="">Seleccionar provincia</option>
                      <option value="buenos-aires">Buenos Aires</option>
                      <option value="caba">Ciudad Autónoma de Buenos Aires</option>
                      <option value="catamarca">Catamarca</option>
                      <option value="chaco">Chaco</option>
                      <option value="chubut">Chubut</option>
                      <option value="cordoba">Córdoba</option>
                      <option value="corrientes">Corrientes</option>
                      <option value="entre-rios">Entre Ríos</option>
                      <option value="formosa">Formosa</option>
                      <option value="jujuy">Jujuy</option>
                      <option value="la-pampa">La Pampa</option>
                      <option value="la-rioja">La Rioja</option>
                      <option value="mendoza">Mendoza</option>
                      <option value="misiones">Misiones</option>
                      <option value="neuquen">Neuquén</option>
                      <option value="rio-negro">Río Negro</option>
                      <option value="salta">Salta</option>
                      <option value="san-juan">San Juan</option>
                      <option value="san-luis">San Luis</option>
                      <option value="santa-cruz">Santa Cruz</option>
                      <option value="santa-fe">Santa Fe</option>
                      <option value="santiago">Santiago del Estero</option>
                      <option value="tierra-fuego">Tierra del Fuego</option>
                      <option value="tucuman">Tucumán</option>
                    </select>
                  </div>
                </div>

                <button type="submit" class="btn-continue">Continuar</button>
              </form>
            </div>
          </div>

          <!-- Paso 3: Método de envío -->
          <div class="form-section" :class="{ 'section-collapsed': currentStep !== 3 }">
            <div class="section-header" @click="goToStep(3)" :class="{ 'disabled': currentStep < 3 }">
              <span class="step-number">3</span>
              <h3>Método de envío</h3>
              <span v-if="currentStep > 3 && formData.metodoEnvio" class="section-status">✓</span>
            </div>

            <div v-if="currentStep === 3" class="section-content">
              <form @submit.prevent="nextStep">
                <div class="shipping-options">
                  <label class="shipping-option" :class="{ 'selected': formData.metodoEnvio === 'standard' }">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      v-model="formData.metodoEnvio"
                      required
                      class="radio-standard"
                    />
                    <div class="shipping-content">
                      <div class="shipping-header">
                        <strong>Envío Estándar</strong>
                        <span class="shipping-price">$5.000</span>
                      </div>
                      <span class="shipping-time">5-7 días hábiles</span>
                    </div>
                  </label>

                  <label class="shipping-option" :class="{ 'selected': formData.metodoEnvio === 'express' }">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      v-model="formData.metodoEnvio"
                      class="radio-standard"
                    />
                    <div class="shipping-content">
                      <div class="shipping-header">
                        <strong>Envío Express</strong>
                        <span class="shipping-price">$10.000</span>
                      </div>
                      <span class="shipping-time">2-3 días hábiles</span>
                    </div>
                  </label>

                  <label class="shipping-option free-shipping" v-if="subtotal >= 100000" :class="{ 'selected': formData.metodoEnvio === 'gratis' }">
                    <input
                      type="radio"
                      name="shipping"
                      value="gratis"
                      v-model="formData.metodoEnvio"
                      class="radio-standard"
                    />
                    <div class="shipping-content">
                      <div class="shipping-header">
                        <strong>Envío GRATIS</strong>
                        <span class="shipping-price free">GRATIS</span>
                      </div>
                      <span class="shipping-time">7-10 días hábiles</span>
                      <span class="free-info">Disponible para compras superiores a $100.000</span>
                    </div>
                  </label>

                </div>

                <div class="order-comments">
                  <label for="comentarios">Comentarios sobre el pedido (Opcional)</label>
                  <textarea
                    id="comentarios"
                    v-model="formData.comentarios"
                    placeholder="Si desea agregar un comentario sobre su pedido, escríbalo en el campo a continuación"
                    rows="4"
                  ></textarea>
                </div>

                <button type="submit" class="btn-continue">Continuar</button>
              </form>
            </div>
          </div>

          <!-- Paso 4: Pago -->
          <div class="form-section" :class="{ 'section-collapsed': currentStep !== 4 }">
            <div class="section-header" @click="goToStep(4)" :class="{ 'disabled': currentStep < 4 }">
              <span class="step-number">4</span>
              <h3>Pago</h3>
              <span v-if="formData.metodoPago" class="section-status">✓</span>
            </div>

            <div v-if="currentStep === 4" class="section-content">
              <form @submit.prevent="procesarPago">
                <div class="payment-options">
                  <label class="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="tarjeta"
                      v-model="formData.metodoPago"
                      required
                    />
                    <div class="payment-info">
                      <strong>💳 Tarjeta de crédito/débito</strong>
                      <span>Visa, MasterCard, American Express</span>
                    </div>
                  </label>

                  <label class="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="transferencia"
                      v-model="formData.metodoPago"
                    />
                    <div class="payment-info">
                      <strong>🏦 Transferencia bancaria</strong>
                      <span>CBU/CVU - Alias</span>
                    </div>
                  </label>

                  <label class="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="mercadopago"
                      v-model="formData.metodoPago"
                    />
                    <div class="payment-info">
                      <strong>📱 Mercado Pago</strong>
                      <span>Paga con tu cuenta de MP</span>
                    </div>
                  </label>

                  <label class="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="efectivo"
                      v-model="formData.metodoPago"
                    />
                    <div class="payment-info">
                      <strong>💵 Efectivo</strong>
                      <span>Pago Fácil, Rapipago</span>
                    </div>
                  </label>
                </div>

                <!-- Formulario de tarjeta si selecciona tarjeta -->
                <div v-if="formData.metodoPago === 'tarjeta'" class="card-form">
                  <div class="form-group">
                    <label for="cardNumber">Número de tarjeta</label>
                    <input
                      type="text"
                      id="cardNumber"
                      v-model="formData.cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxlength="19"
                      @input="formatCardNumber"
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="cardExpiry">Vencimiento</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        v-model="formData.cardExpiry"
                        placeholder="MM/AA"
                        maxlength="5"
                        @input="formatExpiry"
                      />
                    </div>

                    <div class="form-group">
                      <label for="cardCVC">CVC</label>
                      <input
                        type="text"
                        id="cardCVC"
                        v-model="formData.cardCVC"
                        placeholder="123"
                        maxlength="4"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="cardName">Nombre en la tarjeta</label>
                    <input
                      type="text"
                      id="cardName"
                      v-model="formData.cardName"
                      placeholder="JUAN PEREZ"
                    />
                  </div>
                </div>

                <div class="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      v-model="formData.acceptTerms"
                      required
                    />
                    <span>Acepto los términos y condiciones de la compra</span>
                  </label>
                </div>

                <button type="submit" class="btn-pay">Finalizar compra</button>
              </form>
            </div>
          </div>
        </div>

        <!-- Lado derecho: Resumen de compra -->
        <div class="order-summary">
          <h3>Tu pedido</h3>

          <div class="summary-items">
            <div v-for="item in cartItems" :key="item.id" class="summary-item">
              <span class="item-quantity">{{ item.quantity }}x</span>
              <span class="item-name">{{ item.nombre }}</span>
              <span class="item-price">${{ (item.precio * item.quantity).toLocaleString('es-AR') }}</span>
            </div>
          </div>

          <div class="summary-total">
            <div class="total-line">
              <span>{{ totalItems }} artículo(s)</span>
              <span>${{ subtotal.toLocaleString('es-AR') }}</span>
            </div>
            <div class="total-line">
              <span>Transporte</span>
              <span>{{ shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}` }}</span>
            </div>

            <div class="promo-code">
              <input
                type="text"
                v-model="promoCode"
                placeholder="Código de promoción"
              />
              <button @click="applyPromoCode" class="btn-promo">Agregar cupón</button>
            </div>

            <div v-if="discount > 0" class="total-line discount">
              <span>Descuento</span>
              <span>-${{ discount.toLocaleString('es-AR') }}</span>
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

<script>
import { getCart, getCartTotal, clearCart } from "../utils/cartUtils";
import { authAPI, paymentAPI } from "../services/api.js";

export default {
  name: "CheckoutForm",
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentStep: 1,
      showPassword: false,
      promoCode: '',
      discount: 0,
      loading: false,
      formData: {
        // Paso 1: Datos personales
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        dni: '',
        privacyAccepted: false,
        newsletter: false,

        // Paso 2: Direcciones de envío
        alias: '',
        nombreDireccion: '',
        apellidosDireccion: '',
        dniDireccion: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        provincia: '',
        telefono: '',
        usarMismaDireccion: true,

        // Dirección de facturación (si es diferente)
        nombreFacturacion: '',
        apellidosFacturacion: '',
        direccionFacturacion: '',
        ciudadFacturacion: '',
        codigoPostalFacturacion: '',
        provinciaFacturacion: '',

        // Paso 3: Método de envío
        metodoEnvio: '',
        comentarios: '',

        // Paso 4: Pago
        metodoPago: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        cardName: '',
        acceptTerms: false
      },
      errors: {},
      cartItems: []
    }
  },
  computed: {
    totalItems() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    subtotal() {
      return getCartTotal();
    },
    shippingCost() {
      switch(this.formData.metodoEnvio) {
        case 'standard': return 5000;
        case 'express': return 10000;
        case 'gratis':
        case 'retiro':
          return 0;
        default:
          return this.currentStep >= 3 ? 5000 : 0;
      }
    },
    total() {
      return this.subtotal + this.shippingCost - this.discount;
    }
  },
  mounted() {
    this.loadCart();
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.loadCart();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  },
  methods: {
    loadCart() {
      this.cartItems = getCart();
      console.log("🔍 CHECKOUT - Cart items loaded:", this.cartItems);
      console.log("🔍 CHECKOUT - Total items count:", this.cartItems.reduce((sum, item) => sum + item.quantity, 0));
      console.log("🔍 CHECKOUT - getCartTotal():", getCartTotal());
      console.log("🔍 CHECKOUT - Manual calculation:", this.cartItems.reduce((total, item) => total + item.precio * item.quantity, 0));
    },
    showLogin() {
      // Cerrar modal de checkout y redirigir al login
      this.closeModal();
      this.$router.push('/login');
    },
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    closeOnOverlay(event) {
      if (event.target === event.currentTarget) {
        this.closeModal();
      }
    },
    resetForm() {
      this.currentStep = 1;
      this.formData = {
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        dni: '',
        privacyAccepted: false,
        newsletter: false,
        alias: '',
        nombreDireccion: '',
        apellidosDireccion: '',
        dniDireccion: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        provincia: '',
        telefono: '',
        usarMismaDireccion: true,
        nombreFacturacion: '',
        apellidosFacturacion: '',
        direccionFacturacion: '',
        ciudadFacturacion: '',
        codigoPostalFacturacion: '',
        provinciaFacturacion: '',
        metodoEnvio: '',
        comentarios: '',
        metodoPago: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        cardName: '',
        acceptTerms: false
      };
      this.errors = {};
      this.promoCode = '';
      this.discount = 0;
    },
    goToStep(step) {
      if (step <= this.currentStep || (step === this.currentStep + 1 && this.validateCurrentStep())) {
        this.currentStep = step;
      }
    },
    nextStep() {
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    },
    validateCurrentStep() {
      this.errors = {};

      switch(this.currentStep) {
        case 1:
          if (!this.formData.nombre) this.errors.nombre = 'El nombre es requerido';
          if (!this.formData.apellidos) this.errors.apellidos = 'Los apellidos son requeridos';
          if (!this.formData.email) this.errors.email = 'El email es requerido';
          if (!this.formData.password) this.errors.password = 'La contraseña es requerida';
          if (!this.formData.dni) this.errors.dni = 'El DNI es requerido';
          if (!this.formData.privacyAccepted) this.errors.privacy = 'Debes aceptar la política de privacidad';
          break;
        case 2:
          if (!this.formData.nombreDireccion) this.errors.nombreDireccion = 'El nombre es requerido';
          if (!this.formData.apellidosDireccion) this.errors.apellidosDireccion = 'Los apellidos son requeridos';
          if (!this.formData.dniDireccion) this.errors.dniDireccion = 'El DNI es requerido';
          if (!this.formData.direccion) this.errors.direccion = 'La dirección es requerida';
          if (!this.formData.ciudad) this.errors.ciudad = 'La ciudad es requerida';
          if (!this.formData.codigoPostal) this.errors.codigoPostal = 'El código postal es requerido';
          if (!this.formData.provincia) this.errors.provincia = 'La provincia es requerida';

          // Si usa dirección de facturación diferente, validar esos campos también
          if (!this.formData.usarMismaDireccion) {
            if (!this.formData.nombreFacturacion) this.errors.nombreFacturacion = 'El nombre de facturación es requerido';
            if (!this.formData.apellidosFacturacion) this.errors.apellidosFacturacion = 'Los apellidos de facturación son requeridos';
            if (!this.formData.direccionFacturacion) this.errors.direccionFacturacion = 'La dirección de facturación es requerida';
            if (!this.formData.ciudadFacturacion) this.errors.ciudadFacturacion = 'La ciudad de facturación es requerida';
            if (!this.formData.codigoPostalFacturacion) this.errors.codigoPostalFacturacion = 'El código postal de facturación es requerido';
            if (!this.formData.provinciaFacturacion) this.errors.provinciaFacturacion = 'La provincia de facturación es requerida';
          }
          break;
        case 3:
          if (!this.formData.metodoEnvio) this.errors.envio = 'Selecciona un método de envío';
          break;
        case 4:
          if (!this.formData.metodoPago) this.errors.pago = 'Selecciona un método de pago';
          if (!this.formData.acceptTerms) this.errors.terms = 'Debes aceptar los términos y condiciones';
          break;
      }

      return Object.keys(this.errors).length === 0;
    },
    validateNombre(event) {
      const value = event.target.value;
      const regex = /^[a-zA-ZÀ-ÿ\s.]+$/;
      if (!regex.test(value)) {
        this.errors.nombre = 'Solo se permiten letras, espacios y puntos';
        event.target.value = value.slice(0, -1);
      } else {
        delete this.errors.nombre;
      }
    },
    validateApellidos(event) {
      const value = event.target.value;
      const regex = /^[a-zA-ZÀ-ÿ\s.]+$/;
      if (!regex.test(value)) {
        this.errors.apellidos = 'Solo se permiten letras, espacios y puntos';
        event.target.value = value.slice(0, -1);
      } else {
        delete this.errors.apellidos;
      }
    },
    formatCardNumber(event) {
      let value = event.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      this.formData.cardNumber = formattedValue;
    },
    formatExpiry(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      this.formData.cardExpiry = value;
    },
    applyPromoCode() {
      const validCodes = {
        'CAPY10': 0.10,
        'GAMING20': 0.20,
        'PRIMERA': 0.15
      };

      if (validCodes[this.promoCode.toUpperCase()]) {
        this.discount = this.subtotal * validCodes[this.promoCode.toUpperCase()];
        alert(`¡Cupón aplicado! Descuento del ${validCodes[this.promoCode.toUpperCase()] * 100}%`);
      } else {
        alert('Código de promoción inválido');
        this.discount = 0;
      }
    },
    showLogin() {
      alert('Funcionalidad de login próximamente');
    },
    async procesarPago() {
      if (!this.validateCurrentStep()) {
        return;
      }

      this.loading = true;

      try {
        // Verificar si el usuario está autenticado
        if (!authAPI.isAuthenticated()) {
          alert('Debes iniciar sesión para realizar la compra');
          this.showLogin();
          return;
        }

        const orderData = {
          direccion_envio: `${this.formData.direccion}, ${this.formData.ciudad}, ${this.formData.provincia}, CP: ${this.formData.codigoPostal}`,
          telefono_contacto: this.formData.telefono,
          notas: this.formData.observaciones || null
        };

        // Crear preferencia de pago en Mercado Pago
        const response = await paymentAPI.createPreference(orderData);

        if (response.success) {
          // Guardar el ID del pedido para tracking
          localStorage.setItem('current_order_id', response.pedido_id);
          
          // Redirigir a Mercado Pago
          if (process.env.NODE_ENV === 'development') {
            // En desarrollo, usar sandbox
            window.location.href = response.sandbox_init_point;
          } else {
            // En producción, usar init_point normal
            window.location.href = response.init_point;
          }
        } else {
          throw new Error(response.error || 'Error al procesar el pago');
        }

      } catch (error) {
        console.error('Error al procesar pago:', error);
        alert('Error al procesar el pago. Por favor, intenta de nuevo.');
      } finally {
        this.loading = false;
      }
    }
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
  backdrop-filter: blur(5px);
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border);
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
  padding: 4px;
  line-height: 1;
  outline: none;
  transition: transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.close-button:hover {
  transform: scale(1.2);
}

.close-button:active,
.close-button:focus {
  outline: none;
  background: transparent;
}

.checkout-content {
  display: flex;
  height: 100%;
  overflow: hidden;
  background: var(--color-background);
}

/* Lado izquierdo - Formulario */
.checkout-form {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  background: var(--color-background);
}

.checkout-form::-webkit-scrollbar {
  width: 8px;
}

.checkout-form::-webkit-scrollbar-track {
  background: var(--color-card);
  border-radius: 4px;
}

.checkout-form::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 4px;
}

.checkout-form::-webkit-scrollbar-thumb:hover {
  background: var(--sidebar-ring);
}

.checkout-form h2 {
  margin-bottom: 30px;
  color: var(--color-primary);
  font-size: 1.8rem;
  font-weight: 600;
  background: transparent;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--color-primary);
}

/* Secciones del formulario */
.form-section {
  background: var(--color-card);
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.3s;
}

.form-section:hover {
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  cursor: pointer;
  background: var(--color-accent);
  transition: background-color 0.3s;
  border-bottom: 1px solid var(--color-border);
}

.section-header:hover:not(.disabled) {
  background: var(--color-muted);
}

.section-header.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.step-number {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(243, 156, 18, 0.3);
}

.section-header h3 {
  flex: 1;
  margin: 0;
  color: var(--color-foreground);
  font-size: 1.1rem;
  background: transparent;
  font-weight: 500;
}

.section-status {
  color: #4caf50;
  font-size: 1.3rem;
  background: transparent;
}

.section-collapsed .section-header {
  background: var(--color-card);
  border-bottom: none;
}

.section-content {
  padding: 25px;
  background: var(--color-card);
}

/* Estilos del formulario */
.login-prompt {
  background: var(--color-accent);
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid var(--color-primary);
}

.login-prompt p {
  color: var(--color-foreground);
  background: transparent;
}

.login-prompt a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: bold;
  background: transparent;
  transition: all 0.3s;
}

.login-prompt a:hover {
  color: var(--sidebar-ring);
  text-decoration: underline;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-foreground);
  font-weight: 500;
  background: transparent;
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="tel"],
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-foreground);
  transition: all 0.3s;
}

.form-group input::placeholder {
  color: var(--color-muted-foreground);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--color-muted-foreground);
  padding: 5px;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: var(--color-primary);
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  background: var(--color-accent);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin: 10px 0;
}

.checkbox-group label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  color: var(--color-foreground);
  background: transparent;
  padding: 5px 0;
}

.checkbox-group label span {
  background: transparent;
  font-size: 0.95rem;
  line-height: 1.4;
}

.checkbox-group input[type="checkbox"] {
  margin-top: 2px;
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-group small {
  color: var(--color-muted-foreground);
  font-size: 0.85rem;
  margin: 8px 0 0 0;
  padding: 8px 12px;
  background: var(--color-background);
  border-radius: 6px;
  display: block;
  line-height: 1.4;
  text-align: center;
  border: 1px solid var(--color-border);
}

.form-group small {
  color: var(--color-muted-foreground);
  font-size: 0.85rem;
  margin-top: 5px;
  background: transparent;
  display: block;
}

.billing-address {
  margin-top: 30px;
  padding: 20px;
  background: var(--color-accent);
  border-radius: 8px;
  border: 1px solid var(--color-primary);
}

.billing-address h4 {
  color: var(--color-primary);
  font-size: 1.1rem;
  margin-bottom: 20px;
  background: transparent;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.error {
  color: var(--color-destructive);
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
  background: transparent;
}

.btn-continue, .btn-pay {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border: none;
  padding: 14px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.btn-continue:hover, .btn-pay:hover {
  background: var(--sidebar-ring);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

/* Opciones de envío y pago */
.shipping-options, .payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shipping-option {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--color-accent);
  position: relative;
}

.shipping-option:hover {
  background: var(--color-muted);
}

.shipping-option.selected {
  background: var(--color-card);
}

.shipping-option.free-shipping {
  background: var(--color-accent);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
  border-color: #4caf50;
}

.shipping-option.free-shipping.selected {
  background: var(--color-card);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
  border-color: #4caf50;
}

.radio-standard {
  width: 18px;
  height: 18px;
  margin: 0;
  margin-top: 2px;
  cursor: pointer;
  accent-color: var(--color-primary);
  flex-shrink: 0;
}

.shipping-content {
  flex: 1;
  background: transparent;
}

.shipping-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.shipping-header strong {
  color: var(--color-foreground);
  font-size: 1.1rem;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.shipping-time {
  color: var(--color-muted-foreground);
  font-size: 0.9rem;
  background: transparent;
  display: block;
  margin-bottom: 5px;
}

.shipping-price {
  color: var(--color-primary);
  font-weight: bold;
  font-size: 1.1rem;
  background: transparent;
}

.shipping-price.free {
  color: #4caf50;
  font-size: 1.2rem;
}

.free-info {
  display: block;
  color: var(--color-muted-foreground);
  font-size: 0.85rem;
  margin-top: 5px;
  background: transparent;
  font-style: italic;
}

.order-comments {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.order-comments label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-foreground);
  font-weight: 500;
  background: transparent;
}

.order-comments textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  min-height: 100px;
  transition: border-color 0.3s;
}

.order-comments textarea::placeholder {
  color: var(--color-muted-foreground);
}

.order-comments textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--color-background);
}

.payment-option:hover {
  border-color: var(--color-primary);
  background: var(--color-accent);
  transform: translateX(5px);
}

.payment-option input[type="radio"] {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
}

.payment-option input[type="radio"]:checked {
  background: var(--color-primary);
}

.payment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: transparent;
}

.payment-info strong {
  color: var(--color-foreground);
  font-size: 1rem;
  background: transparent;
}

.payment-info span {
  color: var(--color-muted-foreground);
  font-size: 0.9rem;
  background: transparent;
}

/* Formulario de tarjeta */
.card-form {
  margin-top: 20px;
  padding: 20px;
  background: var(--color-accent);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

/* Lado derecho - Resumen */
.order-summary {
  width: 400px;
  background: var(--color-card);
  padding: 40px 30px;
  border-left: 2px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.order-summary * {
  background: transparent;
}

.order-summary h3 {
  margin-bottom: 30px;
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 600;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--color-primary);
}

.summary-items {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.summary-items::-webkit-scrollbar {
  width: 6px;
}

.summary-items::-webkit-scrollbar-track {
  background: var(--color-accent);
  border-radius: 3px;
}

.summary-items::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 3px;
}

.summary-item {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
}

.item-quantity {
  color: var(--color-primary);
  font-weight: bold;
  min-width: 35px;
  font-size: 0.95rem;
}

.item-name {
  flex: 1;
  color: var(--color-foreground);
  font-size: 0.95rem;
}

.item-price {
  color: var(--color-secondary);
  font-weight: 600;
  font-size: 0.95rem;
}

.summary-total {
  border-top: 2px solid var(--color-border);
  padding-top: 20px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: var(--color-foreground);
  font-size: 1rem;
}

.total-line span {
  background: transparent;
}

.total-line.discount {
  color: #4caf50;
}

.total-line.discount span {
  color: #4caf50;
}

.total-line.total-final {
  border-top: 2px solid var(--color-primary);
  margin-top: 10px;
  padding-top: 20px;
  font-size: 1.3rem;
}

.total-line.total-final strong {
  color: var(--color-primary);
  font-weight: 700;
}

.promo-code {
  display: flex;
  gap: 8px;
  margin: 15px 0;
}

.promo-code input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-foreground);
  font-size: 0.85rem;
}

.promo-code input::placeholder {
  color: var(--color-muted-foreground);
  font-size: 0.85rem;
}

.promo-code input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.btn-promo {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.btn-promo:hover {
  background: var(--sidebar-ring);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 968px) {
  .checkout-content {
    flex-direction: column;
  }

  .order-summary {
    width: 100%;
    border-left: none;
    border-top: 2px solid var(--color-border);
    max-height: 40vh;
  }

  .checkout-form {
    padding: 30px 20px;
  }

  .order-summary {
    padding: 30px 20px;
  }
}

@media (max-width: 640px) {
  .checkout-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .checkout-form {
    padding: 20px 15px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .section-header {
    padding: 15px;
  }

  .step-number {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }

  .section-header h3 {
    font-size: 1rem;
  }

  .checkout-form h2 {
    font-size: 1.4rem;
  }

  .order-summary h3 {
    font-size: 1.2rem;
  }

  .close-button {
    font-size: 1.1rem;
    padding: 4px;
  }
}
</style>