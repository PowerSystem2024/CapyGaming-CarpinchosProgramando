# 🛒 Configuración de MercadoPago para CapyGaming

## ✅ Estado actual del flujo de compra

El flujo de compra está completamente implementado con las siguientes funcionalidades:

### Flujo completo:
1. **Carrito** → Usuario agrega productos
2. **Checkout** → 4 pasos (datos, dirección, envío, pago)
3. **Crear Pedido** → Se guarda en PostgreSQL
4. **Pago** → Integración con MercadoPago o instrucciones para otros métodos
5. **Confirmación** → Página de confirmación con detalles del pedido

### Páginas implementadas:
- ✅ Checkout con formulario de 4 pasos
- ✅ Confirmación de pedido (`/order-confirmation/:id`)
- ✅ Pago exitoso (`/payment/success`)
- ✅ Pago rechazado (`/payment/failure`)
- ✅ Pago pendiente (`/payment/pending`)

### APIs implementadas:
- ✅ `POST /api/orders/create` - Crear pedido
- ✅ `GET /api/orders/:id` - Obtener detalles del pedido
- ✅ `GET /api/orders/user/:dni` - Historial de pedidos
- ✅ `POST /api/mercadopago/create-preference` - Crear preferencia de pago
- ✅ `POST /api/mercadopago/webhook` - Recibir notificaciones
- ✅ `GET /api/mercadopago/payment/:id` - Consultar estado del pago

## 🔧 Configuración de MercadoPago

### 1. Obtener credenciales (IMPORTANTE)

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers/panel)
2. En el menú lateral, selecciona **"Tus integraciones"**
3. Busca tu aplicación **"CapyGaming2"**
4. Haz clic en **"Credenciales de producción"** o **"Credenciales de prueba"**
5. **IMPORTANTE**: Asegúrate de copiar el **Access Token** completo (comienza con `TEST-` para pruebas)

### 2. Verificar el token

El Access Token debe tener este formato:
```
TEST-XXXXXXXX-XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXX
```

- Debe empezar con `TEST-` para desarrollo
- Tiene aproximadamente 71-86 caracteres
- NO debe tener espacios al principio o al final

### 3. Actualizar el archivo .env

Edita el archivo `backend/.env` y pega tu token:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-token-completo-aqui
```

**⚠️ IMPORTANTE**:
- NO pongas comillas alrededor del token
- NO dejes espacios antes o después del =
- Asegúrate de que no haya saltos de línea en el medio del token

### 4. Reiniciar el servidor

Después de actualizar el .env:
```bash
cd backend
# Detén el servidor con Ctrl+C si está corriendo
npm start
```

## 🧪 Probar la integración

### Tarjetas de prueba para MercadoPago:

**Pago aprobado:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Vencimiento: `11/25`
- Nombre: `APRO`
- DNI: `12345678`

**Pago rechazado:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Vencimiento: `11/25`
- Nombre: `TEST`
- DNI: `12345678`

### Proceso de prueba:

1. Agrega productos al carrito
2. Ve al checkout
3. Completa los 4 pasos del formulario
4. En el paso 4, selecciona **"MercadoPago"**
5. Serás redirigido al checkout de MercadoPago
6. Usa una tarjeta de prueba
7. Completa el pago
8. Serás redirigido de vuelta a tu aplicación

## 🚨 Solución de problemas

### Error "invalid_token"

Este error significa que el Access Token no es válido. Posibles causas:

1. **Token incorrecto**: Verifica que copiaste el token completo
2. **Token expirado**: Genera uno nuevo en el panel de MercadoPago
3. **Espacios extras**: Asegúrate de no tener espacios en el .env
4. **Tipo de token incorrecto**: Usa el Access Token, NO la Public Key

### Error de conexión

Si el servidor no se conecta:
1. Verifica que PostgreSQL esté ejecutándose
2. Verifica que el servidor backend esté en el puerto 3001
3. Verifica que el frontend esté en el puerto 5173

## 📱 Próximos pasos para producción

1. **Obtener credenciales de producción** en MercadoPago
2. **Completar la homologación** en MercadoPago
3. **Actualizar el .env** con el Access Token de producción
4. **Configurar HTTPS** en tu servidor
5. **Actualizar las URLs** en el .env para tu dominio de producción

## 💡 Tips adicionales

- Los pedidos se guardan en la tabla `pedido` de PostgreSQL
- El estado del pago se actualiza automáticamente vía webhook
- Los usuarios pueden ver su historial de pedidos
- Puedes personalizar los métodos de envío en el componente CheckoutForm
- Los códigos de descuento están hardcodeados en el checkout (CAPY10, GAMING20, PRIMERA)

## 📞 Soporte

Si tienes problemas con la integración:
1. Revisa los logs del servidor: `npm start` en la carpeta backend
2. Verifica la consola del navegador para errores del frontend
3. Consulta la [documentación oficial de MercadoPago](https://www.mercadopago.com.ar/developers/es/docs)

---

**Última actualización**: 11 de Octubre de 2024