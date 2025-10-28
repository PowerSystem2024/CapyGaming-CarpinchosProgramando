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

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos inicializada correctamente';
END $$;
