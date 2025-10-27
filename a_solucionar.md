# 🔧 Lista de Problemas a Solucionar - MercadoPago Integration

**Fecha:** 2025-10-23
**Branch:** `feature/CAPY-MP-001-mercadopago-integration`
**Estado:** Contratos rotos entre Frontend y Backend

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### **Problema #1: URLs no coinciden (CRÍTICO - Bloquea funcionalidad)**

**Frontend envía peticiones a:**
```javascript
POST /api/mercadopago/create-preference   ❌ NO EXISTE
GET /api/mercadopago/payment/:id          ❌ NO EXISTE
```

**Backend escucha en:**
```javascript
POST /api/pagos/crear-preferencia         ✅ EXISTE
GET /api/pagos/estado/:orderId            ✅ EXISTE
```

**Resultado actual:**
Frontend obtiene **404 Not Found** al intentar crear preferencias de pago.

**Impacto:**
🔥 **CRÍTICO** - La integración de MercadoPago no funciona en absoluto.

---

### **Problema #2: Parámetro incorrecto en consulta de estado (CRÍTICO)**

**Frontend usa:** `paymentId` (ID que genera MercadoPago DESPUÉS de realizar el pago)
**Backend espera:** `orderId` (ID interno de la orden generado al crear la preferencia)

**Resultado actual:**
Aunque se arregle la URL, el endpoint no puede encontrar la orden porque busca con el ID equivocado.

**Impacto:**
🔥 **CRÍTICO** - No se puede consultar el estado de pagos.

---

### **Problema #3: Falta testing de MercadoPago (ALTO)**

**Archivos de testing existentes:**
- ✅ `testing/scripts/test-auth-endpoints.js`
- ✅ `testing/scripts/test-products-endpoints.js`
- ❌ `testing/scripts/test-mercadopago-endpoints.js` **NO EXISTE**

**Impacto:**
⚠️ **ALTO** - No hay forma de validar automáticamente que los endpoints funcionen correctamente.

---

### **Problema #4: Información faltante en request (MEDIO)**

**Frontend envía:**
```javascript
{
  items: [{ id, title, quantity, unit_price, picture_url }],
  payer: { name, surname, email, dni }
}
```

**Backend espera (campos opcionales):**
```javascript
{
  items: [{ ..., description }],  // description es opcional
  payer: { ..., phone, identification }  // phone es opcional
}
```

**Impacto:**
⚠️ **MEDIO** - Funciona pero no está optimizado. MercadoPago usa estos campos para mejorar la experiencia.

---

## ✅ SOLUCIONES PASO A PASO

### **SOLUCIÓN 1: Corregir URLs en Frontend**

**Archivo:** `frontend/src/services/mercadopagoService.js`

#### Cambio 1: Endpoint de crear preferencia

**Busca la línea ~30:**
```javascript
const response = await fetch(`${API_BASE}/mercadopago/create-preference`, {
```

**Cámbiala a:**
```javascript
const response = await fetch(`${API_BASE}/pagos/crear-preferencia`, {
```

#### Cambio 2: Endpoint de consultar estado

**Busca la línea ~74:**
```javascript
const response = await fetch(`${API_BASE}/mercadopago/payment/${paymentId}`, {
```

**Cámbiala a:**
```javascript
const response = await fetch(`${API_BASE}/pagos/estado/${orderId}`, {
```

#### Cambio 3: Renombrar parámetro de función

**Busca:**
```javascript
async getPaymentStatus(paymentId) {
```

**Cámbiala a:**
```javascript
async getPaymentStatus(orderId) {
```

**Y dentro de la función, cambia todas las referencias:**
```javascript
// Antes:
console.log('Obteniendo estado del pago:', paymentId);

// Después:
console.log('Obteniendo estado del pago:', orderId);
```

---

### **SOLUCIÓN 2: Ajustar usePayment.js para usar orderId**

**Archivo:** `frontend/src/composables/usePayment.js`

#### Cambio 1: Guardar orderId después de crear preferencia

**En la función `processPayment`, después de recibir la respuesta:**

```javascript
const response = await mercadopagoService.createPreference(orderData);

if (response.success && response.initPoint) {
  // ⭐ AGREGAR ESTA LÍNEA:
  localStorage.setItem('currentOrderId', response.orderId);

  console.log('Preferencia creada:', response);

  // Limpiar carrito
  clearCart();

  // Redirigir a MercadoPago
  window.location.href = response.initPoint;
}
```

