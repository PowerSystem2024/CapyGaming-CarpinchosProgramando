# 🐳 Documentación de Dockerización - CapyGaming

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Arquitectura Docker](#arquitectura-docker)
3. [Cambios Realizados](#cambios-realizados)
4. [Por Qué Se Hicieron Estos Cambios](#por-qué-se-hicieron-estos-cambios)
5. [Guía de Instalación y Ejecución](#guía-de-instalación-y-ejecución)
6. [Solución de Problemas](#solución-de-problemas)
7. [Variables de Entorno](#variables-de-entorno)

---

## 🎯 Introducción

Este documento describe el proceso de dockerización del proyecto CapyGaming, los cambios necesarios para que funcione correctamente en contenedores Docker, y las instrucciones para que otros desarrolladores puedan ejecutar el proyecto.

### ¿Qué es Docker?
Docker es una plataforma que permite empaquetar aplicaciones y sus dependencias en contenedores, garantizando que la aplicación funcione de la misma manera en cualquier entorno (desarrollo, staging, producción).

### ¿Por qué dockerizar este proyecto?
- **Consistencia:** Todos los desarrolladores trabajan en el mismo entorno
- **Facilidad de setup:** No necesitas instalar Node.js, PostgreSQL, ni otras dependencias manualmente
- **Portabilidad:** El proyecto funciona igual en Windows, Mac y Linux
- **Despliegue simplificado:** Facilita el deployment en servidores de producción

---

## 🏗️ Arquitectura Docker

El proyecto CapyGaming se compone de **3 servicios** dockerizados:

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario (Navegador)                      │
│                  http://localhost:80                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Nginx + Vue.js compilado)                        │
│  - Puerto: 80                                               │
│  - Imagen: nginx:alpine                                     │
│  - Sirve archivos estáticos de Vue                          │
│  - Proxy inverso para /api/ → backend                       │
└────────────────────────┬────────────────────────────────────┘
                         │ /api/*
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Node.js + Express)                                │
│  - Puerto: 3001                                             │
│  - Imagen: node:20-alpine                                   │
│  - API REST para productos, auth, categorías                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                                      │
│  - Puerto: 5432 (solo red interna)                          │
│  - Imagen: postgres:15-alpine                               │
│  - Almacenamiento persistente                               │
└─────────────────────────────────────────────────────────────┘

Red interna Docker: capygaming-network
```

### Flujo de una petición:

1. Usuario accede a `http://localhost` (puerto 80)
2. Nginx sirve el frontend (HTML, CSS, JS de Vue)
3. Vue hace petición AJAX a `/api/productos`
4. Nginx intercepta `/api/*` y hace proxy a `http://backend:3001/api/productos`
5. Backend consulta PostgreSQL en `db:5432`
6. Backend responde al frontend
7. Frontend muestra los datos al usuario

---

## 🔧 Cambios Realizados

### 1. **Importación de AuthService en el Router**

**Archivo:** `frontend/src/router/index.js`

**Línea añadida:** Línea 21
```javascript
import AuthService from '../services/authService.js';
```

**Cambio:**
```diff
import TerminosCondiciones from '../components/TerminosCondiciones.vue';
+ import AuthService from '../services/authService.js';


//Definir las rutas de tu aplicacion
```

---

### 2. **Creación de Variables de Entorno para el Frontend**

**Archivo creado:** `frontend/.env.production`

**Contenido:**
```env
VITE_API_URL=http://backend:3001
```

**Nota:** Esta variable no se usa actualmente porque todos los componentes usan rutas relativas (`/api/...`), pero está configurada para casos futuros donde se necesite hacer llamadas directas desde el navegador.

---

### 3. **Actualización de AuthService para usar Variables de Entorno**

**Archivo:** `frontend/src/services/authService.js`

**Cambio en línea 1-3:**
```diff
- const API_BASE = 'http://localhost:3001/api';
+ const API_BASE = import.meta.env.VITE_API_URL
+   ? `${import.meta.env.VITE_API_URL}/api`
+   : '/api';
```

**Explicación:**
- Si existe la variable de entorno `VITE_API_URL`, la usa
- Si no existe, usa `/api` (ruta relativa)
- En producción con Docker, usa la ruta relativa que nginx redirige al backend

---

### 4. **Actualización de URLs en Componentes Vue**

**Archivos modificados:**
- `frontend/src/components/Catalogo.vue`
- `frontend/src/components/CatalogoCategoria.vue`
- `frontend/src/components/ProductoDetalle.vue`
- `frontend/src/components/NavBar.vue`
- `frontend/src/components/ResultadosPage.vue`

**Cambios realizados:**

**Antes:**
```javascript
const res = await axios.get('http://localhost:3001/api/productos');
```

**Después:**
```javascript
const res = await axios.get('/api/productos');
```

**Todos los componentes ahora usan rutas relativas** que comienzan con `/api/...`

---

### 5. **Configuración de Proxy Inverso en Nginx**

**Archivo:** `frontend/nginx.conf`

**Cambio:** Añadido bloque de proxy ANTES del `location /`

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Proxy para el API
    location /api/ {
        proxy_pass http://backend:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Para Vue Router en modo history
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cachear archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🤔 Por Qué Se Hicieron Estos Cambios

### Problema #1: AuthService no estaba importado
**Síntoma:** La aplicación mostraba solo navbar y footer, sin contenido central.

**Causa:** El archivo `router/index.js` usaba `AuthService.isAuthenticated()` en el middleware de navegación (línea 125), pero nunca importaba la clase `AuthService`.

**Consecuencia:** `ReferenceError: AuthService is not defined` que rompía todo el router de Vue.

**Solución:** Importar `AuthService` desde `'../services/authService.js'`

---

### Problema #2: URLs hardcodeadas a localhost:3001
**Síntoma:** Los componentes no cargaban datos de la API.

**Causa:** Las URLs estaban hardcodeadas como `http://localhost:3001/api/...`

**Por qué fallaba en Docker:**
1. El frontend se compila con `npm run build` DENTRO del contenedor Docker
2. Las URLs `http://localhost:3001` quedan grabadas en el JavaScript compilado
3. Cuando el usuario abre la página en su navegador, el navegador intenta conectarse a `localhost:3001`
4. Pero desde el navegador del usuario, `localhost:3001` NO existe (el backend está en un contenedor diferente)

**Solución:** Usar rutas relativas (`/api/...`) y configurar un proxy en nginx.

---

### Problema #3: Falta de proxy en Nginx
**Síntoma:** Peticiones a `/api/...` fallaban con 404.

**Causa:** Nginx no sabía qué hacer con las peticiones a `/api/...`

**Explicación:**
- El navegador hace petición a `http://localhost/api/productos`
- Nginx recibe la petición en el puerto 80
- Sin proxy, nginx busca un archivo `/usr/share/nginx/html/api/productos` (que no existe)
- Con proxy, nginx redirige a `http://backend:3001/api/productos`

**Solución:** Configurar `location /api/` con `proxy_pass` hacia el backend.

---

### Problema #4: Vite proxy no funciona en producción
**Síntoma:** La configuración de proxy en `vite.config.js` no tenía efecto.

**Causa:** El proxy de Vite **solo funciona en desarrollo** (`npm run dev`).

**Explicación:**
- En desarrollo: Vite corre un servidor con hot-reload y el proxy funciona
- En producción: Vite compila a archivos estáticos (HTML, CSS, JS)
- Los archivos estáticos no tienen servidor, solo se sirven por nginx

**Solución:** Configurar el proxy en nginx para producción.

---

## 🚀 Guía de Instalación y Ejecución

### Requisitos Previos

Asegúrate de tener instalado:
- **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
- **Docker Compose** (viene incluido con Docker Desktop)

#### Verificar instalación:
```bash
docker --version
# Debería mostrar: Docker version 24.x.x o superior

docker-compose --version
# Debería mostrar: Docker Compose version 2.x.x o superior
```

---

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/PowerSystem2024/CapyGaming-CarpinchosProgramando.git
cd CapyGaming-CarpinchosProgramando
```

---

### Paso 2: Configurar Variables de Entorno

El proyecto ya incluye un archivo `.env` en la raíz con las configuraciones necesarias:

```env
# Base de datos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_DB=capygaming

# Backend
NODE_ENV=production
PORT=3001
DB_USER=postgres
DB_HOST=db
DB_NAME=capygaming
DB_PASSWORD=capygaming2025
DB_PORT=5432
FRONTEND_URL=http://localhost

# Configuración de Autenticación JWT
JWT_SECRET=carpincho

# Configuración de Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-
MERCADOPAGO_PUBLIC_KEY=APP_USR-

# URLs de la aplicación
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

**⚠️ Importante:** En un entorno de producción real, deberías cambiar:
- `JWT_SECRET` a un valor secreto y seguro
- Las credenciales de Mercado Pago
- Las contraseñas de la base de datos

---

### Paso 3: Construir las Imágenes Docker

```bash
docker-compose build --no-cache
```

**Explicación:**
- `docker-compose build`: Construye las imágenes Docker según los Dockerfiles
- `--no-cache`: Fuerza a Docker a reconstruir sin usar caché (importante para aplicar cambios)

**Tiempo estimado:** 5-10 minutos (depende de tu conexión a internet y CPU)

**Qué hace internamente:**
1. **Base de datos:** Descarga la imagen de PostgreSQL 15
2. **Backend:**
   - Copia `package.json`
   - Ejecuta `npm ci --only=production`
   - Copia el código fuente
3. **Frontend:**
   - Copia `package.json`
   - Ejecuta `npm ci`
   - Ejecuta `npm run build` (compila Vue.js)
   - Copia los archivos compilados a nginx
   - Copia la configuración de nginx

---

### Paso 4: Iniciar los Contenedores

```bash
docker-compose up -d
```

**Explicación:**
- `up`: Inicia los servicios
- `-d`: Modo detached (segundo plano)

**Salida esperada:**
```
Creating network "capygaming-network" with driver "bridge"
Creating volume "capygaming_postgres_data" with local driver
Creating capygaming-db ... done
Creating capygaming-backend ... done
Creating capygaming-frontend ... done
```

---

### Paso 5: Verificar que los Contenedores Estén Corriendo

```bash
docker-compose ps
```

**Salida esperada:**
```
NAME                   STATUS          PORTS
capygaming-backend     Up 30 seconds   0.0.0.0:3001->3001/tcp
capygaming-db          Up 30 seconds   5432/tcp
capygaming-frontend    Up 30 seconds   0.0.0.0:80->80/tcp
```

---

### Paso 6: Verificar los Logs

#### Ver logs de todos los servicios:
```bash
docker-compose logs
```

#### Ver logs de un servicio específico:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

#### Ver logs en tiempo real:
```bash
docker-compose logs -f backend
```
(Presiona `Ctrl+C` para salir)

**Logs exitosos del backend:**
```
capygaming-backend | Server running on port 3001
capygaming-backend | Connected to PostgreSQL database
```

**Logs exitosos de la base de datos:**
```
capygaming-db | database system is ready to accept connections
```

---

### Paso 7: Acceder a la Aplicación

Abre tu navegador y ve a:

- **Frontend:** http://localhost
- **Backend API (opcional):** http://localhost:3001/api/productos

---

### Paso 8: Verificar Funcionamiento en el Navegador

1. Abre http://localhost
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña **Console**
   - No deberías ver errores de JavaScript
   - No deberías ver `ReferenceError: AuthService is not defined`
4. Ve a la pestaña **Network**
   - Filtra por `XHR` o `Fetch`
   - Deberías ver peticiones a `/api/...` con estado `200 OK`
5. Navega por la aplicación:
   - Haz clic en una categoría
   - Usa la barra de búsqueda
   - Navega a diferentes páginas

---

## 🛠️ Comandos Útiles de Docker

### Detener los contenedores
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
```bash
docker-compose down -v
```

### Reiniciar un servicio específico
```bash
docker-compose restart backend
```

### Reconstruir y reiniciar
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Ejecutar comandos dentro de un contenedor
```bash
# Acceder al contenedor del backend
docker-compose exec backend sh

# Acceder a la base de datos PostgreSQL
docker-compose exec db psql -U postgres -d capygaming
```

### Eliminar todo (contenedores, redes, volúmenes)
```bash
docker-compose down -v
docker system prune -a
```

---

## 🐛 Solución de Problemas

### Problema: El frontend muestra solo navbar y footer, sin contenido

**Causa:** AuthService no está importado, o hay errores en el router.

**Solución:**
1. Verifica que `frontend/src/router/index.js` tenga la importación:
   ```javascript
   import AuthService from '../services/authService.js';
   ```
2. Reconstruye el frontend:
   ```bash
   docker-compose down
   docker-compose build --no-cache frontend
   docker-compose up -d
   ```

---

### Problema: Las peticiones a /api/ fallan con 404

**Causa:** El proxy de nginx no está configurado correctamente.

**Solución:**
1. Verifica que `frontend/nginx.conf` tenga el bloque `location /api/`
2. Verifica que esté ANTES del `location /`
3. Reconstruye:
   ```bash
   docker-compose down
   docker-compose build --no-cache frontend
   docker-compose up -d
   ```

---

### Problema: El backend no puede conectarse a la base de datos

**Error típico:**
```
Error: connect ECONNREFUSED db:5432
```

**Solución:**
1. Verifica que la base de datos esté corriendo:
   ```bash
   docker-compose ps db
   ```
2. Verifica las variables de entorno en `.env`
3. Espera unos segundos (la base de datos tarda en iniciar)
4. Reinicia el backend:
   ```bash
   docker-compose restart backend
   ```

---

### Problema: No se muestran productos (las tablas no existen)

**Error típico en logs:**
```
Error: relation "producto" does not exist
Error: relation "subcategoria" does not exist
```

**Causa:** La base de datos no está inicializada o el volumen tiene datos antiguos.

**Solución:**
1. Detén y elimina los contenedores con sus volúmenes:
   ```bash
   docker-compose down -v
   ```
2. Inicia de nuevo (esto ejecutará el script de inicialización):
   ```bash
   docker-compose up -d
   ```
3. Verifica que las tablas se crearon:
   ```bash
   docker-compose exec db psql -U postgres -d capygaming -c "\dt"
   ```
4. Pobla la base de datos con los productos del catálogo:
   ```bash
   docker-compose exec backend node bd/seedProducts.js
   ```
5. Verifica que funcione:
   ```bash
   curl http://localhost:3001/api/productos
   ```

   Deberías ver 88 productos del catálogo.

**Ver más información:** Consulta [DATABASE.md](DATABASE.md) para detalles sobre la base de datos.

---

### Problema: "Port already in use" (Puerto ya en uso)

**Error típico:**
```
Error: bind: address already in use
```

**Solución:**
1. Verifica qué proceso está usando el puerto:
   ```bash
   # Windows
   netstat -ano | findstr :80
   netstat -ano | findstr :3001

   # Linux/Mac
   lsof -i :80
   lsof -i :3001
   ```
2. Detén el proceso que está usando el puerto
3. O cambia el puerto en `docker-compose.yml`:
   ```yaml
   frontend:
     ports:
       - "8080:80"  # Ahora usa puerto 8080
   ```

---

### Problema: Los cambios en el código no se reflejan

**Causa:** Docker está usando caché de una build anterior.

**Solución:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### Problema: Error "CORS blocked"

**Causa:** El backend no tiene configurado CORS correctamente.

**Solución:**
Verifica que el backend tenga configurado CORS en `backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost',
  credentials: true
}));
```

---

## 📊 Variables de Entorno Explicadas

### Variables de PostgreSQL
```env
POSTGRES_USER=postgres          # Usuario de la base de datos
POSTGRES_PASSWORD=admin         # Contraseña del usuario root
POSTGRES_DB=capygaming         # Nombre de la base de datos
```

### Variables del Backend
```env
NODE_ENV=production            # Entorno (development/production)
PORT=3001                      # Puerto donde corre el backend
DB_USER=postgres               # Usuario para conectarse a PostgreSQL
DB_HOST=db                     # Nombre del servicio Docker de la BD
DB_NAME=capygaming            # Nombre de la base de datos
DB_PASSWORD=capygaming2025    # Contraseña de la BD
DB_PORT=5432                  # Puerto de PostgreSQL
JWT_SECRET=         # Secret para firmar tokens JWT
FRONTEND_URL=http://localhost # URL del frontend (para CORS)
```

### Variables de Mercado Pago
```env
MERCADOPAGO_ACCESS_TOKEN=...   # Token de acceso de Mercado Pago
MERCADOPAGO_PUBLIC_KEY=...     # Clave pública de Mercado Pago
```

---

## 📝 Notas Adicionales

### Desarrollo vs Producción

**En desarrollo local (sin Docker):**
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

**En producción (con Docker):**
```bash
docker-compose up -d
```

### Persistencia de Datos

Los datos de PostgreSQL se almacenan en un **volumen Docker** llamado `postgres_data`. Esto significa que:
- Los datos persisten aunque detengas los contenedores
- Los datos se eliminan si ejecutas `docker-compose down -v`
- Para backup, puedes exportar el volumen:
  ```bash
  docker-compose exec db pg_dump -U postgres capygaming > backup.sql
  ```

### Red Docker

Todos los contenedores están en una red privada llamada `capygaming-network`:
- Los contenedores pueden comunicarse entre sí usando sus nombres de servicio
- `backend` puede acceder a `db:5432`
- `frontend` (nginx) puede acceder a `backend:3001`
- Desde el navegador del usuario, solo se puede acceder a `localhost:80`

---

## 🎓 Para Otros Desarrolladores

### Setup rápido (TL;DR)

```bash
# 1. Clonar repo
git clone https://github.com/PowerSystem2024/CapyGaming-CarpinchosProgramando.git
cd CapyGaming-CarpinchosProgramando

# 2. Construir imágenes
docker-compose build --no-cache

# 3. Iniciar servicios
docker-compose up -d

# 4. Ver logs
docker-compose logs -f

# 5. Acceder
# Frontend: http://localhost
# Backend: http://localhost:3001
```

### Flujo de trabajo

1. **Trabajar en el código:**
   - Frontend: Modifica archivos en `frontend/src/`
   - Backend: Modifica archivos en `backend/`

2. **Aplicar cambios:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Ver logs para debug:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Hacer commit:**
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push
   ```

---

## ✅ Checklist de Verificación

Antes de considerar la dockerización exitosa, verifica:

- [ ] `docker-compose ps` muestra los 3 servicios `Up`
- [ ] `docker-compose logs backend` muestra "Server running on port 3001"
- [ ] `docker-compose logs db` muestra "database system is ready"
- [ ] http://localhost muestra el frontend correctamente
- [ ] La consola del navegador (F12) no muestra errores
- [ ] Las peticiones a `/api/...` en Network tab muestran status 200
- [ ] Se pueden ver productos en el catálogo
- [ ] La búsqueda funciona
- [ ] El navbar y footer se muestran
- [ ] La navegación entre páginas funciona

---

## 📚 Recursos Adicionales

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Docker Compose reference](https://docs.docker.com/compose/compose-file/)
- [Nginx documentation](https://nginx.org/en/docs/)
- [Vue.js deployment guide](https://vuejs.org/guide/best-practices/production-deployment.html)

---

**Documentación creada por:** Carpinchos Programando
**Fecha:** 2025
**Versión:** 1.0
