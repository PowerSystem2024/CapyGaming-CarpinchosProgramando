# ✅ Checklist Rápido - Deploy en Render

## 📦 Archivos Importantes Creados

- ✅ [render.yaml](render.yaml) - Configuración automática de Blueprint
- ✅ [DEPLOYMENT_RENDER.md](DEPLOYMENT_RENDER.md) - Guía completa paso a paso
- ✅ [backend/initDB.js](backend/initDB.js) - Script para inicializar BD

---

## 🚀 Deploy Rápido (5 minutos)

### 1️⃣ Subir archivos a GitHub
```bash
git add render.yaml DEPLOYMENT_RENDER.md RENDER_CHECKLIST.md backend/initDB.js
git commit -m "Add Render deployment files"
git push origin main
```

### 2️⃣ Crear cuenta en Render
- Ve a [render.com](https://render.com)
- Sign up con GitHub (gratis, sin tarjeta)

### 3️⃣ Desplegar con Blueprint
1. Dashboard → **New +** → **Blueprint**
2. Conectar repo: `PowerSystem2024/CapyGaming-CarpinchosProgramando`
3. Render detecta `render.yaml`
4. Click **"Apply"**
5. ⏳ Esperar 5-10 minutos

### 4️⃣ Configurar variables sensibles

En **capygaming-backend** → Environment:
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-1980789943964520-100916-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-093b7183-297b-43da-9393-...
MERCADOPAGO_WEBHOOK_SECRET=a899f86d00d5d3c5bdff7961cf1808b0e257e3c5...
EMAIL_USER=quirozarielezequiel@gmail.com
EMAIL_PASS=kywu vene zpin yfnl
```

### 5️⃣ Obtener URLs y actualizar

Después del deploy, obtén las URLs:
- Frontend: `https://capygaming-frontend-XXXX.onrender.com`
- Backend: `https://capygaming-backend-XXXX.onrender.com`

Actualizar en **capygaming-backend** → Environment:
```env
FRONTEND_URL=https://capygaming-frontend-XXXX.onrender.com
BACKEND_URL=https://capygaming-backend-XXXX.onrender.com
```

Actualizar en **capygaming-frontend** → Environment:
```env
VITE_API_URL=https://capygaming-backend-XXXX.onrender.com
```

**Guardar** → Ambos servicios se redesplegarán (2-3 min)

### 6️⃣ Inicializar Base de Datos

Opción A - Desde Render Shell:
```bash
# En backend service → Shell
node initDB.js
```

Opción B - Desde tu PC:
```bash
# Conectar con psql (copiar URL desde Render dashboard)
psql "postgresql://user:pass@host/database"

# Ejecutar script
\i backend/bd/init.sql

# Verificar
\dt
\q
```

### 7️⃣ Configurar Webhook MercadoPago

1. [Panel MercadoPago](https://www.mercadopago.com.ar/developers/panel/app)
2. Tu aplicación → **Webhooks**
3. URL: `https://capygaming-backend-XXXX.onrender.com/api/webhooks/webhook`
4. Eventos: `payment`
5. Copiar SECRET → Pegar en `MERCADOPAGO_WEBHOOK_SECRET`

### 8️⃣ Verificar que funciona

```bash
# Health check backend
curl https://capygaming-backend-XXXX.onrender.com/api/health

# Abrir frontend en navegador
https://capygaming-frontend-XXXX.onrender.com
```

---

## ❗ IMPORTANTE: Diferencias entre Local y Render

| Aspecto | Local (Docker) | Render (Producción) |
|---------|----------------|---------------------|
| **Arquitectura** | Docker Compose | 3 servicios separados |
| **Nginx** | ✅ Usado | ❌ NO usado |
| **Frontend** | Nginx:80 | Static Site CDN |
| **Backend** | Container | Web Service (node) |
| **Base de datos** | Container PostgreSQL | Managed PostgreSQL |
| **Variables .env** | Archivo `.env` | Dashboard de Render |
| **Networking** | Red interna Docker | Internet público HTTPS |
| **API URL** | `/api` (proxy nginx) | `https://backend.onrender.com/api` |

---

## 🔑 Variables de Entorno - Resumen

### Backend (capygaming-backend)
```env
# Auto-configuradas por Render
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...  # Auto
DB_USER=...                     # Auto
DB_HOST=...                     # Auto
DB_NAME=...                     # Auto
DB_PASSWORD=...                 # Auto
DB_PORT=5432
JWT_SECRET=...                  # Auto-generado

# CONFIGURAR MANUALMENTE:
FRONTEND_URL=https://tu-frontend.onrender.com
BACKEND_URL=https://tu-backend.onrender.com
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...
MERCADOPAGO_WEBHOOK_SECRET=...
ALLOW_UNSIGNED_WEBHOOKS=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app
```

### Frontend (capygaming-frontend)
```env
# CONFIGURAR MANUALMENTE:
VITE_API_URL=https://tu-backend.onrender.com
```

---

## 🐛 Troubleshooting Rápido

### ❌ Backend no conecta a BD
```bash
# Verificar que DATABASE_URL sea la INTERNAL URL
# En Dashboard → PostgreSQL → Internal Database URL
```

### ❌ Frontend no llama al Backend (CORS)
```bash
# Verificar FRONTEND_URL en backend
# Verificar VITE_API_URL en frontend
# Ambas deben ser HTTPS
```

### ❌ Build falla
```bash
# Ver logs completos en Dashboard → Service → Logs
# Verificar que las rutas sean correctas:
# Build: cd backend && npm install
# Start: cd backend && node server.js
```

### ❌ Webhooks no funcionan
```bash
# Verificar URL webhook en MercadoPago
# Verificar MERCADOPAGO_WEBHOOK_SECRET
# Verificar logs del backend
```

---

## 💰 Costos

| Servicio | Plan | Costo |
|----------|------|-------|
| Frontend | Free | $0 |
| Backend | Free | $0 |
| PostgreSQL | Free (90 días) | $0 |
| **TOTAL** | | **$0/mes** |

Después de 90 días:
- PostgreSQL: $7/mes (si quieres mantener datos)
- O migrar a otra BD gratis (Supabase, Neon)

---

## 📱 URLs Finales

Después del deploy, tus URLs serán:

```
🌐 Frontend:  https://capygaming-frontend.onrender.com
🔌 Backend:   https://capygaming-backend.onrender.com
🗄️ Database:  dpg-XXXXXX.oregon-postgres.render.com

📍 Health:    https://capygaming-backend.onrender.com/api/health
📍 API Docs:  https://capygaming-backend.onrender.com/
```

---

## 🎯 Próximos Pasos (Opcional)

1. ✅ **Dominio personalizado**: `www.capygaming.com`
2. ✅ **Analytics**: Agregar Google Analytics
3. ✅ **Monitoring**: UptimeRobot para evitar cold starts
4. ✅ **Seed Products**: Ejecutar `backend/bd/seedProducts.js`
5. ✅ **CI/CD**: Auto-deploy en cada push a main (ya incluido)

---

## 📚 Ayuda

- 📖 [Guía completa](DEPLOYMENT_RENDER.md)
- 🌐 [Docs Render](https://render.com/docs)
- 💬 [Render Community](https://community.render.com/)

---

✨ **¡Todo listo! Ahora solo sigue los pasos 1-8 de arriba.** ✨