#### Cambio 2: Actualizar checkPaymentStatus

**Busca:**
```javascript
async function checkPaymentStatus(paymentId) {
  // ...
  const status = await mercadopagoService.getPaymentStatus(paymentId);
  // ...
}
```

**Cámbiala a:**
```javascript
async function checkPaymentStatus(orderId) {
  try {
    loading.value = true;
    error.value = null;

    console.log('Consultando estado del pago, orderId:', orderId);
    const status = await mercadopagoService.getPaymentStatus(orderId);

    paymentStatus.value = status;
    return status;
  } catch (err) {
    error.value = err.message || 'Error al consultar el estado del pago';
    console.error('Error en checkPaymentStatus:', err);
    throw err;
  } finally {
    loading.value = false;
  }
}
```

#### Cambio 3: Agregar campo description a items

**En la función `processPayment`, al mapear los items:**

```javascript
const orderData = {
  items: cartItems.map(item => ({
    id: item.id.toString(),
    title: item.nombre,
    quantity: item.quantity,
    unit_price: parseFloat(item.precio),
    picture_url: item.imagen || '',
    description: item.descripcion || item.nombre  // ← AGREGAR ESTA LÍNEA
  })),
  payer: {
    name: formData.nombre,
    surname: formData.apellidos,
    email: formData.email,
    dni: formData.dni || null,
    // OPCIONAL: Si tienes teléfono en el formulario:
    phone: {
      area_code: formData.codigoArea || '',
      number: formData.telefono || ''
    }
  }
};
```

---

### **SOLUCIÓN 3: Actualizar componentes de estado de pago**

**Archivos:**
- `frontend/src/components/PaymentSuccess.vue`
- `frontend/src/components/PaymentFailure.vue`
- `frontend/src/components/PaymentPending.vue`

#### En cada componente, modificar el `onMounted`:

```vue
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePayment } from '@/composables/usePayment';

const router = useRouter();
const { checkPaymentStatus, loading } = usePayment();
const paymentInfo = ref(null);

onMounted(async () => {
  // ⭐ CAMBIO: Leer orderId de localStorage en lugar de paymentId de URL
  const orderId = localStorage.getItem('currentOrderId');

  if (orderId) {
    try {
      // Consultar estado del pago con orderId
      const status = await checkPaymentStatus(orderId);
      paymentInfo.value = status;

      // Opcional: Limpiar localStorage después de consultar
      localStorage.removeItem('currentOrderId');
    } catch (error) {
      console.error('Error al verificar pago:', error);
    }
  }
});

const volverHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="payment-success">
    <h1>¡Pago Exitoso! ✅</h1>

    <div v-if="loading">
      <p>Verificando pago...</p>
    </div>

    <div v-else-if="paymentInfo">
      <p><strong>Orden ID:</strong> {{ paymentInfo.orderId }}</p>
      <p><strong>Estado:</strong> {{ paymentInfo.status }}</p>
      <p><strong>Monto:</strong> ${{ paymentInfo.transactionAmount }}</p>
    </div>

    <button @click="volverHome">Volver al inicio</button>
  </div>
</template>
```

---

### **SOLUCIÓN 4: Crear archivo de testing**

**Archivo NUEVO:** `testing/scripts/test-mercadopago-endpoints.js`

