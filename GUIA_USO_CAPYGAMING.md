# 🎮 GUÍA COMPLETA - CAPYGAMING

## ✅ ESTADO ACTUAL: TODO FUNCIONANDO

### 🟢 Servicios Funcionando:

- **Backend**: http://localhost:3001 ✅
- **Frontend**: http://localhost:5173
- **Base de datos**: PostgreSQL ✅
- **APIs**: Todas funcionando ✅

---

## 🚀 CÓMO INICIAR EL PROYECTO

### 1️⃣ Iniciar el Backend (YA ESTÁ CORRIENDO)

```bash
cd backend
node server.js
```

✅ **El backend YA ESTÁ funcionando en puerto 3001**

### 2️⃣ Iniciar el Frontend

```bash
cd frontend
npm run dev
```

Abrirá en: http://localhost:5173

---

## 📋 FUNCIONALIDADES DISPONIBLES

### ✅ FUNCIONANDO AHORA MISMO:

#### 1. REGISTRO DE USUARIOS

- Ve a "Iniciar Sesión" → "Registrarse"
- Campos requeridos:
  - DNI (8 dígitos)
  - Nombre
  - Apellido
  - Email
  - Contraseña (mínimo 6 caracteres - campo se llama "password" en el backend)
  - Teléfono
  - Dirección

#### 2. LOGIN

- Email + Contraseña
- Genera JWT token
- Guarda sesión en localStorage

#### 3. CATÁLOGO DE PRODUCTOS

- 88 productos disponibles
- Filtros por categoría
- Búsqueda
- Vista de detalles

#### 4. CARRITO DE COMPRAS

- Agregar/quitar productos
- Modificar cantidades
- Persistencia en localStorage
- Cálculo de totales

#### 5. CHECKOUT (4 PASOS)

- **Paso 1**: Datos personales
- **Paso 2**: Dirección de envío
- **Paso 3**: Método de envío
- **Paso 4**: Método de pago

#### 6. MÉTODOS DE PAGO

- ✅ MercadoPago (configurado y funcionando)
- ✅ Efectivo
- ✅ Transferencia bancaria
- ✅ Tarjeta (instrucciones)

---

## 🛒 FLUJO DE COMPRA COMPLETO

### Para hacer una compra de prueba:

1. **Agrega productos al carrito**
2. **Ve al carrito** (ícono en el navbar)
3. **Click en "Proceder al pago"**
4. **Completa el checkout con estos datos de prueba:**

```
DNI: 12345678
Nombre: Test
Apellido: Usuario
Email: test@test.com
Contraseña: password123
Teléfono: 1112345678

Dirección: Av. Corrientes 1234
Ciudad: Buenos Aires
Código Postal: 1043
Provincia: Buenos Aires
```

5. **Selecciona método de pago**:
   - Si eliges **MercadoPago** → Te redirige al checkout de MP
   - Si eliges otros → Muestra instrucciones

---

## 💳 MERCADOPAGO - TARJETAS DE PRUEBA

### Para APROBAR el pago:

- **Número**: 5031 7557 3453 0604
- **CVV**: 123
- **Vencimiento**: 11/25
- **Nombre**: APRO
- **DNI**: 12345678

### Para RECHAZAR el pago:

- Mismo número pero **Nombre**: TEST

---

## 📂 ESTRUCTURA DEL PROYECTO

```
CapyGaming/
├── backend/
│   ├── server.js (servidor principal) ✅
│   ├── routes/
│   │   ├── authRoutes.js ✅
│   │   ├── productRoutes.js ✅
│   │   ├── orderRoutes.js ✅
│   │   └── mercadopagoRoutes.js ✅
│   └── .env (variables de entorno)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CheckoutForm.vue ✅
│   │   │   ├── CarritoModal.vue ✅
│   │   │   └── productos.vue ✅
│   │   └── views/
│   │       ├── OrderConfirmation.vue ✅
│   │       ├── PaymentSuccess.vue ✅
│   │       ├── PaymentFailure.vue ✅
│   │       └── PaymentPending.vue ✅
│   └── package.json
```

---

## 📝 USUARIOS DE PRUEBA EN LA BD

```sql
DNI: 12345678 - test@test.com
DNI: 99999999 - prueba@test.com (recién creado)
```

---
