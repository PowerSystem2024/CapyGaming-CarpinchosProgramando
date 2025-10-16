-- ============================================
-- SCHEMA DE BASE DE DATOS - CAPYGAMING
-- Sistema de E-commerce con Carrito y Pedidos
-- ============================================

-- TABLA: carrito
-- Sincroniza el carrito del usuario entre dispositivos
CREATE TABLE IF NOT EXISTS carrito (
    id_carrito SERIAL PRIMARY KEY,
    dni_usuario INTEGER NOT NULL REFERENCES usuario(dni) ON DELETE CASCADE,
    id_producto INTEGER NOT NULL REFERENCES producto(id_producto) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(dni_usuario, id_producto),
    CONSTRAINT chk_cantidad_carrito CHECK (cantidad > 0)
);

-- TABLA: pedido
-- Almacena la información general de cada pedido
CREATE TABLE IF NOT EXISTS pedido (
    id_pedido SERIAL PRIMARY KEY,
    dni_usuario INTEGER NOT NULL REFERENCES usuario(dni),

    -- Datos de envío
    nombre_envio VARCHAR(100) NOT NULL,
    apellido_envio VARCHAR(100) NOT NULL,
    direccion_envio TEXT NOT NULL,
    ciudad_envio VARCHAR(100) NOT NULL,
    provincia_envio VARCHAR(100) NOT NULL,
    codigo_postal_envio VARCHAR(10) NOT NULL,
    telefono_envio VARCHAR(20),

    -- Datos de facturación (pueden ser iguales a los de envío)
    nombre_facturacion VARCHAR(100) NOT NULL,
    apellido_facturacion VARCHAR(100) NOT NULL,
    direccion_facturacion TEXT NOT NULL,
    ciudad_facturacion VARCHAR(100) NOT NULL,
    provincia_facturacion VARCHAR(100) NOT NULL,
    codigo_postal_facturacion VARCHAR(10) NOT NULL,

    -- Detalles del pedido
    metodo_envio VARCHAR(50) NOT NULL, -- 'standard', 'express', 'gratis'
    costo_envio DECIMAL(10, 2) NOT NULL,
    comentarios TEXT,

    -- Totales
    subtotal DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,

    -- Estado y pago
    estado_pedido VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    -- Estados: 'pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado'

    metodo_pago VARCHAR(50) NOT NULL, -- 'mercadopago', 'tarjeta', 'transferencia', 'efectivo'
    estado_pago VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    -- Estados de pago: 'pendiente', 'aprobado', 'rechazado', 'reembolsado'

    -- Integración con Mercado Pago
    mp_preference_id VARCHAR(255), -- ID de la preferencia de MP
    mp_payment_id VARCHAR(255), -- ID del pago en MP
    mp_status VARCHAR(50), -- Estado recibido desde MP
    mp_status_detail VARCHAR(100), -- Detalle del estado de MP

    -- Metadatos
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_estado_pedido CHECK (estado_pedido IN ('pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado')),
    CONSTRAINT chk_estado_pago CHECK (estado_pago IN ('pendiente', 'aprobado', 'rechazado', 'reembolsado'))
);

-- TABLA: detalle_pedido
-- Almacena los productos de cada pedido (snapshot en el momento de la compra)
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
    id_producto INTEGER NOT NULL REFERENCES producto(id_producto),

    -- Snapshot del producto en el momento de la compra
    nombre_producto VARCHAR(255) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    cantidad INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL, -- precio_unitario * cantidad

    -- Imagen para mostrar en historial
    imagen_url TEXT,

    CONSTRAINT chk_cantidad_detalle CHECK (cantidad > 0)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_carrito_usuario ON carrito(dni_usuario);
CREATE INDEX IF NOT EXISTS idx_pedido_usuario ON pedido(dni_usuario);
CREATE INDEX IF NOT EXISTS idx_pedido_estado ON pedido(estado_pedido);
CREATE INDEX IF NOT EXISTS idx_pedido_mp_preference ON pedido(mp_preference_id);
CREATE INDEX IF NOT EXISTS idx_detalle_pedido ON detalle_pedido(id_pedido);

-- Trigger para actualizar fecha_actualizacion en pedido
CREATE OR REPLACE FUNCTION actualizar_fecha_pedido()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_fecha_pedido
BEFORE UPDATE ON pedido
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_pedido();

-- Comentarios de documentación
COMMENT ON TABLE carrito IS 'Almacena los productos en el carrito de cada usuario para sincronización entre dispositivos';
COMMENT ON TABLE pedido IS 'Almacena la información general de cada pedido realizado';
COMMENT ON TABLE detalle_pedido IS 'Almacena los productos incluidos en cada pedido con sus precios al momento de la compra';