```javascript
/**
 * Script de Testing para Endpoints de MercadoPago
 *
 * Archivo: testing/scripts/test-mercadopago-endpoints.js
 * Propósito: Validar integración de MercadoPago con backend
 * Developer: Developer 3 (Testing) - CapyGaming Team
 */

const API_BASE_URL = 'http://localhost:3001';

class MercadoPagoTester {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
    this.testOrderId = null; // Guardar para tests secuenciales
  }

  /**
   * Ejecuta un test individual
   */
  async runTest(name, testFn) {
    this.results.total++;
    console.log(`\n🧪 Test: ${name}`);

    try {
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASS', error: null });
      console.log(`✅ PASS: ${name}`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAIL', error: error.message });
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Error: ${error.message}`);
    }
  }

  /**
   * Test 1: Crear preferencia exitosamente
   */
  async testCreatePreferenceSuccess() {
    const response = await fetch(`${API_BASE_URL}/api/pagos/crear-preferencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          {
            id: '1',
            title: 'Cyberpunk 2077',
            quantity: 1,
            unit_price: 5999.99,
            picture_url: 'https://example.com/img.jpg',
            description: 'Video game'
          }
        ],
        payer: {
          name: 'Juan',
          surname: 'Perez',
          email: 'juan@test.com',
          dni: 12345678,
          phone: {
            area_code: '11',
            number: '1234567890'
          }
        }
      })
    });

    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    if (!data.success) {
      throw new Error('Response success should be true');
    }

    if (!data.preferenceId) {
      throw new Error('Missing preferenceId in response');
    }

    if (!data.initPoint) {
      throw new Error('Missing initPoint in response');
    }

    if (!data.orderId) {
      throw new Error('Missing orderId in response');
    }

    // Guardar orderId para siguientes tests
    this.testOrderId = data.orderId;

    console.log(`   Preference ID: ${data.preferenceId}`);
    console.log(`   Order ID: ${data.orderId}`);
  }

  /**
   * Test 2: Crear preferencia sin items (debe fallar)
   */
  async testCreatePreferenceMissingItems() {
    const response = await fetch(`${API_BASE_URL}/api/pagos/crear-preferencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [], // Array vacío
        payer: {
          name: 'Juan',
          surname: 'Perez',
          email: 'juan@test.com',
          dni: 12345678
        }
      })
    });

    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`);
    }

    const data = await response.json();
    if (!data.error) {
      throw new Error('Expected error message in response');
    }

    console.log(`   Error esperado: ${data.error}`);
  }

  /**
   * Test 3: Crear preferencia sin payer (debe fallar)
   */
  async testCreatePreferenceMissingPayer() {
    const response = await fetch(`${API_BASE_URL}/api/pagos/crear-preferencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          {
            id: '1',
            title: 'Test Product',
            quantity: 1,
            unit_price: 100
          }
        ]
        // payer faltante
      })
    });

    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`);
    }

    console.log(`   Validación funcionó correctamente`);
  }

  /**
   * Test 4: Consultar estado de orden existente
   */
  async testGetPaymentStatusSuccess() {
    if (!this.testOrderId) {
      throw new Error('No hay orderId de test anterior. Ejecuta testCreatePreferenceSuccess primero.');
    }

    const response = await fetch(`${API_BASE_URL}/api/pagos/estado/${this.testOrderId}`);

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('Response success should be true');
    }

    if (data.orderId !== this.testOrderId) {
      throw new Error(`OrderId mismatch: expected ${this.testOrderId}, got ${data.orderId}`);
    }

    console.log(`   Order ID: ${data.orderId}`);
    console.log(`   Status: ${data.status}`);
  }

  /**
   * Test 5: Consultar estado de orden inexistente
   */
  async testGetPaymentStatusNotFound() {
    const fakeOrderId = 'ORDEN-INEXISTENTE-12345';
    const response = await fetch(`${API_BASE_URL}/api/pagos/estado/${fakeOrderId}`);

    if (response.status !== 404) {
      throw new Error(`Expected 404, got ${response.status}`);
    }

    const data = await response.json();
    if (!data.error) {
      throw new Error('Expected error message');
    }

    console.log(`   Error esperado: ${data.error}`);
  }

  /**
   * Test 6: Webhook básico (sin validación de firma en DEV)
   */
  async testWebhookBasic() {
    const response = await fetch(`${API_BASE_URL}/api/webhooks/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': 'test-request-id-' + Date.now()
      },
      body: JSON.stringify({
        type: 'payment',
        data: {
          id: '12345678901'
        }
      })
    });

    if (response.status !== 200) {
      throw new Error(`Expected 200, got ${response.status}`);
    }

    const data = await response.json();
    if (!data.received) {
      throw new Error('Webhook should return {received: true}');
    }

    console.log(`   Webhook procesado correctamente`);
  }

  /**
   * Ejecutar todos los tests
   */
  async runAll() {
    console.log('🚀 Iniciando Tests de MercadoPago');
    console.log('=====================================\n');

    // Tests en orden (algunos dependen de otros)
    await this.runTest('Crear preferencia exitosamente', () => this.testCreatePreferenceSuccess());
    await this.runTest('Crear preferencia sin items (validación)', () => this.testCreatePreferenceMissingItems());
    await this.runTest('Crear preferencia sin payer (validación)', () => this.testCreatePreferenceMissingPayer());
    await this.runTest('Consultar estado de orden existente', () => this.testGetPaymentStatusSuccess());
    await this.runTest('Consultar estado de orden inexistente', () => this.testGetPaymentStatusNotFound());
    await this.runTest('Recibir webhook básico', () => this.testWebhookBasic());

    this.printSummary();
  }

  /**
   * Imprimir resumen
   */
  printSummary() {
    console.log('\n=====================================');
    console.log('📊 RESUMEN DE TESTS');
    console.log('=====================================');
    console.log(`Total:  ${this.results.total}`);
    console.log(`✅ Pass: ${this.results.passed}`);
    console.log(`❌ Fail: ${this.results.failed}`);
    console.log('=====================================\n');

    if (this.results.failed > 0) {
      console.log('Tests fallidos:');
      this.results.tests
        .filter(t => t.status === 'FAIL')
        .forEach(t => {
          console.log(`  - ${t.name}: ${t.error}`);
        });
    }

    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(2);
    console.log(`\nTasa de éxito: ${successRate}%\n`);
  }
}

