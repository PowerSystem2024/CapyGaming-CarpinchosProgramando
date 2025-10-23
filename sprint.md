# 🎯 Sprint Briefing: MercadoPago Integration

## 📋 Sprint Overview

**Sprint Goal:** Implementar sistema completo de pagos con MercadoPago en frontend, preparado para integración con backend.

 **Duration:** ~2 días de desarrollo **Developer:** Developer 2 (Frontend) **Branch:** `feature/CAPY-MP-001-mercadopago-integration`

---

## 🎬 Contexto Inicial

**Situación:*** El equipo necesita implementar pagos con MercadoPago

* Developer 1 (Backend) está trabajando en los endpoints
* Developer 2 (yo) necesita avanzar sin bloqueos
* Developer 3 (Testing) preparará tests cuando esté integrado

**Desafío:** ¿Cómo desarrollar el frontend SIN esperar al backend?

 **Solución:** Estrategia **MOCK-First Development** 🔧

---

## 💡 Estrategia de Desarrollo

### El Concepto: MOCK-First

```
┌─────────────────────────────────────────┐
│  "Simulo el backend hasta que esté      │
│   listo, luego simplemente cambio       │
│   un switch y todo funciona"            │
└─────────────────────────────────────────┘
```

**Ventajas:** ✅ Desarrollo paralelo (no espero a Developer 1) ✅ Puedo probar toda la UI inmediatamente ✅ Integración fácil (solo cambiar `USE_MOCK = false`) ✅ Menos conflictos entre developers ✅ Workflow más ágil

---

## 📦 ¿Qué se Implementó?

### 1. **Service Layer** - `mercadopagoService.js`

**Qué hace:** Maneja comunicación con backend (o simula si está en MOCK)

```javascript
const USE_MOCK = true;  // ← El switch mágico

if (USE_MOCK) {
  // Desarrollo: datos falsos pero realistas
  return { preferenceId: "MOCK-123", initPoint: "url_fake" }
} else {
  // Producción: llamada real al backend
  const response = await fetch('/api/mercadopago/...')
}
```

**Por qué es clave:** Un solo cambio (`true` → `false`) y ya estoy usando el backend real.

---

### 2. **Composable** - `usePayment.js`

**Qué hace:** Lógica reutilizable de pagos (Composition API)

 **Funciones principales:**

* `processPayment()` - Procesa el pago, obtiene preferencia de MP, redirige
* `checkPaymentStatus()` - Consulta estado de un pago

**Por qué lo hice así:**

* Separación de responsabilidades (componente no sabe de APIs)
* Reutilizable en otros componentes si es necesario
* Testeable independientemente

---

### 3. **Integration** - `CheckoutForm.vue`

**Qué cambió:**

* Agregué `setup()` para usar el composable
* Conecté botón "Finalizar compra" con `processPayment()`
* Cambié step inicial a 2 (saltar datos personales si ya está logueado)
* Agregué `loadUserData()` para prellenar formulario

**Flujo:**

```
Usuario llena formulario → Click "Finalizar" 
→ processPayment() → mercadopagoService 
→ Redirect a MercadoPago (o mock)
```

---

### 4. **Payment Status Views** - 3 componentes nuevos

**PaymentSuccess.vue**

* ✅ Pago exitoso
* Limpia carrito
* Muestra ID de pago
* Botón para volver al home

**PaymentFailure.vue**

* ❌ Pago rechazado
* Muestra mensaje de error
* Botón "Reintentar"
* Botón "Volver al home"

**PaymentPending.vue**

* ⏳ Pago pendiente (ej: efectivo, transferencia)
* Información de espera
* Muestra ID de pago

---

### 5. **Router Configuration** - `router/index.js`

**Qué agregué:**

```javascript
/payment/success  → PaymentSuccess.vue
/payment/failure  → PaymentFailure.vue
/payment/pending  → PaymentPending.vue
```

**Por qué:** MercadoPago redirige a estas URLs según resultado del pago.

---

## 🔄 Flujo Completo del Usuario

```
1. Usuario en Carrito
   ↓
2. Click "Proceder al pago"
   ↓
3. CheckoutForm (4 pasos: Datos, Dirección, Envío, Pago)
   ↓
4. Click "Finalizar compra"
   ↓
5. processPayment() ejecuta
   ↓
6. mercadopagoService.createPreference()
   ├─ MOCK MODE: Simula respuesta (1 seg delay)
   └─ REAL MODE: Llama a backend real
   ↓
7. Redirect a MercadoPago
   ↓
8. Usuario paga en plataforma de MercadoPago
   ↓
9. MercadoPago redirige según resultado:
   ├─ /payment/success  (pago aprobado)
   ├─ /payment/failure  (pago rechazado)
   └─ /payment/pending  (pago pendiente)
```

