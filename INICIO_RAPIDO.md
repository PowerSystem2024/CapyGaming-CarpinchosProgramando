# Inicio Rápido - CapyGaming

## Pre-requisitos

- Docker Desktop instalado
- Git instalado

## Pasos para ejecutar el proyecto

### 1. Clonar el repositorio (si aún no lo has hecho)

```bash
git clone https://github.com/PowerSystem2024/CapyGaming-CarpinchosProgramando.git
cd CapyGaming-CarpinchosProgramando
```

### 2. Iniciar Docker

Asegúrate de que Docker Desktop esté corriendo.

### 3. Construir e iniciar los contenedores

```bash
docker-compose up -d --build
```

Este comando:
- Construye las imágenes de Docker
- Inicia la base de datos PostgreSQL
- Inicia el backend Node.js
- Inicia el frontend con Nginx
- Crea automáticamente las tablas en la base de datos

### 4. Poblar la base de datos con los productos

```bash
docker-compose exec backend node bd/seedProducts.js
```

Deberías ver una salida como esta:
```
🌱 Iniciando carga de 88 productos...
✅ Producto insertado: Notebook Acer Aspire 3...
...
✅ Base de datos poblada exitosamente!

📊 Resumen:
   - Categorías: 7
   - Subcategorías: 33
   - Productos: 88
   - Imágenes: 101
```

### 5. Acceder a la aplicación

Abre tu navegador y ve a: **http://localhost**

Deberías ver la página principal de CapyGaming con productos listados.

## Verificación

### Verificar que los contenedores estén corriendo

```bash
docker-compose ps
```

Deberías ver 3 contenedores `Up`:
- capygaming-db
- capygaming-backend
- capygaming-frontend

### Ver logs del backend

```bash
docker-compose logs backend
```

### Ver logs en tiempo real

```bash
docker-compose logs -f
```

Presiona `Ctrl+C` para salir.

### Probar la API directamente

```bash
curl http://localhost:3001/api/productos
```

## Detener la aplicación

```bash
docker-compose down
```

## Reiniciar desde cero

Si algo sale mal y quieres empezar de nuevo:

```bash
# Detener y eliminar todo (incluyendo la base de datos)
docker-compose down -v

# Construir e iniciar de nuevo
docker-compose up -d --build

# Esperar unos segundos a que todo inicie
sleep 15

# Poblar la base de datos
docker-compose exec backend node bd/seedProducts.js
```

## Problemas Comunes

### "Port already in use"

Si ves un error sobre puertos en uso:

**Windows:**
```bash
netstat -ano | findstr :80
netstat -ano | findstr :3001
```

**Linux/Mac:**
```bash
lsof -i :80
lsof -i :3001
```

Detén el proceso que está usando el puerto o cambia el puerto en `docker-compose.yml`.

### No se muestran productos

1. Verifica que las tablas existan:
   ```bash
   docker-compose exec db psql -U postgres -d capygaming -c "\dt"
   ```

2. Si no hay tablas, reinicia desde cero (ver arriba)

3. Si hay tablas pero no hay productos, ejecuta el seed:
   ```bash
   docker-compose exec backend node bd/seedProducts.js
   ```

### El login/registro no funciona

Verifica que la tabla `usuario` exista:
```bash
docker-compose exec db psql -U postgres -d capygaming -c "\d usuario"
```

Si no existe, reinicia desde cero.

## Documentación Adicional

- [DOCKER.md](DOCKER.md) - Documentación completa de dockerización
- [DATABASE.md](DATABASE.md) - Documentación de la base de datos
- [README.md](README.md) - Documentación general del proyecto

## Comandos Útiles

```bash
# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Reiniciar un servicio
docker-compose restart backend

# Ejecutar comandos en un contenedor
docker-compose exec backend sh
docker-compose exec db psql -U postgres -d capygaming

# Ver el estado de los contenedores
docker-compose ps

# Reconstruir una imagen específica
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

## Desarrollo

Para desarrollo activo con hot-reload, consulta la sección de desarrollo en [DOCKER.md](DOCKER.md).

---

**¿Problemas?** Revisa [DOCKER.md](DOCKER.md) en la sección "Solución de Problemas" o abre un issue en GitHub.