// Ejecutar tests
const tester = new MercadoPagoTester();
tester.runAll().catch(error => {
  console.error('Error fatal en testing:', error);
  process.exit(1);
});
```

---

## 📋 CHECKLIST DE SOLUCIONES

### Frontend

- [ ] **Archivo:** `frontend/src/services/mercadopagoService.js`
  - [ ] Cambiar URL: `/api/mercadopago/create-preference` → `/api/pagos/crear-preferencia`
  - [ ] Cambiar URL: `/api/mercadopago/payment/:id` → `/api/pagos/estado/:orderId`
  - [ ] Renombrar parámetro: `paymentId` → `orderId`

- [ ] **Archivo:** `frontend/src/composables/usePayment.js`
  - [ ] Guardar `orderId` en localStorage después de crear preferencia
  - [ ] Cambiar parámetro de `checkPaymentStatus(paymentId)` a `checkPaymentStatus(orderId)`
  - [ ] Agregar campo `description` a items
  - [ ] (Opcional) Agregar campo `phone` a payer si está disponible

- [ ] **Archivo:** `frontend/src/components/PaymentSuccess.vue`
  - [ ] Leer `orderId` de localStorage en `onMounted`
  - [ ] Llamar `checkPaymentStatus(orderId)` con orderId

- [ ] **Archivo:** `frontend/src/components/PaymentFailure.vue`
  - [ ] Leer `orderId` de localStorage en `onMounted`
  - [ ] Llamar `checkPaymentStatus(orderId)` con orderId

- [ ] **Archivo:** `frontend/src/components/PaymentPending.vue`
  - [ ] Leer `orderId` de localStorage en `onMounted`
  - [ ] Llamar `checkPaymentStatus(orderId)` con orderId

### Testing

- [ ] **Archivo NUEVO:** `testing/scripts/test-mercadopago-endpoints.js`
  - [ ] Crear archivo con clase `MercadoPagoTester`
  - [ ] Implementar 6 tests (crear preferencia, validaciones, consultar estado, webhook)
  - [ ] Ejecutar y verificar que todos pasen

---

## 🚀 COMANDOS PARA TESTING

### 1. Levantar backend
```bash
cd backend
docker-compose up -d
```

### 2. Verificar que backend esté corriendo
```bash
docker logs -f capygaming-backend
```

### 3. Ejecutar tests de MercadoPago
```bash
cd testing/scripts
node test-mercadopago-endpoints.js
```

### 4. Ejecutar frontend en desarrollo
```bash
cd frontend
npm run dev
```

---

## 📝 COMMITS SUGERIDOS

Después de realizar los cambios, commitear en el siguiente orden:

### Commit 1: Fix frontend mercadopago URLs
```bash
git add frontend/src/services/mercadopagoService.js
git commit -m "fix(payment): alinear URLs de mercadopago con backend

Cambiar endpoints del frontend para coincidir con rutas del backend:
- /api/mercadopago/create-preference → /api/pagos/crear-preferencia
- /api/mercadopago/payment/:id → /api/pagos/estado/:orderId
- Usar orderId en lugar de paymentId para consultas

Files:
- frontend/src/services/mercadopagoService.js

Developer: Developer 2 (Frontend)"
```

### Commit 2: Fix payment composable
```bash
git add frontend/src/composables/usePayment.js
git commit -m "fix(payment): usar orderId en flujo de pago

