# Guía para configurar PostgreSQL en Windows

## Opción 1: Instalar PostgreSQL nativo

1. Descargar de: https://www.postgresql.org/download/windows/
2. Instalar con usuario `postgres` y contraseña `admin`
3. Ejecutar las migraciones:
   ```
   psql -U postgres -d postgres -c "CREATE DATABASE capygaming;"
   psql -U postgres -d capygaming -f bd/migrations.sql
   ```

## Opción 2: Usar Docker (más fácil)

1. Instalar Docker Desktop
2. Ejecutar:
   ```
   docker run --name capygaming-postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=capygaming -p 5432:5432 -d postgres:13
   ```
3. Ejecutar migraciones:
   ```
   docker exec -i capygaming-postgres psql -U postgres -d capygaming < bd/migrations.sql
   ```

## Opción 3: Probar sin base de datos

El sistema está diseñado para funcionar con localStorage como fallback.
Simplemente navega por la aplicación y agrega productos al carrito.
La integración con Mercado Pago funcionará igual, solo que el carrito no se persistirá entre sesiones.