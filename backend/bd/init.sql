-- Script de inicialización de la base de datos CapyGaming
-- Este script crea todas las tablas necesarias para la aplicación

-- Eliminar tablas si existen (en orden inverso debido a foreign keys)
DROP TABLE IF EXISTS imagen_producto CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS subcategoria CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- Tabla de usuarios
CREATE TABLE usuario (
    dni INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de subcategorías
CREATE TABLE subcategoria (
    id_subcategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_categoria INTEGER NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE,
    UNIQUE(nombre, id_categoria)
);

-- Tabla de productos
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    marca VARCHAR(100),
    descripcion TEXT,
    id_categoria INTEGER NOT NULL,
    id_subcategoria INTEGER,
    descuento INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE,
    FOREIGN KEY (id_subcategoria) REFERENCES subcategoria(id_subcategoria) ON DELETE SET NULL
);

-- Tabla de imágenes de productos
CREATE TABLE imagen_producto (
    id_imagen SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    url_imagen VARCHAR(500) NOT NULL,
    orden INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
);

CREATE TABLE password_reset_codes (
    id SERIAL PRIMARY KEY,
    user_dni BIGINT REFERENCES usuario(dni),
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE INDEX idx_producto_subcategoria ON producto(id_subcategoria);
CREATE INDEX idx_subcategoria_categoria ON subcategoria(id_categoria);
CREATE INDEX idx_imagen_producto ON imagen_producto(id_producto);
CREATE INDEX idx_usuario_email ON usuario(email);

-- Comentarios en las tablas
COMMENT ON TABLE usuario IS 'Tabla de usuarios registrados en la aplicación';
COMMENT ON TABLE categoria IS 'Tabla de categorías principales de productos';
COMMENT ON TABLE subcategoria IS 'Tabla de subcategorías de productos';
COMMENT ON TABLE producto IS 'Tabla de productos disponibles en el catálogo';
COMMENT ON TABLE imagen_producto IS 'Tabla de imágenes asociadas a los productos';

-- Tablas para integración con MercadoPago
-- Script de creación de tablas

-- Tabla principal de órdenes de pago
CREATE TABLE IF NOT EXISTS orden_pago (
    id_orden SERIAL PRIMARY KEY,
    orden_id VARCHAR(100) UNIQUE NOT NULL,
    dni_usuario INTEGER REFERENCES usuario(dni),
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pending',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items de la orden
CREATE TABLE IF NOT EXISTS item_orden (
    id_item SERIAL PRIMARY KEY,
    id_orden INTEGER REFERENCES orden_pago(id_orden) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES producto(id_producto),
    nombre VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    precio_total DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(500)
);

-- Tabla de pagos de MercadoPago
CREATE TABLE IF NOT EXISTS pago_mercadopago (
    id_pago SERIAL PRIMARY KEY,
    id_orden INTEGER REFERENCES orden_pago(id_orden) ON DELETE CASCADE,
    preference_id VARCHAR(255),
    payment_id VARCHAR(255),
    status VARCHAR(50),
    status_detail VARCHAR(100),
    payment_method VARCHAR(100),
    transaction_amount DECIMAL(10, 2),
    currency_id VARCHAR(3) DEFAULT 'ARS',
    external_reference VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de eventos webhook
CREATE TABLE IF NOT EXISTS webhook_evento (
    id_evento SERIAL PRIMARY KEY,
    tipo_evento VARCHAR(50),
    payment_id VARCHAR(255),
    data_json TEXT,
    procesado BOOLEAN DEFAULT FALSE,
    fecha_recibido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_orden_usuario ON orden_pago(dni_usuario);
CREATE INDEX IF NOT EXISTS idx_pago_orden ON pago_mercadopago(id_orden);
CREATE INDEX IF NOT EXISTS idx_pago_payment_id ON pago_mercadopago(payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_procesado ON webhook_evento(procesado);

-- Comentarios
COMMENT ON TABLE orden_pago IS 'Órdenes de pago de los usuarios';
COMMENT ON TABLE item_orden IS 'Items incluidos en cada orden';
COMMENT ON TABLE pago_mercadopago IS 'Información de pagos procesados por MercadoPago';
COMMENT ON TABLE webhook_evento IS 'Eventos recibidos desde webhooks de MercadoPago';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos inicializada correctamente';
END $$;