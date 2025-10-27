# Configuración de ngrok para Webhooks de MercadoPago

## ¿Qué es ngrok?

ngrok es una herramienta que crea un túnel HTTPS desde internet a tu servidor local, permitiendo que MercadoPago envíe webhooks a tu máquina durante el desarrollo.

```
MercadoPago --> https://abc123.ngrok.io --> http://localhost:3001
```

---

## Paso 1: Instalar ngrok

### Mac (con Homebrew)
```bash
brew install ngrok
```

### Windows/Linux
1. Descargar desde: https://ngrok.com/download
2. Descomprimir
3. Agregar al PATH del sistema

---

## Paso 2: Crear cuenta gratuita

1. Ir a: https://dashboard.ngrok.com/signup
2. Registrarse (plan gratuito)
3. Obtener tu authtoken en: https://dashboard.ngrok.com/get-started/your-authtoken

---

## Paso 3: Autenticar ngrok

```bash
ngrok authtoken TU_TOKEN_AQUI
```

Este comando guarda tu token localmente (solo se hace una vez).

---

## Paso 4: Iniciar tu servidor backend

Terminal 1:
```bash
cd backend
npm run dev
```

Verificar que corre en `http://localhost:3001`

---

## Paso 5: Iniciar túnel ngrok

Terminal 2 (NO CERRAR mientras testeas):
```bash
ngrok http 3001
```

Salida esperada:
```
ngrok

Forwarding     https://abc123def.ngrok-free.app -> http://localhost:3001
```

**COPIAR la URL HTTPS** (ejemplo: `https://abc123def.ngrok-free.app`)

---

## Paso 6: Configurar webhook en MercadoPago

1. Ir a: https://www.mercadopago.com.ar/developers/panel
2. Seleccionar tu aplicación
3. Ir a sección **"Webhooks"**
4. Click **"Configurar URLs"**
5. Agregar URL:
   ```
   https://abc123def.ngrok-free.app/api/webhooks/webhook
   ```
6. Seleccionar eventos: **payment**
7. Guardar

MercadoPago generará un **Webhook Secret**.

---

## Paso 7: Configurar el webhook secret

1. Copiar el secret de MercadoPago
2. Editar `.env`:
   ```bash
   MERCADOPAGO_WEBHOOK_SECRET=el-secret-que-copiaste
   ```
3. Reiniciar tu backend (Ctrl+C y `npm run dev` de nuevo)

---

## Paso 8: Testear webhook

1. Hacer un pago de prueba desde tu aplicación
2. Usar tarjeta de prueba:
   ```
   Número: 5031 7557 3453 0604
   CVV: 123
   Vencimiento: cualquier fecha futura
   Titular: APRO
   ```
3. Completar el pago

---

## Paso 9: Verificar que funciona

### En terminal del backend:
```
Validando firma de webhook...
 Data ID: 123456789
 Request ID: abc-def-123
 Timestamp: 1704534382
Firma de webhook VALIDA
```

### En Web UI de ngrok (http://127.0.0.1:4040):
```
POST /api/webhooks/webhook    200 OK
```

---

## Solución de problemas

### "Firma de webhook INVALIDA"
**Causa:** Secret incorrecto en `.env`

**Solución:**
1. Verificar secret en panel de MercadoPago
2. Actualizar `.env`
3. Reiniciar backend

---

### "Webhook sin firma de seguridad"
**Causa:** Middleware rechaza webhooks sin firma en producción

**Solución (solo desarrollo local):**
```bash
# En .env
NODE_ENV=development
ALLOW_UNSIGNED_WEBHOOKS=true
```

---

### La URL de ngrok cambia cada vez
**Causa:** Plan gratuito genera URLs aleatorias

**Solución:**
- Reconfigurar webhook en MercadoPago cada vez que reinicies ngrok
- O hacer upgrade a plan pago para URL fija

---

### "Tunnel not found"
**Causa:** Plan gratuito solo permite 1 túnel simultáneo

**Solución:**
1. Cerrar otras instancias de ngrok
2. Reiniciar: `ngrok http 3001`

---

## Comandos útiles

```bash
# Iniciar túnel
ngrok http 3001

# Ver túneles activos
ngrok tunnels

# Web UI (ver requests en tiempo real)
http://127.0.0.1:4040
```

---

## Tarjetas de prueba MercadoPago

### Pago aprobado
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 12/25
Titular: APRO
```

### Pago rechazado
```
Número: 5031 4332 1540 6351
CVV: 123
Vencimiento: 12/25
Titular: OTHE
```

### Pago pendiente
```
Número: 5031 4332 1540 6351
CVV: 123
Vencimiento: 12/25
Titular: CONT
```

---

## Configuración recomendada para desarrollo

### .env
```bash
# Base de datos
DB_USER=postgres
DB_HOST=db
DB_NAME=capygaming
DB_PASSWORD=tu-password
DB_PORT=5432

# Servidor
NODE_ENV=development
PORT=3001

# JWT
JWT_SECRET=tu-jwt-secret

# MercadoPago TEST
MERCADOPAGO_ACCESS_TOKEN=TEST-tu-token-aqui
MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui
MERCADOPAGO_WEBHOOK_SECRET=tu-webhook-secret-aqui

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# Webhooks (solo desarrollo)
ALLOW_UNSIGNED_WEBHOOKS=false
```

---

## Checklist de configuración

- [ ] ngrok instalado
- [ ] Cuenta ngrok creada y autenticada
- [ ] Backend corriendo en puerto 3001
- [ ] Túnel ngrok activo
- [ ] URL de webhook configurada en MercadoPago
- [ ] Webhook secret copiado a .env
- [ ] Backend reiniciado con nuevo secret
- [ ] Pago de prueba realizado
- [ ] Webhook recibido y validado

---

## Referencias

- Documentación oficial ngrok: https://ngrok.com/docs
- Webhooks MercadoPago: https://www.mercadopago.com.ar/developers/en/docs/your-integrations/notifications/webhooks
- Tarjetas de prueba: https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/additional-content/test-cards