---

## 🏗️ Arquitectura en Capas

```
┌─────────────────────────────────────┐
│  COMPONENTS (CheckoutForm, Views)   │  ← Lo que ve el usuario
├─────────────────────────────────────┤
│  COMPOSABLES (usePayment)           │  ← Lógica de negocio
├─────────────────────────────────────┤
│  SERVICES (mercadopagoService)      │  ← Comunicación con backend
├─────────────────────────────────────┤
│  BACKEND API (Developer 1)          │  ← [⏳ En desarrollo]
└─────────────────────────────────────┘
```

**Separación clara:** Cada capa tiene una responsabilidad específica.

---

## 🎯 Puntos Clave de la Implementación

### 1. **Desarrollo Independiente**

No esperé a Developer 1. Trabajé con mocks y avancé en paralelo.

### 2. **Contrato de API Definido**

Acordé con Developer 1 qué datos envío y qué espero recibir:

 **Request que envío:**

```json
{
  "items": [...productos del carrito...],
  "payer": { name, surname, email },
  "total": 15000
}
```

**Response que espero:**

```json
{
  "preferenceId": "MP_123456",
  "initPoint": "https://mercadopago.com/checkout/..."
}
```

### 3. **Switch Simple para Integración**

```javascript
// AHORA (desarrollo)
const USE_MOCK = true;

// DESPUÉS (cuando backend esté)
const USE_MOCK = false;
```

Un solo cambio en un solo archivo. ¡Eso es todo!

### 4. **Vue 3 Composition API**

Usé `setup()` para integrar composables de forma moderna y reactiva.

### 5. **Manejo de Estados**

3 vistas distintas para cada resultado de pago (Success/Failure/Pending).

---

## 📊 Resultados del Sprint

### ✅ Completado:* [X] Service con modo MOCK funcional

* [X] Composable de pagos implementado
* [X] CheckoutForm integrado con usePayment
* [X] 3 vistas de estado de pago creadas
* [X] Rutas de pago configuradas
* [X] Dependencia @mercadopago/sdk-js instalada
* [X] Preparado para integración real

### ⏳ Pendiente (esperando Developer 1):* [ ] Backend endpoints de MercadoPago

* [ ] Cambiar USE_MOCK a false
* [ ] Testing de integración end-to-end
* [ ] Validación con Developer 3

---

## 🚀 Próximos Pasos

### Cuando Developer 1 termine backend:1. Cambiar `USE_MOCK = false` en `mercadopagoService.js`

1. Probar flujo completo con backend real
2. Ajustar manejo de errores si es necesario
3. Testing con Developer 3

### Para el PR:1. Resolver merge conflict en `router/index.js`

1. Code review con el equipo
2. Testing end-to-end completo
3. Merge a `main`

---

## 💎 Aprendizajes Clave

### 1. **Mock-Driven Development**

Puedo desarrollar UI completa sin depender de backend.

### 2. **Contratos de API**

Definir estructura de datos desde el inicio evita sorpresas.

### 3. **Separación de Capas**

Components → Composables → Services → Backend Cada uno con su responsabilidad.

### 4. **Composition API**

`setup()` + composables = código más limpio y reutilizable.

### 5. **Trabajo en Equipo**

Comunicación clara + estrategia MOCK = desarrollo paralelo sin bloqueos.

---

## 📈 Métricas del Sprint* **Archivos creados:** 7 (3 componentes, 1 service, 1 composable, 2 docs)

* **Archivos modificados:** 3 (CheckoutForm, router, package.json)
* **Commits atómicos:** 6 commits siguiendo convención del proyecto
* **Dependencias nuevas:** 1 (@mercadopago/sdk-js)
* **Tiempo de desarrollo:** ~2 días
* **Bloqueos por backend:** 0 (gracias a MOCK mode)


"Implementé el sistema completo de pagos con MercadoPago usando una estrategia de MOCK-first development. Esto me permitió desarrollar toda la UI, el flujo de usuario, y las 3 vistas de estado de pago sin esperar a que el backend estuviera listo.

 Creé un servicio con un simple switch que simula las respuestas del backend durante desarrollo. Cuando Developer 1 termine los endpoints, solo cambio `USE_MOCK = false` y todo se conecta automáticamente.

 La arquitectura está dividida en capas claras: Components para la UI, Composables para la lógica, y Services para las APIs. Esto hace el código más mantenible y testeable.

 Resultado: Frontend completo y funcional, listo para integrar con backend en minutos."
