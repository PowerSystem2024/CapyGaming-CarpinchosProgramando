# 🛒 Guía de Implementación: Sistema de Carrito, Pedidos y Mercado Pago

## 📋 Tabla de Contenidos
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Base de Datos](#base-de-datos)
5. [Backend - Endpoints](#backend---endpoints)
6. [Frontend - Componentes](#frontend---componentes)
7. [Flujo Completo del Usuario](#flujo-completo-del-usuario)
8. [Integración con Mercado Pago](#integración-con-mercado-pago)
9. [Testing](#testing)
10. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Resumen Ejecutivo

Se ha implementado un sistema completo de e-commerce con las siguientes funcionalidades:

✅ **Carrito de compras** sincronizado entre localStorage y base de datos
✅ **Sistema de pedidos** con tracking de estados
✅ **Integración con Mercado Pago** para pagos en línea
✅ **Autenticación JWT** para usuarios
✅ **Historial de pedidos** para clientes
✅ **Gestión de stock** automática

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
CapyGaming/
├── backend/
│   ├── config/
│   │   └── mercadopago.js          # Configuración de MP
│   ├── controllers/
│   │   ├── authController.js       # Login/Registro
│   │   ├── cartController.js       # Gestión del carrito
│   │   ├── orderController.js      # Gestión de pedidos
│   │   └── productController.js    # Productos
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js           # Rutas del carrito
│   │   ├── orderRoutes.js          # Rutas de pedidos
│   │   └── productRoutes.js
│   ├── middleware/
│   │   └── auth.js                 # Verificación JWT
│   ├── bd/
│   │   ├── pool.js                 # Conexión a PostgreSQL
│   │   └── schema.sql              # ⭐ NUEVO: Schema de BD
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── CheckoutFormIntegrated.vue    # ⭐ Checkout integrado
        │   ├── HistorialPedidos.vue          # ⭐ Historial
        │   ├── PagoExitoso.vue               # ⭐ Respuesta de pago
        │   ├── PagoFallido.vue               # ⭐ Respuesta de pago
        │   └── PagoPendiente.vue             # ⭐ Respuesta de pago
        ├── services/
        │   ├── authService.js
        │   ├── cartService.js                # ⭐ NUEVO: API del carrito
        │   └── orderService.js               # ⭐ NUEVO: API de pedidos
        ├── utils/
        │   └── cartUtils.js                  # ⭐ ACTUALIZADO: Con sync
        └── composables/
            └── useAuth.js                    # ⭐ ACTUALIZADO: Con sync
```

---

## 🚀 Instalación y Configuración

### Paso 1: Instalar dependencias del backend

```bash
cd backend
npm install mercadopago
```

### Paso 2: Configurar variables de entorno

Edita `backend/.env`:

```env
# Base de Datos
DB_USER=postgres
DB_HOST=localhost
DB_NAME=capygaming
DB_PASSWORD=admin
DB_PORT=5432

# JWT
JWT_SECRET=carpincho

# Servidor
PORT=3001

# Mercado Pago (obtener desde https://www.mercadopago.com.ar/developers/panel/app)
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui
MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui

# URLs de la aplicación
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

### Paso 3: Crear las tablas en la base de datos

Ejecuta el archivo `backend/bd/schema.sql` en PostgreSQL:

```bash
psql -U postgres -d capygaming -f backend/bd/schema.sql
```

O manualmente desde pgAdmin/psql:

```sql
-- Copiar y pegar el contenido de backend/bd/schema.sql
```

### Paso 4: Reiniciar el servidor

```bash
cd backend
npm run dev
```

### Paso 5: Verificar endpoints

Abre http://localhost:3001 en tu navegador. Deberías ver:

```json
{
  "message": "API de CapyGaming funcionando correctamente",
  "endpoints": {
    "auth": { ... },
    "cart": { ... },
    "orders": { ... }
  }
}
```

---

## 🗄️ Base de Datos

### Tablas Creadas

#### 1. `carrito`
Sincroniza el carrito entre dispositivos del usuario.

```sql
CREATE TABLE carrito (
    id_carrito SERIAL PRIMARY KEY,
    dni_usuario INTEGER NOT NULL REFERENCES usuario(dni),
    id_producto INTEGER NOT NULL REFERENCES producto(id_producto),
    cantidad INTEGER NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `pedido`
Almacena información general del pedido.

**Campos importantes:**
- `estado_pedido`: pendiente, pagado, procesando, enviado, entregado, cancelado
- `estado_pago`: pendiente, aprobado, rechazado, reembolsado
- `metodo_pago`: mercadopago, tarjeta, transferencia, efectivo
- `mp_preference_id`: ID de preferencia de Mercado Pago
- `mp_payment_id`: ID del pago en Mercado Pago
- `mp_status`: Estado recibido desde MP

#### 3. `detalle_pedido`
Almacena los productos del pedido (snapshot al momento de la compra).

**Importante:** Se guarda un snapshot del producto para mantener el historial incluso si el producto cambia de precio o se elimina.

---

## 🔌 Backend - Endpoints

### Carrito (`/api/carrito`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/carrito` | Obtener carrito del usuario | ✅ |
| POST | `/api/carrito` | Agregar producto al carrito | ✅ |
| PUT | `/api/carrito/:id_producto` | Actualizar cantidad | ✅ |
| DELETE | `/api/carrito/:id_producto` | Eliminar producto | ✅ |
| POST | `/api/carrito/sync` | Sincronizar desde localStorage | ✅ |
| DELETE | `/api/carrito` | Vaciar carrito completo | ✅ |

### Pedidos (`/api/pedidos`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/pedidos` | Crear nuevo pedido | ✅ |
| GET | `/api/pedidos` | Listar pedidos del usuario | ✅ |
| GET | `/api/pedidos/:id` | Obtener detalle de un pedido | ✅ |
| POST | `/api/pedidos/:id/cancelar` | Cancelar pedido | ✅ |
| POST | `/api/pedidos/webhook` | Webhook de Mercado Pago | ❌ |

---

## 💻 Frontend - Componentes

### Nuevos Componentes Creados

1. **`CheckoutFormIntegrated.vue`**
   - Formulario de checkout integrado con backend
   - Registro automático de usuarios
   - Integración con Mercado Pago
   - Uso: `<CheckoutFormIntegrated :isOpen="showCheckout" @close="showCheckout = false" />`

2. **`HistorialPedidos.vue`**
   - Lista de pedidos del usuario
   - Ver detalle de cada pedido
   - Cancelar pedidos pendientes
   - Ruta sugerida: `/pedidos`

3. **`PagoExitoso.vue`**
   - Página de confirmación de pago exitoso
   - Ruta: `/pago/exitoso?pedido=123`

4. **`PagoFallido.vue`**
   - Página cuando el pago falla
   - Ruta: `/pago/fallido?pedido=123`

5. **`PagoPendiente.vue`**
   - Página para pagos pendientes
   - Ruta: `/pago/pendiente?pedido=123`

### Servicios Nuevos

1. **`cartService.js`**
   - Comunicación con la API del carrito
   - Métodos: `getCart()`, `addToCart()`, `updateCartItem()`, `removeFromCart()`, `syncCart()`, `clearCart()`

2. **`orderService.js`**
   - Comunicación con la API de pedidos
   - Métodos: `createOrder()`, `getUserOrders()`, `getOrderById()`, `cancelOrder()`

### Utilidades Actualizadas

1. **`cartUtils.js`** - Ahora sincroniza con el backend automáticamente
2. **`useAuth.js`** - Sincroniza el carrito al login/registro

---

## 🔄 Flujo Completo del Usuario

### Escenario A: Usuario NO registrado

```
1. Usuario agrega productos al carrito
   └─> Se guarda en localStorage

2. Usuario hace clic en "Finalizar compra"
   └─> Se abre CheckoutFormIntegrated.vue

3. Paso 1: Completa datos personales
   └─> Se registra automáticamente
   └─> Se sincroniza carrito del localStorage con BD
   └─> Token JWT guardado

4. Paso 2: Completa dirección de envío

5. Paso 3: Selecciona método de envío

6. Paso 4: Selecciona método de pago
   └─> Si elige Mercado Pago:
       ├─> Se crea pedido en BD
       ├─> Se genera preferencia de pago en MP
       ├─> Se redirige a página de pago de MP
       └─> MP redirige de vuelta con resultado

   └─> Si elige otro método:
       ├─> Se crea pedido en BD
       ├─> Se reduce el stock
       └─> Se muestra confirmación
```

### Escenario B: Usuario YA registrado

```
1. Usuario agrega productos al carrito
   └─> Se guarda en localStorage Y en BD

2. Usuario hace clic en "Finalizar compra"
   └─> Se abre CheckoutFormIntegrated.vue
   └─> Paso 1 (registro) se omite
   └─> Comienza desde dirección de envío

3-6. Mismo flujo que el escenario A desde el paso 4
```

---

## 💳 Integración con Mercado Pago

### Configuración

1. **Crear una cuenta de desarrollador:**
   - Ir a https://www.mercadopago.com.ar/developers
   - Crear una aplicación
   - Obtener Access Token (de prueba y de producción)

2. **Configurar en `.env`:**
   ```env
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-XXXXXXXXXXXXXX
   MERCADOPAGO_PUBLIC_KEY=APP_USR-XXXXXXXXXXXXXX
   ```

3. **URLs de redirección:**
   - Exitoso: `http://localhost:5173/pago/exitoso?pedido={pedido_id}`
   - Fallido: `http://localhost:5173/pago/fallido?pedido={pedido_id}`
   - Pendiente: `http://localhost:5173/pago/pendiente?pedido={pedido_id}`

### Webhook para Notificaciones

El webhook está en:
```
POST http://localhost:3001/api/pedidos/webhook
```

**Para testing local con ngrok:**
```bash
ngrok http 3001
```

Luego configurar en Mercado Pago:
```
https://tu-subdominio.ngrok.io/api/pedidos/webhook
```

### Estados de Pago

Mercado Pago envía los siguientes estados:

| Estado MP | Nuestro estado_pago | Nuestro estado_pedido |
|-----------|---------------------|----------------------|
| `approved` | `aprobado` | `pagado` |
| `pending` | `pendiente` | `pendiente` |
| `rejected` | `rechazado` | `cancelado` |
| `refunded` | `reembolsado` | `cancelado` |

---

## 🧪 Testing

### 1. Probar Registro y Login

```bash
# Registrar usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@test.com",
    "password": "123456",
    "dni": "12345678",
    "telefono": "1234567890"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@test.com",
    "password": "123456"
  }'
```

### 2. Probar Carrito

```bash
# Agregar producto al carrito (requiere token)
curl -X POST http://localhost:3001/api/carrito \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "id_producto": 1,
    "cantidad": 2
  }'

# Obtener carrito
curl -X GET http://localhost:3001/api/carrito \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 3. Probar Creación de Pedido

```bash
curl -X POST http://localhost:3001/api/pedidos \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_envio": "Juan",
    "apellido_envio": "Pérez",
    "direccion_envio": "Av. Corrientes 1234",
    "ciudad_envio": "Buenos Aires",
    "provincia_envio": "CABA",
    "codigo_postal_envio": "1043",
    "telefono_envio": "1234567890",
    "nombre_facturacion": "Juan",
    "apellido_facturacion": "Pérez",
    "direccion_facturacion": "Av. Corrientes 1234",
    "ciudad_facturacion": "Buenos Aires",
    "provincia_facturacion": "CABA",
    "codigo_postal_facturacion": "1043",
    "metodo_envio": "standard",
    "costo_envio": 5000,
    "comentarios": "",
    "subtotal": 50000,
    "descuento": 0,
    "total": 55000,
    "metodo_pago": "mercadopago",
    "items": [
      {
        "id_producto": 1,
        "cantidad": 2
      }
    ]
  }'
```

### 4. Testing con Mercado Pago (Sandbox)

Usar tarjetas de prueba:
- **Aprobada:** 5031 7557 3453 0604
- **Rechazada:** 5031 4332 1540 6351

CVV: 123
Vencimiento: cualquier fecha futura
Titular: APRO (aprobada) o OTHE (rechazada)

---

## 📝 Próximos Pasos

### Funcionalidades Pendientes

1. **Rutas en Vue Router**
   ```javascript
   // Agregar en frontend/src/router/index.js
   {
     path: '/pedidos',
     name: 'Pedidos',
     component: () => import('../components/HistorialPedidos.vue'),
     meta: { requiresAuth: true }
   },
   {
     path: '/pago/exitoso',
     name: 'PagoExitoso',
     component: () => import('../components/PagoExitoso.vue')
   },
   {
     path: '/pago/fallido',
     name: 'PagoFallido',
     component: () => import('../components/PagoFallido.vue')
   },
   {
     path: '/pago/pendiente',
     name: 'PagoPendiente',
     component: () => import('../components/PagoPendiente.vue')
   }
   ```

2. **Notificaciones por Email**
   - Confirmar pedido creado
   - Notificar cambio de estado
   - Enviar comprobante de pago

3. **Panel de Administración**
   - Ver todos los pedidos
   - Cambiar estados manualmente
   - Gestionar stock

4. **Mejoras de UX**
   - Loading states más elaborados
   - Toast notifications en lugar de alerts
   - Animaciones de transición

5. **Seguridad**
   - Rate limiting en endpoints
   - Validar firma de webhook de MP
   - Sanitizar inputs

---

## 🐛 Troubleshooting

### Error: "No se puede conectar a la base de datos"
- Verificar que PostgreSQL esté corriendo
- Revisar credenciales en `.env`
- Ejecutar `psql -U postgres -l` para ver bases de datos

### Error: "Token inválido"
- Verificar que el token no haya expirado (24h)
- Revisar que `JWT_SECRET` sea el mismo en `.env`

### Error: "Stock insuficiente"
- Verificar stock disponible en la BD
- Actualizar stock: `UPDATE producto SET stock = 100 WHERE id_producto = 1;`

### Mercado Pago no redirige
- Verificar que las URLs en `.env` sean correctas
- Probar con ngrok para webhooks
- Revisar logs del backend

---

## 📞 Soporte

Si tienes dudas o encuentras problemas:

1. Revisa los logs del backend: `console.log` en los controladores
2. Revisa la consola del navegador (F12)
3. Verifica que todas las tablas fueron creadas correctamente
4. Asegúrate de que el token JWT sea válido

---

## ✅ Checklist de Implementación

- [ ] Base de datos creada (`schema.sql` ejecutado)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo sin errores
- [ ] Registro de usuario funcional
- [ ] Login funcional
- [ ] Agregar productos al carrito funciona
- [ ] Sincronización carrito localStorage ↔ BD funciona
- [ ] Crear pedido funciona
- [ ] Integración con Mercado Pago configurada
- [ ] Rutas de respuesta de pago agregadas al router
- [ ] Historial de pedidos muestra datos correctos
- [ ] Webhook de Mercado Pago responde correctamente

---

## 🎉 ¡Listo!

Tu sistema de carrito, pedidos y pagos está completo. Ahora puedes:

✅ Recibir pedidos de clientes
✅ Procesar pagos con Mercado Pago
✅ Gestionar el stock automáticamente
✅ Ofrecer múltiples métodos de pago
✅ Permitir que los usuarios vean su historial

**¡Éxito con CapyGaming! 🎮🛒💳**
