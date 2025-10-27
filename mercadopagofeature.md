```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPYGAMING - MERCADOPAGO FEATURE                     │
│                              Frontend Architecture                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                 USER FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    Usuario en Carrito
           ↓
    Hace clic en "Proceder al pago"
           ↓
    CheckoutForm.vue (4 pasos)
           ↓
    Llena formulario → Click "Finalizar compra"
           ↓
    processPayment() [async]
           ↓
    Redirige a MercadoPago (o MOCK)
           ↓
    Usuario paga en MercadoPago
           ↓
    MercadoPago redirige según resultado:
           ↓
    ┌──────┴──────────────┬──────────────────┐
    ↓                     ↓                   ↓
PaymentSuccess    PaymentFailure      PaymentPending
/payment/success  /payment/failure    /payment/pending


┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPONENT LAYER                                    │
│                         (frontend/src/components/)                           │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                           CheckoutForm.vue                                ┃
┃                                                                            ┃
┃  ┌────────────────────────────────────────────────────────────────┐      ┃
┃  │  setup() {                                                      │      ┃
┃  │    const { processPayment, isProcessing, error } = usePayment()│      ┃
┃  │    return { processPayment, isProcessing, paymentError: error }│      ┃
┃  │  }                                                              │      ┃
┃  └────────────────────────────────────────────────────────────────┘      ┃
┃                                                                            ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   ┃
┃  │   Paso 1    │  │   Paso 2    │  │   Paso 3    │  │   Paso 4     │   ┃
┃  │   Datos     │→ │  Dirección  │→ │   Envío     │→ │     Pago     │   ┃
┃  │ Personales  │  │             │  │             │  │              │   ┃
┃  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘   ┃
┃                                                              ↓            ┃
┃                                                      procesarPago()       ┃
┃                                                      [async method]       ┃
┃                                                              ↓            ┃
┃                                           await processPayment(formData)  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                    ↓
                         Llama a composable usePayment


┌─────────────────────────────────────────────────────────────────────────────┐
│                          PAYMENT STATUS VIEWS                                │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━━━━┓
┃ PaymentSuccess   ┃   ┃ PaymentFailure   ┃   ┃ PaymentPending   ┃
┃                  ┃   ┃                  ┃   ┃                  ┃
┃ ✅ Pago exitoso  ┃   ┃ ❌ Pago rechazado┃   ┃ ⏳ Pago pendiente┃
┃                  ┃   ┃                  ┃   ┃                  ┃
┃ - Muestra ID     ┃   ┃ - Muestra error  ┃   ┃ - Muestra ID     ┃
┃ - Limpia carrito ┃   ┃ - Botón reintentar┃  ┃ - Info de espera ┃
┃ - Botón a Home   ┃   ┃ - Botón a Home   ┃   ┃ - Botón a Home   ┃
┗━━━━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━━━━━┛


┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPOSABLE LAYER                                   │
│                        (frontend/src/composables/)                           │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                          usePayment.js                                    ┃
┃                    [Composition API Composable]                           ┃
┃                                                                            ┃
┃  Estado Reactivo:                                                         ┃
┃  ┌──────────────────────────────────────────────────────────────┐        ┃
┃  │ const isProcessing = ref(false)  // Estado de carga          │        ┃
┃  │ const error = ref(null)           // Errores                 │        ┃
┃  │ const preferenceId = ref(null)    // ID de preferencia MP    │        ┃
┃  └──────────────────────────────────────────────────────────────┘        ┃
┃                                                                            ┃
┃  Funciones Exportadas:                                                    ┃
┃  ┌──────────────────────────────────────────────────────────────┐        ┃
┃  │ processPayment(formData) [async]                             │        ┃
┃  │   ↓                                                           │        ┃
┃  │   1. Obtener carrito: getCart()                              │        ┃
┃  │   2. Calcular total: getCartTotal()                          │        ┃
┃  │   3. Preparar orderData { items, payer, total }              │        ┃
┃  │   4. Llamar a mercadopagoService.createPreference()          │        ┃
┃  │   5. Redirigir: window.location.href = response.initPoint    │        ┃
┃  │                                                               │        ┃
┃  │ checkPaymentStatus(paymentId) [async]                        │        ┃
┃  │   ↓                                                           │        ┃
┃  │   - Llamar a mercadopagoService.getPaymentStatus()           │        ┃
┃  │   - Retornar estado del pago                                 │        ┃
┃  └──────────────────────────────────────────────────────────────┘        ┃
┃                                ↓                                          ┃
┃                    Usa servicio mercadopagoService                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                    ↓
                         Llama a service layer


┌─────────────────────────────────────────────────────────────────────────────┐
│                            SERVICE LAYER                                     │
│                        (frontend/src/services/)                              │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                      mercadopagoService.js                                ┃
┃                                                                            ┃
┃  ╔══════════════════════════════════════════════════════════════╗        ┃
┃  ║          MODE SWITCHER - ESTRATEGIA CLAVE                    ║        ┃
┃  ║  const USE_MOCK = true  // ← Switch para desarrollo         ║        ┃
┃  ╚══════════════════════════════════════════════════════════════╝        ┃
┃                                                                            ┃
┃  createPreference(orderData) [async]                                      ┃
┃  ┌────────────────────────────────────────────────────────────────┐      ┃
┃  │                                                                 │      ┃
┃  │  if (USE_MOCK === true) {                                      │      ┃
┃  │    ┌─────────────────────────────────────────────────┐        │      ┃
┃  │    │         🔧 MODO MOCK (Desarrollo)              │        │      ┃
┃  │    │                                                  │        │      ┃
┃  │    │  - Simula delay de 1 segundo                    │        │      ┃
┃  │    │  - Genera ID ficticio: MOCK-${Date.now()}      │        │      ┃
┃  │    │  - Crea URL de prueba a MercadoPago            │        │      ┃
┃  │    │  - NO llama al backend                          │        │      ┃
┃  │    │  - Permite trabajar sin Developer 1             │        │      ┃
┃  │    │                                                  │        │      ┃
┃  │    │  return {                                        │        │      ┃
┃  │    │    preferenceId: "MOCK-1234567890",            │        │      ┃
┃  │    │    initPoint: "https://mercadopago.com/..."    │        │      ┃
┃  │    │  }                                               │        │      ┃
┃  │    └─────────────────────────────────────────────────┘        │      ┃
┃  │  }                                                              │      ┃
┃  │                                                                 │      ┃
┃  │  else {                                                         │      ┃
┃  │    ┌─────────────────────────────────────────────────┐        │      ┃
┃  │    │        🌐 MODO REAL (Producción)               │        │      ┃
┃  │    │                                                  │        │      ┃
┃  │    │  - Llama a backend real                         │        │      ┃
┃  │    │  - POST /api/mercadopago/create-preference     │        │      ┃
┃  │    │  - Backend crea preferencia en MercadoPago     │        │      ┃
┃  │    │  - Retorna ID y URL reales                      │        │      ┃
┃  │    │                                                  │        │      ┃
┃  │    │  const response = await fetch(                  │        │      ┃
┃  │    │    'http://localhost:3001/api/mercadopago/...'│        │      ┃
┃  │    │  )                                               │        │      ┃
┃  │    │  return response.json()                         │        │      ┃
┃  │    └─────────────────────────────────────────────────┘        │      ┃
┃  │  }                                                              │      ┃
┃  └────────────────────────────────────────────────────────────────┘      ┃
┃                                                                            ┃
┃  getPaymentStatus(paymentId) [async]                                      ┃
┃  ┌────────────────────────────────────────────────────────────────┐      ┃
┃  │  Similar estructura MOCK/REAL                                  │      ┃
┃  │  GET /api/mercadopago/payment/:id                              │      ┃
┃  └────────────────────────────────────────────────────────────────┘      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┌─────────────────────────────────────────────────────────────────────────────┐
│                            ROUTER LAYER                                      │
│                        (frontend/src/router/)                                │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                          index.js (Router)                                ┃
┃                                                                            ┃
┃  Rutas Agregadas:                                                         ┃
┃  ┌────────────────────────────────────────────────────────────────┐      ┃
┃  │ { path: '/payment/success',                                    │      ┃
┃  │   name: 'PaymentSuccess',                                      │      ┃
┃  │   component: PaymentSuccess }                                  │      ┃
┃  │                                                                 │      ┃
┃  │ { path: '/payment/failure',                                    │      ┃
┃  │   name: 'PaymentFailure',                                      │      ┃
┃  │   component: PaymentFailure }                                  │      ┃
┃  │                                                                 │      ┃
┃  │ { path: '/payment/pending',                                    │      ┃
┃  │   name: 'PaymentPending',                                      │      ┃
┃  │   component: PaymentPending }                                  │      ┃
┃  └────────────────────────────────────────────────────────────────┘      ┃
┃                                                                            ┃
┃  ⚠️  ESTADO: MERGE CONFLICT PENDIENTE                                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┌─────────────────────────────────────────────────────────────────────────────┐
│                          UTILITIES LAYER                                     │
│                        (frontend/src/utils/)                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                          cartUtils.js                                     ┃
┃                                                                            ┃
┃  Funciones Usadas:                                                        ┃
┃  ┌────────────────────────────────────────────────────────────────┐      ┃
┃  │ getCart()        → Obtiene items del carrito desde localStorage│      ┃
┃  │ getCartTotal()   → Calcula total del carrito                   │      ┃
┃  │ clearCart()      → Limpia carrito (usado en PaymentSuccess)    │      ┃
┃  └────────────────────────────────────────────────────────────────┘      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW                                          │
└─────────────────────────────────────────────────────────────────────────────┘

Usuario                CheckoutForm              usePayment          Service
  │                         │                         │                  │
  │ Click "Finalizar"       │                         │                  │
  │────────────────────────>│                         │                  │
  │                         │ processPayment(data)    │                  │
  │                         │────────────────────────>│                  │
  │                         │                         │ createPreference │
  │                         │                         │─────────────────>│
  │                         │                         │                  │
  │                         │                         │    MOCK MODE?    │
  │                         │                         │<─────────────────│
  │                         │                         │                  │
  │                         │                         │   YES: Mock Data │
  │                         │                         │   NO: API Call   │
  │                         │                         │                  │
  │                         │                         │ {preferenceId,   │
  │                         │<────────────────────────│  initPoint}      │
  │                         │                         │<─────────────────│
  │ Redirect a MercadoPago  │                         │                  │
  │<────────────────────────│                         │                  │
  │                                                                       │
  │                    (Usuario paga en MercadoPago)                     │
  │                                                                       │
  │ Redirect según resultado                                             │
  │────────────────────────────────────────────────────────────────────>│
  │                                                                       │
  │  /payment/success  OR  /payment/failure  OR  /payment/pending       │


┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPENDENCIES                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                          package.json                                     ┃
┃                                                                            ┃
┃  Nueva Dependencia Agregada:                                              ┃
┃  ┌────────────────────────────────────────────────────────────────┐      ┃
┃  │ "@mercadopago/sdk-js": "^0.0.3"                               │      ┃
┃  └────────────────────────────────────────────────────────────────┘      ┃
┃                                                                            ┃
┃  Uso: SDK oficial de MercadoPago para frontend                           ┃
┃       (Wallet Brick, Card Payment, etc.)                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛


┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTEGRATION STRATEGY                                      │
└─────────────────────────────────────────────────────────────────────────────┘

            AHORA (MOCK MODE)              →           FUTURO (REAL MODE)
                                                
┌──────────────────────────────┐         ┌──────────────────────────────┐
│ Developer 2 (Frontend)       │         │ Developer 1 (Backend)        │
│                              │         │                              │
│ ✅ Componentes completos     │         │ ⏳ Controllers pendientes    │
│ ✅ Service con MOCK          │         │ ⏳ Routes pendientes         │
│ ✅ Composable implementado   │         │ ⏳ DB tables pendientes      │
│ ✅ Rutas configuradas        │         │ ⏳ Webhooks pendientes       │
│                              │         │                              │
│ USE_MOCK = true              │   →     │ USE_MOCK = false             │
│ Trabajo independiente        │         │ Integración real             │
└──────────────────────────────┘         └──────────────────────────────┘

Cambio simple cuando backend esté listo:
1. Abrir mercadopagoService.js
2. Cambiar: const USE_MOCK = true → const USE_MOCK = false
3. Testing de integración
4. ¡Listo para producción!
```
