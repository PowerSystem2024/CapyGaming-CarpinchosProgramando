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