Guardar orderId en localStorage después de crear preferencia.
Cambiar checkPaymentStatus para usar orderId en lugar de paymentId.
Agregar campo description a items del pedido.

Files:
- frontend/src/composables/usePayment.js

Developer: Developer 2 (Frontend)"
```

### Commit 3: Fix payment status components
```bash
git add frontend/src/components/PaymentSuccess.vue
git add frontend/src/components/PaymentFailure.vue
git add frontend/src/components/PaymentPending.vue
git commit -m "fix(payment): actualizar componentes de estado para usar orderId

Modificar componentes de estado de pago para leer orderId de localStorage
en lugar de paymentId de URL params.

Files:
- frontend/src/components/PaymentSuccess.vue
- frontend/src/components/PaymentFailure.vue
- frontend/src/components/PaymentPending.vue

Developer: Developer 2 (Frontend)"
```

### Commit 4: Add mercadopago testing
```bash
git add testing/scripts/test-mercadopago-endpoints.js
git commit -m "test(mercadopago): agregar testing de endpoints

Crear script de testing para validar integración con MercadoPago.
Tests incluidos:
- Crear preferencia exitosamente
- Validación de items vacíos
- Validación de payer faltante
- Consultar estado de orden existente
- Consultar estado de orden inexistente
- Webhook básico

Files:
- testing/scripts/test-mercadopago-endpoints.js

Developer: Developer 3 (Testing)"
```

---

## 🔍 VALIDACIÓN FINAL

Después de hacer todos los cambios, validar:

### 1. Testing Backend
```bash
cd testing/scripts
node test-mercadopago-endpoints.js
```
**Resultado esperado:** 6/6 tests passed

### 2. Testing Manual Frontend
1. Levantar frontend: `npm run dev`
2. Agregar productos al carrito
3. Ir a checkout
4. Llenar formulario
5. Click "Finalizar compra"
6. **Verificar:** Redirige a MercadoPago (sandbox)
7. Completar pago de prueba
8. **Verificar:** Redirige a `/payment/success` con información correcta

### 3. Verificar localStorage
En DevTools → Application → Local Storage:
- Debe aparecer `currentOrderId` con formato `ORDEN-XXXXXX`
- Después de consultar estado, debe eliminarse

### 4. Verificar Base de Datos
```sql
-- Ver órdenes creadas
SELECT * FROM orden_pago ORDER BY fecha_creacion DESC LIMIT 5;

-- Ver pagos asociados
SELECT * FROM pago_mercadopago ORDER BY fecha_creacion DESC LIMIT 5;

-- Ver items de última orden
SELECT * FROM item_orden WHERE id_orden = (SELECT id_orden FROM orden_pago ORDER BY fecha_creacion DESC LIMIT 1);
```

---

## 📊 ARQUITECTURA COMPLETA (Referencia)

### Flujo Completo de Pago

```
1. Usuario en CheckoutForm.vue
   ↓
2. Click "Finalizar compra" → procesarPago()
   ↓
3. usePayment.processPayment(formData)
   ↓
4. mercadopagoService.createPreference(orderData)
   ↓
5. POST /api/pagos/crear-preferencia ✅
   ↓
6. Backend crea:
   - Registro en tabla orden_pago
   - Registros en tabla item_orden
   - Registro en tabla pago_mercadopago (con preference_id)
   ↓
7. Backend responde: { success, preferenceId, initPoint, orderId }
   ↓
8. Frontend guarda orderId en localStorage
   ↓
9. Frontend redirige a initPoint (MercadoPago)
   ↓
10. Usuario paga en MercadoPago
   ↓
11. MercadoPago redirige a /payment/success?collection_id=xxx
   ↓
12. MercadoPago envía webhook a POST /api/webhooks/webhook
   ↓
13. Backend actualiza estado en pago_mercadopago
   ↓
14. PaymentSuccess.vue consulta: GET /api/pagos/estado/:orderId ✅
   ↓
