# Base de Datos - CapyGaming

## Configuración de Base de Datos

La aplicación utiliza PostgreSQL como sistema de gestión de base de datos. La configuración está completamente dockerizada para facilitar el desarrollo.

## Estructura de la Base de Datos

### Tablas

1. **usuario**
   - dni (INTEGER, PRIMARY KEY)
   - nombre (VARCHAR(100))
   - apellido (VARCHAR(100))
   - telefono (VARCHAR(20))
   - direccion (VARCHAR(255))
   - email (VARCHAR(255), UNIQUE)
   - contraseña (VARCHAR(255)) - almacenada con hash bcrypt
   - fecha_registro (TIMESTAMP)

2. **categoria**
   - id_categoria (SERIAL, PRIMARY KEY)
   - nombre (VARCHAR(100), UNIQUE)
   - descripcion (TEXT)
   - fecha_creacion (TIMESTAMP)

3. **subcategoria**
   - id_subcategoria (SERIAL, PRIMARY KEY)
   - nombre (VARCHAR(100))
   - id_categoria (INTEGER, FOREIGN KEY)
   - descripcion (TEXT)
   - fecha_creacion (TIMESTAMP)

4. **producto**
   - id_producto (SERIAL, PRIMARY KEY)
   - nombre (VARCHAR(255))
   - precio (DECIMAL(10, 2))
   - stock (INTEGER)
   - marca (VARCHAR(100))
   - descripcion (TEXT)
   - id_categoria (INTEGER, FOREIGN KEY)
   - id_subcategoria (INTEGER, FOREIGN KEY)
   - fecha_creacion (TIMESTAMP)
   - fecha_actualizacion (TIMESTAMP)

5. **imagen_producto**
   - id_imagen (SERIAL, PRIMARY KEY)
   - id_producto (INTEGER, FOREIGN KEY)
   - url_imagen (VARCHAR(500))
   - orden (INTEGER)
   - fecha_creacion (TIMESTAMP)

## Inicialización de la Base de Datos

### Automática (con Docker Compose)

Cuando ejecutas `docker-compose up -d` por primera vez, la base de datos se inicializa automáticamente con el script [backend/bd/init.sql](backend/bd/init.sql).

El script crea todas las tablas necesarias, índices y relaciones.

### Poblado de Datos

Para poblar la base de datos con los productos del catálogo, ejecuta:

```bash
docker-compose exec backend node bd/seedProducts.js
```

Este comando:
- Carga los productos desde `frontend/src/assets/data/productsData.js`
- Inserta automáticamente todas las categorías y subcategorías necesarias
- Inserta 88 productos del catálogo
- Inserta todas las imágenes asociadas a cada producto

**Nota:** El archivo `productsData.js` se copia automáticamente al backend durante el build de Docker.

### Verificar las Tablas

Para verificar que las tablas se crearon correctamente:

```bash
docker-compose exec db psql -U postgres -d capygaming -c "\dt"
```

Salida esperada:
```
              List of relations
 Schema |      Name       | Type  |  Owner
--------+-----------------+-------+----------
 public | categoria       | table | postgres
 public | imagen_producto | table | postgres
 public | producto        | table | postgres
 public | subcategoria    | table | postgres
 public | usuario         | table | postgres
```

### Ver Datos en las Tablas

Para ver los productos:
```bash
docker-compose exec db psql -U postgres -d capygaming -c "SELECT * FROM producto;"
```

Para ver las categorías:
```bash
docker-compose exec db psql -U postgres -d capygaming -c "SELECT * FROM categoria;"
```

## Restablecer la Base de Datos

Si necesitas restablecer completamente la base de datos:

```bash
# Detener contenedores y eliminar volúmenes
docker-compose down -v

# Iniciar de nuevo (ejecutará init.sql automáticamente)
docker-compose up -d

# Esperar a que el backend esté listo
sleep 10

# Poblar con los productos del catálogo
docker-compose exec backend node bd/seedProducts.js
```

## Acceso Directo a PostgreSQL

Para acceder a la consola de PostgreSQL:

```bash
docker-compose exec db psql -U postgres -d capygaming
```

Comandos útiles dentro de psql:
- `\dt` - Listar tablas
- `\d nombre_tabla` - Ver estructura de una tabla
- `\q` - Salir de psql

## Conexión desde el Backend

El backend se conecta a la base de datos usando las variables de entorno definidas en el archivo [.env](.env):

```env
DB_USER=postgres
DB_HOST=db
DB_NAME=capygaming
DB_PASSWORD=admin
DB_PORT=5432
```

La configuración de conexión está en [backend/bd/pool.js](backend/bd/pool.js).

## Migraciones y Cambios en el Esquema

Si necesitas hacer cambios en el esquema de la base de datos:

1. Edita [backend/bd/init.sql](backend/bd/init.sql) con los cambios necesarios
2. Restablece la base de datos:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```
3. Vuelve a poblar los datos si es necesario

## Backup y Restauración

### Crear Backup

```bash
docker-compose exec db pg_dump -U postgres capygaming > backup_capygaming.sql
```

### Restaurar desde Backup

```bash
docker-compose exec -T db psql -U postgres -d capygaming < backup_capygaming.sql
```

## Solución de Problemas

### La base de datos no tiene tablas

Si después de iniciar Docker la base de datos está vacía:

1. Verifica que el archivo [backend/bd/init.sql](backend/bd/init.sql) exista
2. Verifica que esté montado en docker-compose.yml:
   ```yaml
   volumes:
     - ./backend/bd/init.sql:/docker-entrypoint-initdb.d/init.sql
   ```
3. Restablece la base de datos:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### No hay productos en la base de datos

Si las tablas existen pero no hay productos:

```bash
docker-compose exec backend node bd/seedProducts.js
```

### Error de conexión a la base de datos

Verifica que:
1. El contenedor de la base de datos está corriendo: `docker-compose ps db`
2. Las variables de entorno están correctas en [.env](.env)
3. La base de datos está saludable:
   ```bash
   docker-compose exec db pg_isready -U postgres
   ```

## Scripts Disponibles

- [backend/bd/init.sql](backend/bd/init.sql) - Script de inicialización de tablas
- [backend/bd/seedProducts.js](backend/bd/seedProducts.js) - Script para poblar la BD con los productos del catálogo
- [backend/bd/productsData.js](backend/bd/productsData.js) - Datos de productos (copiado desde frontend)
- [backend/bd/pool.js](backend/bd/pool.js) - Configuración de conexión a PostgreSQL
- [backend/test-db.js](backend/test-db.js) - Script para probar la conexión a la BD

## Seguridad

**IMPORTANTE:** En producción:

1. Cambia las contraseñas en [.env](.env):
   ```env
   POSTGRES_PASSWORD=contraseña_segura_aqui
   DB_PASSWORD=contraseña_segura_aqui
   ```

2. No expongas el puerto 5432 públicamente (ya está comentado en docker-compose.yml)

3. Usa variables de entorno seguras en tu servidor de producción

4. Implementa backups regulares de la base de datos

## Logs de la Base de Datos

Para ver los logs de PostgreSQL:

```bash
docker-compose logs db
```

Para seguir los logs en tiempo real:

```bash
docker-compose logs -f db
```
