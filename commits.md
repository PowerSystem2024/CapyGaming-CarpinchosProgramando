## ESTRATEGIA DE COMMITS ATÓMICOS (PASO A PASO)

Voy a guiarte para hacer  **6 commits lógicos y atómicos** :

### **PASO 1: Resolver el conflicto en router/index.js primero**

Antes de commitear NADA, tenés que resolver el conflicto.

 Ejecutá:

```bash
# Ver el estado del conflicto
git status

# Abrir el archivo en tu editor
code frontend/src/router/index.js
```

Buscá las líneas con `<<<<<<<`, `=======`, `>>>>>>>` y dejá TU código (las rutas de payment). Luego:

```bash
# Marcar como resuelto
git add frontend/src/router/index.js
```

---

### **PASO 2: Sacar authController.js del staging (no es parte de MercadoPago)**

Este cambio es solo whitespace y no pertenece a esta feature:

```bash
# Sacar del staging
git restore --staged backend/controllers/authController.js
```

---

### **PASO 3: Commit 1 - Dependencias de MercadoPago**

```bash
# Verificar que solo estén estos archivos en staging
git status

# Commit de dependencias
git commit -m "chore(deps): add mercadopago sdk dependency

Instalar SDK oficial de MercadoPago para integración de pagos.

Dependencia agregada:
- @mercadopago/sdk-js ^0.0.3

Propósito:
- Necesario para integración de Wallet Brick
- Permite crear preferencias de pago
- Facilita redirección a checkout de MercadoPago

Files modified:
- frontend/package.json
- frontend/package-lock.json

Developer: Developer 2 (Frontend)"
```

---

### **PASO 4: Sacar CheckoutForm.vue del staging temporalmente**

```bash
git restore --staged frontend/src/components/CheckoutForm.vue
```

---

### **PASO 5: Commit 2 - Servicio de MercadoPago**

```bash
# Agregar el servicio
git add frontend/src/services/mercadopagoService.js

# Commit
git commit -m "feat(payment): add mercadopago service with mock mode

Implementar servicio de MercadoPago con modo MOCK para desarrollo
independiente del backend.

Funcionalidades:
- createPreference(): Crea preferencia de pago (MOCK activo)
- getPaymentStatus(): Consulta estado de pagos
- USE_MOCK=true: Trabaja con datos simulados
- Preparado para integración real con backend

Modo MOCK simula:
- Delay de red de 1 segundo
- Preference ID ficticio
- Init point de MercadoPago simulado

Contrato API (acordado con Developer 1):
- Request: {items, payer, total}
- Response: {preferenceId, initPoint}

Files added:
- frontend/src/services/mercadopagoService.js

Developer: Developer 2 (Frontend)
Status: MOCK mode - Ready for backend integration"
```

---

### **PASO 6: Commit 3 - Composable de pagos**

```bash
# Agregar el composable
git add frontend/src/composables/usePayment.js

# Commit
git commit -m "feat(payment): add usePayment composable for payment logic

Crear composable para manejar lógica de procesamiento de pagos
con integración a mercadopagoService y cartUtils.

Funcionalidades:
- processPayment(): Procesa orden de compra completa
- checkPaymentStatus(): Verifica estado de pagos
- Manejo de estados: isProcessing, error, preferenceId
- Integración con carrito para obtener items y total

Flujo de pago:
1. Obtiene items del carrito
2. Prepara datos según contrato API
3. Crea preferencia en MercadoPago (MOCK)
4. Redirige a initPoint para completar pago

Files added:
- frontend/src/composables/usePayment.js

Developer: Developer 2 (Frontend)
Dependencies: mercadopagoService.js, cartUtils.js"
```

---

### **PASO 7: Commit 4 - Componentes de estado de pago**