15. Muestra estado actualizado al usuario
```

### Endpoints Backend

| Método | Ruta | Función | Estado |
|--------|------|---------|--------|
| POST | `/api/pagos/crear-preferencia` | Crear preferencia de pago | ✅ Implementado |
| GET | `/api/pagos/estado/:orderId` | Consultar estado de orden | ✅ Implementado |
| POST | `/api/webhooks/webhook` | Recibir notificaciones de MP | ✅ Implementado |

### Tablas de Base de Datos

| Tabla | Función | Estado |
|-------|---------|--------|
| `orden_pago` | Almacenar órdenes | ✅ Creada |
| `item_orden` | Items de cada orden | ✅ Creada |
| `pago_mercadopago` | Datos de pago de MP | ✅ Creada |
| `webhook_evento` | Log de webhooks | ✅ Creada |

---

## 🎯 PRÓXIMOS PASOS (Después de solucionar)

### 1. Testing Completo
- [ ] Ejecutar tests automatizados
- [ ] Testing manual end-to-end
- [ ] Validar webhooks en entorno de desarrollo

### 2. Pull Request
- [ ] Push de todos los commits
- [ ] Crear PR a `main`
- [ ] Code review con Developer 1 y 3

### 3. Integración a Main
- [ ] Merge después de aprobación
- [ ] Actualizar documentación final
- [ ] Marcar feature como completado

---

## 📚 ARCHIVOS DE REFERENCIA

### Documentación del Proyecto
- `CLAUDE.md` - Contexto completo del proyecto
- `contexto.md` - Plan de implementación MercadoPago
- `context2.md` - Estrategia de commits colaborativa
- `mercadopagofeature.md` - Documentación de arquitectura frontend

### Archivos Backend Clave
- `backend/controllers/mercadopagoController.js` (275 líneas)
- `backend/routes/mercadopagoRoutes.js` (119 líneas)
- `backend/services/mercadopagoService.js` (146 líneas)
- `backend/middleware/mercadopagoValidation.js` (173 líneas)
- `backend/middleware/webhookSecurity.js` (149 líneas)
- `backend/bd/mercadopago-tables.sql` (64 líneas)

### Archivos Frontend Clave
- `frontend/src/services/mercadopagoService.js` (93 líneas) **← MODIFICAR**
- `frontend/src/composables/usePayment.js` (83 líneas) **← MODIFICAR**
- `frontend/src/components/CheckoutForm.vue` (400+ líneas)
- `frontend/src/components/PaymentSuccess.vue` **← MODIFICAR**
- `frontend/src/components/PaymentFailure.vue` **← MODIFICAR**
- `frontend/src/components/PaymentPending.vue` **← MODIFICAR**

### Testing
- `testing/scripts/test-auth-endpoints.js` (referencia de patrón)
- `testing/scripts/test-mercadopago-endpoints.js` **← CREAR**
- `testing/standards/testing-standards.md` (estándares)

---

## ⚠️ NOTAS IMPORTANTES

### Coordinación con Developers

**Developer 1 (Backend):**
- ✅ Ya implementó todos los endpoints necesarios
- ✅ Base de datos está completa
- No requiere cambios en backend

**Developer 2 (Frontend - TÚ):**
- ⚠️ Debes corregir URLs en tu código
- ⚠️ Debes ajustar manejo de orderId vs paymentId
- Es tu responsabilidad hacer estos cambios

**Developer 3 (Testing):**
- ❌ Falta crear script de testing
- Puede crearlo después de que Developer 2 corrija frontend

### Testing en Sandbox

Recuerda que estás usando credenciales de TEST de MercadoPago:
- Usa tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/testing/test-cards
- Todas las transacciones son simuladas
- No se cobra dinero real

### Variables de Entorno

Asegúrate de tener configurado:

**Backend `.env`:**
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-8676695061727804-...
MERCADOPAGO_PUBLIC_KEY=TEST-d4f7a3b0-...
MERCADOPAGO_WEBHOOK_SECRET=tu-secret-aqui
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3001
```

---

**Última actualización:** 2025-10-23
**Creado por:** Developer 2 (Frontend) con ayuda de Claude
**Estado:** Pendiente de implementación
**Prioridad:** CRÍTICA - Bloquea funcionalidad de pagos

---

## ✅ RESULTADO ESPERADO

Después de implementar todas las soluciones:

✅ Frontend puede crear preferencias de pago correctamente
✅ Frontend puede consultar estado de órdenes
✅ Webhooks de MercadoPago funcionan
✅ Testing automatizado pasa 6/6 tests
✅ Flujo end-to-end funciona completamente
✅ Integración de MercadoPago lista para producción

---

¡Cualquier duda durante la implementación, consulta este documento!