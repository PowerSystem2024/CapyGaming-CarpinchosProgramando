-- Script completo de migración para CapyGaming
-- Este script crea todas las tablas necesarias y es compatible con los datos existentes

-- Crear tabla subcategoria (si no existe)
CREATE TABLE IF NOT EXISTS subcategoria (
    id_subcategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_categoria INTEGER REFERENCES categoria(id_categoria) ON DELETE CASCADE,
    UNIQUE(nombre, id_categoria)
);

-- Agregar columna id_subcategoria a producto (si no existe)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='producto' AND column_name='id_subcategoria') THEN
        ALTER TABLE producto ADD COLUMN id_subcategoria INTEGER REFERENCES subcategoria(id_subcategoria) ON DELETE SET NULL;
    END IF;
END $$;

-- Crear tabla imagen_producto (si no existe) para manejar múltiples imágenes
CREATE TABLE IF NOT EXISTS imagen_producto (
    id_imagen SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL REFERENCES producto(id_producto) ON DELETE CASCADE,
    url_imagen TEXT NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INTEGER DEFAULT 0
);

-- Agregar columna imagenes tipo JSON a producto (si no existe) para compatibilidad
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='producto' AND column_name='imagenes') THEN
        ALTER TABLE producto ADD COLUMN imagenes JSON;
    END IF;
END $$;

-- Tablas para carrito persistente y pedidos (de la integración MP)
CREATE TABLE IF NOT EXISTS carrito (
    id SERIAL PRIMARY KEY,
    usuario_dni VARCHAR(20) NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_dni) REFERENCES usuario(dni) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto) ON DELETE CASCADE,
    UNIQUE(usuario_dni, producto_id)
);

CREATE TABLE IF NOT EXISTS pedido (
    id SERIAL PRIMARY KEY,
    usuario_dni VARCHAR(20) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mercadopago_preference_id VARCHAR(100),
    mercadopago_payment_id VARCHAR(100),
    metodo_pago VARCHAR(50),
    direccion_envio TEXT,
    telefono_contacto VARCHAR(20),
    notas TEXT,
    FOREIGN KEY (usuario_dni) REFERENCES usuario(dni) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedido_item (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    nombre_producto VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedido_historial (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE
);

-- Crear tabla ofertas para manejar productos en oferta
CREATE TABLE IF NOT EXISTS oferta (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    descuento_porcentaje INTEGER NOT NULL CHECK (descuento_porcentaje > 0 AND descuento_porcentaje <= 100),
    precio_original DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2) NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (producto_id) REFERENCES producto(id_producto) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_carrito_usuario ON carrito(usuario_dni);
CREATE INDEX IF NOT EXISTS idx_pedido_usuario ON pedido(usuario_dni);
CREATE INDEX IF NOT EXISTS idx_pedido_estado ON pedido(estado);
CREATE INDEX IF NOT EXISTS idx_pedido_mercadopago ON pedido(mercadopago_preference_id);
CREATE INDEX IF NOT EXISTS idx_pedido_historial_pedido ON pedido_historial(pedido_id);
CREATE INDEX IF NOT EXISTS idx_imagen_producto ON imagen_producto(id_producto);
CREATE INDEX IF NOT EXISTS idx_oferta_producto ON oferta(producto_id);
CREATE INDEX IF NOT EXISTS idx_oferta_activa ON oferta(activa);

-- Función para actualizar timestamp de modificación
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar automáticamente fecha_actualizacion
DROP TRIGGER IF EXISTS update_pedido_modtime ON pedido;
CREATE TRIGGER update_pedido_modtime
    BEFORE UPDATE ON pedido
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Función para sincronizar columna imagenes JSON con tabla imagen_producto
CREATE OR REPLACE FUNCTION sync_product_images()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar columna imagenes JSON cuando se modifica imagen_producto
    UPDATE producto 
    SET imagenes = (
        SELECT json_agg(url_imagen ORDER BY orden, id_imagen)
        FROM imagen_producto 
        WHERE id_producto = NEW.id_producto
    )
    WHERE id_producto = NEW.id_producto;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para mantener sincronizada la columna imagenes
DROP TRIGGER IF EXISTS sync_images_trigger ON imagen_producto;
CREATE TRIGGER sync_images_trigger
    AFTER INSERT OR UPDATE OR DELETE ON imagen_producto
    FOR EACH ROW
    EXECUTE FUNCTION sync_product_images();

COMMENT ON TABLE producto IS 'Tabla principal de productos';
COMMENT ON TABLE carrito IS 'Carrito persistente de usuarios autenticados';
COMMENT ON TABLE pedido IS 'Pedidos realizados por usuarios';
COMMENT ON TABLE oferta IS 'Productos en oferta con descuentos especiales';

-- Insertar datos de ejemplo para ofertas (solo si no existen)
INSERT INTO oferta (producto_id, descuento_porcentaje, precio_original, precio_oferta, fecha_fin)
SELECT 1, 20, 45000, 35000, NOW() + INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM oferta WHERE producto_id = 1)
AND EXISTS (SELECT 1 FROM producto WHERE id_producto = 1);

-- Mostrar resumen de tablas creadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;