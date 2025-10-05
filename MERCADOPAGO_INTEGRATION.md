# Integración con Mercado Pago - CapyGaming

## Resumen de la implementación

Esta documentación describe la integración completa con Mercado Pago y el sistema de carrito persistente implementado en CapyGaming.

## Características implementadas

### 1. Carrito persistente en base de datos
- ✅ Los carritos se guardan en PostgreSQL cuando el usuario está autenticado
- ✅ Fallback a localStorage para usuarios no autenticados
- ✅ Sincronización automática al hacer login
- ✅ API completa para manejo de carrito (CRUD)

### 2. Sistema de pedidos y pagos
- ✅ Creación de pedidos en base de datos
- ✅ Integración con Mercado Pago SDK
- ✅ Generación de preferencias de pago
- ✅ Webhook para notificaciones de pago
- ✅ Tracking de estados de pedido

### 3. Interfaz de usuario mejorada
- ✅ Checkout flow integrado con MP
- ✅ Páginas de resultado de pago
- ✅ Visualización de estado de pedidos
- ✅ Historial de pedidos

## Estructura de base de datos

### Tablas creadas:

1. **carrito**: Almacena items del carrito por usuario
2. **pedido**: Información principal de pedidos
3. **pedido_item**: Items específicos de cada pedido
4. **pedido_historial**: Historial de cambios de estado

## Endpoints de API

### Carrito (requieren autenticación)
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar producto al carrito
- `PUT /api/cart` - Actualizar cantidad de producto
- `DELETE /api/cart/:producto_id` - Eliminar producto del carrito
- `DELETE /api/cart` - Vaciar carrito completo
- `POST /api/cart/sync` - Sincronizar carrito local con BD

### Pagos y pedidos
- `POST /api/payments/create-preference` - Crear preferencia de MP (requiere auth)
- `POST /api/payments/webhook` - Webhook de MP (no requiere auth)
- `GET /api/payments/order/:orderId` - Estado del pedido (requiere auth)
- `GET /api/payments/orders` - Todos los pedidos del usuario (requiere auth)

## Configuración requerida

### Variables de entorno (.env)
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=capygaming
DB_USER=postgres
DB_PASSWORD=admin

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# URLs
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:3001

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=YOUR_MERCADOPAGO_ACCESS_TOKEN_HERE
MERCADOPAGO_PUBLIC_KEY=YOUR_MERCADOPAGO_PUBLIC_KEY_HERE

# Configuración del servidor
PORT=3001
NODE_ENV=development
```

### Migración de base de datos
Ejecutar el archivo `backend/bd/migrations.sql` en PostgreSQL para crear las tablas necesarias.

## Flujo de compra

1. **Usuario navega y agrega productos** → Carrito localStorage
2. **Usuario inicia checkout** → Verificación de autenticación
3. **Si no está autenticado** → Redirección a login/registro
4. **Al autenticarse** → Sincronización de carrito con BD
5. **Llena datos de checkout** → Formulario multipaso
6. **Confirma compra** → Creación de pedido y preferencia de MP
7. **Redirección a MP** → Proceso de pago externo
8. **Retorno a la app** → Verificación y actualización de estado
9. **Webhook de MP** → Confirmación final y limpieza de carrito

## Estados de pedido

- `pendiente`: Pedido creado, esperando pago
- `pagado`: Pago confirmado por MP
- `enviado`: Pedido despachado
- `entregado`: Pedido recibido por el cliente
- `cancelado`: Pedido cancelado o pago rechazado

## Archivos principales creados/modificados

### Backend
- `controllers/cartController.js` - Lógica del carrito
- `controllers/paymentController.js` - Integración con MP
- `routes/cartRoutes.js` - Rutas del carrito
- `routes/paymentRoutes.js` - Rutas de pagos
- `bd/migrations.sql` - Schema de BD

### Frontend
- `services/api.js` - Cliente HTTP para APIs
- `components/OrderStatus.vue` - Estado de pedidos
- `components/PaymentSuccess.vue` - Resultado de pagos
- `utils/cartUtils.js` - Utilities mejoradas del carrito

## Próximos pasos

### Para completar la integración:

1. **Configurar Mercado Pago**:
   - Crear cuenta de desarrollador
   - Obtener ACCESS_TOKEN y PUBLIC_KEY
   - Configurar URLs de retorno en MP

2. **Ejecutar migraciones**:
   ```bash
   psql -U postgres -d capygaming -f backend/bd/migrations.sql
   ```

3. **Instalar dependencias**:
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```

4. **Configurar variables de entorno**:
   - Copiar `.env.example` a `.env`
   - Completar valores reales

5. **Iniciar servicios**:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

## Testing

### Para probar la integración:

1. **Registro/Login**: Crear usuario y autenticarse
2. **Agregar productos**: Desde ofertas y catálogo
3. **Revisar carrito**: Verificar persistencia
4. **Checkout**: Completar flujo de compra
5. **Pago**: Usar tarjetas de prueba de MP
6. **Verificar estado**: Revisar pedido creado

### Tarjetas de prueba (Sandbox):
- Visa: 4009175332806176
- MasterCard: 5031755734530604
- CVV: 123, Vencimiento: cualquier fecha futura

## Monitoreo y logs

El sistema incluye logging detallado para:
- Sincronización de carritos
- Creación de preferencias
- Webhooks de MP
- Estados de pedidos

Revisar consola del navegador y logs del servidor para debugging.