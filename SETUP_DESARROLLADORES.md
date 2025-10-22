# 🚀 Guía de Setup para Nuevos Desarrolladores - CapyGaming

## 📋 Índice
1. [Pre-requisitos](#pre-requisitos)
2. [Setup Inicial (Primera Vez)](#setup-inicial-primera-vez)
3. [Uso Diario](#uso-diario)
4. [Entender los Comandos](#entender-los-comandos)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Pre-requisitos

### **Requisito 1: Instalar Docker Desktop**

#### **Windows:**

1. **Descargar:**
   - Ir a: https://www.docker.com/products/docker-desktop/
   - Descargar "Docker Desktop for Windows"

2. **Instalar:**
   - Ejecutar el instalador descargado
   - Seguir el wizard (Next → Next → Install)
   - ⚠️ **Importante:** Aceptar instalar WSL 2 cuando lo pida

3. **Reiniciar la computadora** (si Docker lo pide)

4. **Abrir Docker Desktop:**
   - Buscar "Docker Desktop" en el menú Start
   - Esperar a que la esquina inferior izquierda diga: **"Engine running"** 🟢

5. **Verificar instalación:**
   ```bash
   docker --version
   # Debe mostrar: Docker version 24.x.x o superior

   docker-compose --version
   # Debe mostrar: Docker Compose version 2.x.x o superior
   ```

#### **Mac:**

1. Descargar Docker Desktop for Mac desde la misma URL
2. Instalar el archivo .dmg
3. Seguir los mismos pasos de verificación

---

### **Requisito 2: Tener Git instalado**

```bash
git --version
# Debe mostrar: git version 2.x.x
```

Si no tienes Git: https://git-scm.com/downloads

---

## 🎯 Setup Inicial (Primera Vez)

### **Paso 1: Clonar el Repositorio**

```bash
git clone https://github.com/PowerSystem2024/CapyGaming-CarpinchosProgramando.git
cd CapyGaming-CarpinchosProgramando
```

---

### **Paso 2: Verificar Docker Desktop**

```bash
docker info
```

**Si da error:**
- Abrir Docker Desktop manualmente (desde el menú Start)
- Esperar a que diga "Engine running" 🟢
- Volver a ejecutar `docker info`

---

### **Paso 3: Construir las Imágenes Docker**

```bash
docker-compose build --no-cache
```

**⏱️ Tiempo estimado:** 5-10 minutos (solo la primera vez)

**Qué hace:**
- Descarga Node.js, PostgreSQL, Nginx
- Instala todas las dependencias del proyecto
- Compila el frontend de Vue.js
- Prepara todo para ejecución

**Salida esperada (al final):**
```
Successfully built a1b2c3d4e5f6
Successfully tagged capygaming-carpinchosprogramando-backend:latest
Successfully tagged capygaming-carpinchosprogramando-frontend:latest
```

---

### **Paso 4: Iniciar los Servicios**

```bash
docker-compose up -d
```

**Qué hace:**
1. Crea y arranca el contenedor de **PostgreSQL** (base de datos)
2. Ejecuta **init.sql** automáticamente → Crea las tablas
3. Crea y arranca el contenedor del **Backend** (Node.js + Express)
4. Crea y arranca el contenedor del **Frontend** (Nginx + Vue.js compilado)

**Salida esperada:**
```
Creating capygaming-db ... done
Creating capygaming-backend ... done
Creating capygaming-frontend ... done
```

---

### **Paso 5: Verificar que Todo Esté Corriendo**

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

✅ Los tres servicios deben decir **"Up"**

❌ Si alguno dice **"Exited"** o **"Restarting"**, ver [Solución de Problemas](#solución-de-problemas)

---

### **Paso 6: Poblar la Base de Datos con Productos**

Aunque `init.sql` creó las **tablas**, aún no hay **datos** (productos, categorías).

#### **Opción A: Usando el Seeder (Recomendado)**

```bash
# Entrar al contenedor del backend
docker-compose exec backend sh

# Ejecutar el script de población
node bd/seedProducts.js

# Salir del contenedor
exit
```

**Salida esperada:**
```
🌱 Iniciando carga de 120 productos...

✅ Insertado: Mouse Logitech G502
✅ Insertado: Teclado Redragon Kumara
...

✅ Base de datos poblada exitosamente!

📊 Resumen:
   - Categorías: 8
   - Subcategorías: 24
   - Productos: 120
   - Imágenes: 360
```

#### **Opción B: Verificar si ya hay datos**

```bash
docker-compose exec db psql -U postgres -d capygaming -c "SELECT COUNT(*) FROM producto;"
```

Si muestra **count: 0** → Necesitas ejecutar el seeder (Opción A)

---

### **Paso 7: Abrir en el Navegador**

**Frontend:** http://localhost

**Backend API (opcional):** http://localhost:3001/api/productos

✅ Deberías ver la página de CapyGaming con productos, categorías, etc.

---

## 📅 Uso Diario

### **Iniciar el Proyecto (Cada Día)**

```bash
# 1. Asegurarse de que Docker Desktop está corriendo
docker info

# 2. Iniciar todos los servicios
docker-compose up -d

# 3. Abrir en el navegador
# http://localhost
```

---

### **Ver el Estado de los Servicios**

```bash
docker-compose ps
```

**Interpretación:**
- **Up X minutes** → ✅ Funcionando correctamente
- **Exited (0)** → ❌ Detenido (sin errores)
- **Exited (1)** → ❌ Detenido con error
- **Restarting** → ⚠️ Fallando repetidamente

---

### **Ver los Logs (Debugging)**

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Ver logs en tiempo real (como npm run dev)
docker-compose logs -f backend
# Presionar Ctrl+C para salir

# Ver solo las últimas 50 líneas
docker-compose logs --tail=50 backend
```

**Ejemplo de logs normales:**
```
capygaming-backend | Server running on port 3001
capygaming-backend | ✅ Connected to PostgreSQL database
```

**Ejemplo de logs con error:**
```
capygaming-backend | ❌ Error: connect ECONNREFUSED db:5432
capygaming-backend | Error: Failed to connect to database
```

---

### **Detener el Proyecto**

```bash
docker-compose down
```

**Qué hace:**
- Detiene todos los contenedores
- Elimina los contenedores
- ✅ Mantiene los datos de la base de datos (volumen persistente)
- ✅ Mantiene las imágenes construidas

---

### **Reiniciar Después de Cambios en el Código**

#### **Si cambias código del BACKEND:**

```bash
docker-compose restart backend
```

#### **Si cambias código del FRONTEND:**

```bash
docker-compose down
docker-compose build frontend
docker-compose up -d
```

**¿Por qué la diferencia?**
- **Backend:** El código está montado con volúmenes → Cambios se reflejan automáticamente
- **Frontend:** Se compila a archivos estáticos → Necesita rebuild

---

## 📚 Entender los Comandos

### **`docker-compose ps` - Ver Estado**

```bash
docker-compose ps
```

**Columnas importantes:**

| Columna | Qué Significa | Qué Buscar |
|---------|---------------|------------|
| **NAME** | Nombre del contenedor | capygaming-backend, capygaming-db, capygaming-frontend |
| **STATUS** | Estado actual | **"Up"** = Funcionando<br>**"Exited"** = Detenido<br>**"Restarting"** = Problema |
| **PORTS** | Puertos expuestos | **0.0.0.0:80->80** = Accesible en localhost:80 |

**Ejemplo de salida OK:**
```
NAME                   STATUS          PORTS
capygaming-backend     Up 5 minutes    0.0.0.0:3001->3001/tcp
capygaming-db          Up 5 minutes    5432/tcp
capygaming-frontend    Up 5 minutes    0.0.0.0:80->80/tcp
```

---

### **`docker-compose logs` - Ver Logs**

#### **¿Para qué sirven los logs?**

Los logs son **la consola de cada servicio**. Úsalos para:
- ✅ Ver si el backend arrancó correctamente
- ✅ Debuggear errores de conexión a la BD
- ✅ Ver qué peticiones HTTP llegan al backend
- ✅ Diagnosticar por qué un contenedor falla

#### **Ejemplos de uso:**

**Ver logs de todos los servicios:**
```bash
docker-compose logs
```

**Ver logs del backend:**
```bash
docker-compose logs backend
```

**Ver logs en tiempo real (se actualiza automáticamente):**
```bash
docker-compose logs -f backend
```

**Salida ejemplo:**
```
capygaming-backend | Server running on port 3001
capygaming-backend | ✅ Connected to PostgreSQL database
capygaming-backend | GET /api/productos 200 45ms
capygaming-backend | GET /api/categorias 200 12ms
```

**Cómo leer los logs:**
```
capygaming-backend | GET /api/productos 200 45ms
└──────┬──────────┘ └──────────┬────────────────┘
   Servicio            Mensaje de log
```

---

### **Cómo Funciona la Base de Datos**

#### **Concepto Clave: Cada Dev Tiene Su Propia BD**

```
❌ NO es una BD compartida en la nube
✅ Cada desarrollador tiene su propia BD local (contenedor)

PC de Ana:   PostgreSQL local con SUS datos
PC de Juan:  PostgreSQL local con SUS datos
PC de María: PostgreSQL local con SUS datos
```

#### **Qué comparten:**
- ✅ La **estructura** de las tablas (gracias a `init.sql`)
- ✅ El **código** (GitHub)
- ✅ La **configuración** (docker-compose.yml)

#### **Qué NO comparten:**
- ❌ Los **datos** (productos, usuarios, etc.)
- ❌ Cada uno puede tener diferentes datos de prueba

#### **Persistencia de datos:**

Los datos se guardan en un **volumen de Docker** llamado `postgres_data`:

```bash
# Ver volúmenes
docker volume ls

# Los datos persisten incluso si detienes los contenedores
docker-compose down
# Los datos siguen ahí

# Para BORRAR los datos:
docker-compose down -v
# ⚠️ Esto elimina TODOS los datos de la BD
```

---

## 🐛 Solución de Problemas

### **Problema 1: "unable to get image" o "cannot connect to Docker daemon"**

**Causa:** Docker Desktop no está corriendo

**Solución:**
1. Abrir Docker Desktop desde el menú Start
2. Esperar a que diga "Engine running" 🟢
3. Volver a ejecutar el comando

---

### **Problema 2: Un contenedor dice "Exited (1)" o "Restarting"**

**Causa:** El contenedor falló al iniciar

**Solución:**
```bash
# Ver los logs para entender el error
docker-compose logs backend

# Si ves errores de dependencias o archivos faltantes:
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

---

### **Problema 3: El frontend muestra solo navbar y footer**

**Causa:** Problema con el router de Vue

**Solución:**
```bash
# Ver logs del frontend
docker-compose logs frontend

# Reconstruir el frontend
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

---

### **Problema 4: "Port 80 is already in use"**

**Causa:** Otro servicio está usando el puerto 80

**Solución:**

**Opción A: Detener el servicio que usa el puerto**
```bash
# Windows - Ver qué proceso usa el puerto 80
netstat -ano | findstr :80

# Detener el proceso (usar el PID que aparece)
taskkill /PID <número> /F
```

**Opción B: Cambiar el puerto en docker-compose.yml**
```yaml
frontend:
  ports:
    - "8080:80"  # Cambiar a puerto 8080
```

Luego acceder a: http://localhost:8080

---

### **Problema 5: El backend no puede conectarse a la base de datos**

**Error típico:**
```
Error: connect ECONNREFUSED db:5432
```

**Solución:**
```bash
# 1. Verificar que la BD está corriendo
docker-compose ps db

# 2. Si dice "Up" pero aún falla, reiniciar el backend
docker-compose restart backend

# 3. Ver logs de la base de datos
docker-compose logs db
```

---

### **Problema 6: La base de datos no tiene productos**

**Causa:** No ejecutaste el seeder

**Solución:**
```bash
# Ejecutar el seeder de productos
docker-compose exec backend node bd/seedProducts.js

# Verificar que se cargaron
docker-compose exec db psql -U postgres -d capygaming -c "SELECT COUNT(*) FROM producto;"
```

---

## 🎓 Comandos de Referencia Rápida

```bash
# ============================================
# BÁSICOS
# ============================================
docker-compose up -d              # Iniciar todo
docker-compose down               # Detener todo
docker-compose ps                 # Ver estado
docker-compose logs               # Ver logs
docker-compose logs -f backend    # Ver logs en vivo

# ============================================
# REBUILD (después de cambios)
# ============================================
docker-compose build --no-cache              # Rebuild todo
docker-compose build frontend                # Rebuild solo frontend
docker-compose up -d --build                 # Rebuild + iniciar

# ============================================
# DEBUGGING
# ============================================
docker-compose logs backend                  # Logs del backend
docker-compose exec backend sh               # Entrar al contenedor backend
docker-compose exec db psql -U postgres -d capygaming  # Acceder a PostgreSQL

# ============================================
# BASE DE DATOS
# ============================================
# Poblar con productos
docker-compose exec backend node bd/seedProducts.js

# Ver cantidad de productos
docker-compose exec db psql -U postgres -d capygaming -c "SELECT COUNT(*) FROM producto;"

# Acceder a la consola de PostgreSQL
docker-compose exec db psql -U postgres -d capygaming

# ============================================
# LIMPIEZA
# ============================================
docker-compose down -v            # ⚠️ Detener + BORRAR datos
docker system prune -a            # ⚠️ Limpiar TODO Docker
```

---

## ✅ Checklist de Verificación

Después de completar el setup, verifica:

- [ ] `docker-compose ps` muestra los 3 servicios `Up`
- [ ] `docker-compose logs backend` muestra "Server running on port 3001"
- [ ] `docker-compose logs db` muestra "database system is ready"
- [ ] http://localhost muestra el frontend correctamente
- [ ] La consola del navegador (F12) no muestra errores
- [ ] Se pueden ver productos en el catálogo
- [ ] La búsqueda funciona
- [ ] La navegación por categorías funciona

---

## 📞 Ayuda Adicional

Si tienes problemas:

1. **Ver la documentación completa:** [DOCKER.md](./DOCKER.md)
2. **Revisar los logs:** `docker-compose logs`
3. **Preguntar al equipo** con la salida de:
   ```bash
   docker-compose ps
   docker-compose logs
   ```

---

**¡Listo! Ya tienes todo configurado para trabajar en CapyGaming** 🎮
