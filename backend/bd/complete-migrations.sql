-- Crear tabla subcategoria que falta
CREATE TABLE IF NOT EXISTS subcategoria (
    id_subcategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    id_categoria INTEGER NOT NULL,
    activa BOOLEAN DEFAULT true,
    orden_display INTEGER DEFAULT 0,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE,
    UNIQUE(nombre, id_categoria)
);

-- Agregar columna id_subcategoria a la tabla producto si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'producto' AND column_name = 'id_subcategoria'
    ) THEN
        ALTER TABLE producto ADD COLUMN id_subcategoria INTEGER;
        ALTER TABLE producto ADD CONSTRAINT fk_producto_subcategoria 
            FOREIGN KEY (id_subcategoria) REFERENCES subcategoria(id_subcategoria);
    END IF;
END $$;

-- Ahora ejecutar las migraciones para carrito y pedidos
-- Tabla para carritos de usuario
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

-- Tabla para pedidos/órdenes
CREATE TABLE IF NOT EXISTS pedido (
    id SERIAL PRIMARY KEY,
    usuario_dni VARCHAR(20) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, pagado, enviado, entregado, cancelado
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

-- Tabla para items del pedido
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

-- Tabla para tracking de estados de pedido
CREATE TABLE IF NOT EXISTS pedido_historial (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_carrito_usuario ON carrito(usuario_dni);
CREATE INDEX IF NOT EXISTS idx_pedido_usuario ON pedido(usuario_dni);
CREATE INDEX IF NOT EXISTS idx_pedido_estado ON pedido(estado);
CREATE INDEX IF NOT EXISTS idx_pedido_mercadopago ON pedido(mercadopago_preference_id);
CREATE INDEX IF NOT EXISTS idx_pedido_historial_pedido ON pedido_historial(pedido_id);

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

-- Registro de migración
INSERT INTO migrations (name, executed_at) VALUES ('complete_schema_update', CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;