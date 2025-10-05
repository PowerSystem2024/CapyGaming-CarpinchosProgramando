import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'capygaming',
  password: 'admin',
  port: 5432,
});

async function recreateBasicTables() {
  try {
    console.log('🔧 Creando tablas básicas...');
    
    // Crear categorías
    await pool.query(`
      CREATE TABLE categoria (
        id_categoria SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT,
        activa BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Crear subcategorías
    await pool.query(`
      CREATE TABLE subcategoria (
        id_subcategoria SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        id_categoria INTEGER REFERENCES categoria(id_categoria) ON DELETE CASCADE,
        descripcion TEXT,
        activa BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(nombre, id_categoria)
      );
    `);
    
    // Crear productos
    await pool.query(`
      CREATE TABLE producto (
        id_producto SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        marca VARCHAR(100),
        modelo VARCHAR(100),
        id_categoria INTEGER REFERENCES categoria(id_categoria),
        id_subcategoria INTEGER REFERENCES subcategoria(id_subcategoria),
        activo BOOLEAN DEFAULT TRUE,
        imagenes JSON DEFAULT '[]',
        especificaciones JSON DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Crear imágenes productos
    await pool.query(`
      CREATE TABLE imagen_producto (
        id_imagen SERIAL PRIMARY KEY,
        id_producto INTEGER REFERENCES producto(id_producto) ON DELETE CASCADE,
        url_imagen TEXT NOT NULL,
        alt_text VARCHAR(255),
        es_principal BOOLEAN DEFAULT FALSE,
        orden_display INTEGER DEFAULT 0
      );
    `);
    
    console.log('✅ Tablas básicas creadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error creando tablas:', error.message);
  } finally {
    await pool.end();
  }
}

recreateBasicTables();