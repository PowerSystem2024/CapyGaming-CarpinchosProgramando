# 🚀 Guía de Despliegue en Render - CapyGaming

Esta guía te llevará paso a paso para desplegar CapyGaming en Render completamente GRATIS.

---

## 📋 Pre-requisitos

- ✅ Cuenta en [Render.com](https://render.com) (gratis)
- ✅ Repositorio en GitHub
- ✅ Credenciales de MercadoPago (TEST o PRODUCCIÓN)
- ✅ Email para nodemailer

---

## 🎯 Arquitectura del Despliegue

```
Internet
   ↓
Render CDN → Frontend (Static Site)
   ↓             ↓
   └─────→ Backend (Web Service)
                ↓
         PostgreSQL (Database)
```

**IMPORTANTE**: En Render NO usamos Docker ni Nginx. Todo se despliega con npm directamente.

---

## 📝 OPCIÓN 1: Despliegue Automático con render.yaml (RECOMENDADO)

### Paso 1: Preparar el repositorio

1. **Hacer commit del archivo `render.yaml`**
   ```bash
   git add render.yaml DEPLOYMENT_RENDER.md
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Verificar que el repo esté en GitHub**
   - Tu repo: `https://github.com/PowerSystem2024/CapyGaming-CarpinchosProgramando`

### Paso 2: Crear Blueprint en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **"New +"** → **"Blueprint"**
3. Conecta tu repositorio de GitHub
4. Render detectará automáticamente `render.yaml`
5. Click en **"Apply"**

### Paso 3: Esperar que se desplieguen los servicios

Render creará automáticamente:
- ✅ Base de datos PostgreSQL
- ✅ Backend (Web Service)
- ✅ Frontend (Static Site)

**Tiempo estimado**: 5-10 minutos

### Paso 4: Configurar variables de entorno sensibles

En el dashboard de Render, ve a cada servicio y agrega:

#### Backend Service → Environment
```env
MERCADOPAGO_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
MERCADOPAGO_PUBLIC_KEY=TU_PUBLIC_KEY_AQUI
MERCADOPAGO_WEBHOOK_SECRET=TU_WEBHOOK_SECRET_AQUI
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app
```

### Paso 5: Actualizar URLs

Una vez desplegados, obtén las URLs reales y actualiza:

#### En Backend Service → Environment
```env
FRONTEND_URL=https://TU_FRONTEND_URL.onrender.com
BACKEND_URL=https://TU_BACKEND_URL.onrender.com
```

#### En Frontend Service → Environment
```env
VITE_API_URL=https://TU_BACKEND_URL.onrender.com
```

### Paso 6: Configurar Webhook de MercadoPago

1. Ve al [Panel de MercadoPago](https://www.mercadopago.com.ar/developers/panel/app)
2. Selecciona tu aplicación
3. Ir a **Webhooks**
4. Configurar:
   - URL: `https://TU_BACKEND_URL.onrender.com/api/webhooks/webhook`
   - Eventos: `payment`
5. Copiar el SECRET generado
6. Pegar en `MERCADOPAGO_WEBHOOK_SECRET` del backend

### Paso 7: Inicializar la base de datos

La base de datos se crea vacía. Necesitas ejecutar `init.sql`:

1. En el dashboard de Render → PostgreSQL Database
2. Click en **"Connect"** → Copiar el comando `psql`
3. En tu terminal local:
   ```bash
   # Conectar a la base de datos
   psql "TU_DATABASE_URL_COMPLETA"

   # Cargar el script
   \i backend/bd/init.sql

   # Verificar tablas
   \dt

   # Salir
   \q
   ```

**Alternativa**: Usar un cliente GUI como [pgAdmin](https://www.pgadmin.org/) o [DBeaver](https://dbeaver.io/)

---

## 📝 OPCIÓN 2: Despliegue Manual (Paso a Paso)

### A. Crear Base de Datos PostgreSQL

1. En Render Dashboard → **New +** → **PostgreSQL**
2. Configurar:
   - **Name**: `capygaming-db`
   - **Database**: `capygaming`
   - **User**: `capygaming_user`
   - **Region**: Oregon (o el más cercano)
   - **Plan**: Free
3. Click **Create Database**
4. **Copiar la URL de conexión interna** (Internal Database URL)

### B. Desplegar Backend

1. **New +** → **Web Service**
2. Conectar repositorio de GitHub
3. Configurar:
   - **Name**: `capygaming-backend`
   - **Region**: Oregon (mismo que la DB)
   - **Branch**: `main`
   - **Root Directory**: (dejar vacío)
   - **Runtime**: Node
   - **Build Command**:
     ```bash
     cd backend && npm install
     ```
   - **Start Command**:
     ```bash
     cd backend && node server.js
     ```
   - **Plan**: Free

4. **Environment Variables** (agregar estas):
   ```env
   NODE_ENV=production
   PORT=3001

   # Base de datos (pegar la URL copiada anteriormente)
   DATABASE_URL=postgresql://user:pass@host:5432/capygaming

   # Extraer manualmente de DATABASE_URL:
   DB_USER=capygaming_user
   DB_HOST=dpg-xxxxx.oregon-postgres.render.com
   DB_NAME=capygaming
   DB_PASSWORD=xxxxx
   DB_PORT=5432

   # JWT (generar nuevo con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   JWT_SECRET=genera_un_secret_seguro_aqui

   # MercadoPago
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
   MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key
   MERCADOPAGO_WEBHOOK_SECRET=tu-webhook-secret
   ALLOW_UNSIGNED_WEBHOOKS=false

   # URLs (actualizar después)
   FRONTEND_URL=https://capygaming.onrender.com
   BACKEND_URL=https://capygaming-backend.onrender.com

   # Email
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_contraseña_app
   ```

5. Click **Create Web Service**
6. **Copiar la URL del backend** (ej: `https://capygaming-backend.onrender.com`)

### C. Desplegar Frontend

1. **New +** → **Static Site**
2. Conectar repositorio de GitHub
3. Configurar:
   - **Name**: `capygaming-frontend`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: (dejar vacío)
   - **Build Command**:
     ```bash
     cd frontend && npm install && npm run build
     ```
   - **Publish Directory**:
     ```
     frontend/dist
     ```

4. **Environment Variables**:
   ```env
   VITE_API_URL=https://capygaming-backend.onrender.com
   ```
   (Usar la URL del backend del paso anterior)

5. Click **Create Static Site**
6. **Copiar la URL del frontend** (ej: `https://capygaming.onrender.com`)

### D. Actualizar URLs cruzadas

1. **Backend** → Environment → Editar:
   ```env
   FRONTEND_URL=https://capygaming.onrender.com
   ```

2. **Frontend** ya tiene `VITE_API_URL` configurado

3. **Guardar cambios** → Ambos servicios se redesplegarán automáticamente

---

## 🔧 Configuración Post-Despliegue

### 1. Inicializar Base de Datos

```bash
# Desde tu terminal local
psql "postgresql://user:pass@host:5432/capygaming"

# Ejecutar el script
\i backend/bd/init.sql

# Verificar
\dt
```

### 2. Configurar Webhook de MercadoPago

- Panel MercadoPago → Webhooks
- URL: `https://tu-backend.onrender.com/api/webhooks/webhook`
- Eventos: `payment`

### 3. Verificar CORS

El backend ya tiene CORS configurado para aceptar `FRONTEND_URL`:
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## ✅ Verificación del Despliegue

### Backend Health Check
```bash
curl https://tu-backend.onrender.com/api/health
```

Respuesta esperada:
```json
{
  "message": "Backend de CapyGaming funcionando correctamente"
}
```

### Frontend
Abre en el navegador: `https://tu-frontend.onrender.com`

### Base de Datos
```bash
psql "TU_DATABASE_URL"
\dt  # Debería mostrar todas las tablas
```

---

## 🐛 Solución de Problemas Comunes

### 1. Backend no se conecta a la base de datos

**Síntoma**: Error `ECONNREFUSED` o `connection refused`

**Solución**:
- Verificar que `DATABASE_URL` esté correcta
- Usar la **Internal Database URL**, NO la External
- Verificar que backend y DB estén en la misma región

### 2. Frontend no puede llamar al Backend

**Síntoma**: Error CORS o `Network Error`

**Solución**:
- Verificar `VITE_API_URL` en frontend
- Verificar `FRONTEND_URL` en backend
- Asegurarse que ambas URLs sean HTTPS
- Verificar que backend esté desplegado y funcionando

### 3. Webhooks de MercadoPago no funcionan

**Síntoma**: Pagos no se procesan

**Solución**:
- Verificar URL del webhook: `https://backend.onrender.com/api/webhooks/webhook`
- Verificar `MERCADOPAGO_WEBHOOK_SECRET`
- Verificar que `ALLOW_UNSIGNED_WEBHOOKS=false` en producción
- Ver logs del backend en Render Dashboard

### 4. Build del Frontend falla

**Síntoma**: Error en `npm run build`

**Solución**:
- Verificar que `VITE_API_URL` esté configurado ANTES del build
- Verificar que todas las dependencias estén en `package.json`
- Ver logs completos en Render Dashboard

### 5. Backend se duerme (Cold Start)

**Síntoma**: Primera request tarda 30-50 segundos

**Solución**:
- Es normal en el plan Free de Render
- El backend se duerme después de 15 minutos de inactividad
- Considera usar un servicio de ping (como [UptimeRobot](https://uptimerobot.com/)) para mantenerlo activo

---

## 📊 Planes y Limitaciones

### Plan Free de Render (lo que usarás)

| Recurso | Límite |
|---------|--------|
| **Web Services** | Ilimitados |
| **Static Sites** | Ilimitados |
| **PostgreSQL** | 1 base de datos, 90 días de retención |
| **RAM** | 512 MB por servicio |
| **CPU** | Compartido |
| **Bandwidth** | 100 GB/mes |
| **Build Minutes** | 500 min/mes |
| **Cold Start** | Sí (después de 15 min de inactividad) |
| **SSL** | ✅ Gratis (Let's Encrypt) |
| **Custom Domain** | ✅ Permitido |

---

## 🔄 Actualizar la Aplicación

### Deploy Automático (recomendado)

1. Hacer cambios en tu código
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Actualización"
   git push origin main
   ```
3. Render detecta el push y redespliega automáticamente

### Deploy Manual

En Render Dashboard → Tu servicio → **Manual Deploy** → **Deploy latest commit**

---

## 🌐 Dominios Personalizados (Opcional)

### Agregar dominio personalizado

1. Comprar dominio (ej: en [Namecheap](https://www.namecheap.com/))
2. En Render Dashboard → Frontend Service → **Custom Domain**
3. Agregar tu dominio: `www.capygaming.com`
4. Copiar los registros DNS que te da Render
5. Configurar en tu proveedor de dominios:
   - Tipo: `CNAME`
   - Host: `www`
   - Value: `capygaming.onrender.com`
6. Esperar propagación DNS (1-24 horas)

---

## 💰 Costos

**Plan Free**: $0/mes
- ✅ Perfecto para proyectos universitarios
- ✅ Sin tarjeta de crédito requerida
- ✅ Ilimitado en número de servicios

**Después de 90 días** (si quieres mantener la BD):
- PostgreSQL: $7/mes (opcional)
- Web Services: Sigue siendo gratis con limitaciones

---

## 📚 Recursos Adicionales

- [Documentación Render](https://render.com/docs)
- [Guía de PostgreSQL en Render](https://render.com/docs/databases)
- [Configuración de Variables de Entorno](https://render.com/docs/environment-variables)
- [Blueprint YAML Reference](https://render.com/docs/blueprint-spec)

---

## 🆘 Soporte

Si tienes problemas:
1. Revisar logs en Render Dashboard
2. Consultar esta guía
3. Ver [Render Community](https://community.render.com/)
4. Preguntar en el grupo de la universidad

---

✅ **¡Listo! Tu aplicación debería estar funcionando en producción.**

**URLs finales**:
- Frontend: `https://capygaming.onrender.com`
- Backend: `https://capygaming-backend.onrender.com`
- API Health: `https://capygaming-backend.onrender.com/api/health`