```bash
# Agregar los 3 componentes
git add frontend/src/components/PaymentSuccess.vue
git add frontend/src/components/PaymentFailure.vue
git add frontend/src/components/PaymentPending.vue

# Commit
git commit -m "feat(payment): add payment status components

Crear componentes para manejar estados de retorno desde MercadoPago
(success, failure, pending) con diseño consistente y UX apropiada.

Componentes creados:
- PaymentSuccess.vue: Pago exitoso con limpieza de carrito
- PaymentFailure.vue: Pago rechazado con opción de reintentar
- PaymentPending.vue: Pago pendiente con mensaje informativo

Características:
- Diseño responsivo con estilos del design system
- Manejo de query params (payment_id, error)
- Navegación apropiada después de cada estado
- Integración con cartUtils para clearCart()
- Iconos visuales para cada estado (✓, ✕, ⏱)

Files added:
- frontend/src/components/PaymentSuccess.vue
- frontend/src/components/PaymentFailure.vue
- frontend/src/components/PaymentPending.vue

Developer: Developer 2 (Frontend)"
```

---

### **PASO 8: Commit 5 - Rutas de pago**

```bash
# Agregar router (ya resuelto el conflicto)
git add frontend/src/router/index.js

# Commit
git commit -m "feat(router): add payment status routes

Agregar rutas para manejar retorno desde MercadoPago con estados
de pago (success, failure, pending).

Rutas agregadas:
- /payment/success - Redirección después de pago exitoso
- /payment/failure - Redirección después de pago rechazado
- /payment/pending - Redirección cuando pago está pendiente

Integración:
- Importar componentes PaymentSuccess, PaymentFailure, PaymentPending
- Configurar rutas con navegación apropiada
- Preparado para recibir query params de MercadoPago

MercadoPago redirige a estas URLs según resultado del pago.

Files modified:
- frontend/src/router/index.js

Developer: Developer 2 (Frontend)"
```

---

### **PASO 9: Commit 6 - Integración de CheckoutForm**

```bash
# Agregar CheckoutForm
git add frontend/src/components/CheckoutForm.vue

# Commit
git commit -m "feat(checkout): integrate mercadopago payment flow in checkout

Modificar CheckoutForm para integrar flujo de pago con MercadoPago
usando composable usePayment y prellenar datos de usuario.

Cambios implementados:
- Importar composables: usePayment, AuthService
- Agregar función setup() con processPayment, isProcessing, paymentError
- Cambiar currentStep inicial de 1 a 2 (empezar en Direcciones)
- Crear función loadUserData() para prellenar datos de usuario
- Llamar loadUserData() en mounted() y watch de isOpen
- Modificar procesarPago() de síncrona a async
- Integrar await processPayment(formData)

Flujo de pago actualizado:
1. Usuario completa formulario de checkout
2. Click en \"Finalizar compra\"
3. processPayment() crea preferencia (MOCK por ahora)
4. Redirige a initPoint de MercadoPago
5. MercadoPago procesa pago
6. Redirige a /payment/success|failure|pending

Mejoras de UX:
- Datos de usuario precargados si está logueado
- Checkout empieza en paso 2 (Direcciones)
- Manejo de errores con mensajes apropiados

Files modified:
- frontend/src/components/CheckoutForm.vue

Developer: Developer 2 (Frontend)
Dependencies: usePayment.js, AuthService.js, mercadopagoService.js"
```

---

## ✅ RESUMEN DE COMMITS

Después de seguir todos los pasos, tendrás  **6 commits atómicos** :

1. ✅ `chore(deps): add mercadopago sdk dependency`
2. ✅ `feat(payment): add mercadopago service with mock mode`
3. ✅ `feat(payment): add usePayment composable for payment logic`
4. ✅ `feat(payment): add payment status components`
5. ✅ `feat(router): add payment status routes`
6. ✅ `feat(checkout): integrate mercadopago payment flow in checkout`

---

## 🔍 VERIFICACIÓN FINAL

Ejecutá estos comandos para verificar:

```bash
# Ver tus commits
git log --oneline -7

# Ver que no queden cambios sin commitear
git status
```
