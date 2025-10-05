import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'capygaming',
  password: 'admin',
  port: 5432,
});

async function createOfertas() {
  try {
    console.log('🎯 Creando tabla de ofertas...');
    
    // Crear tabla ofertas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oferta (
        id_oferta SERIAL PRIMARY KEY,
        producto_id INTEGER REFERENCES producto(id_producto) ON DELETE CASCADE,
        precio_original DECIMAL(10,2) NOT NULL,
        precio_oferta DECIMAL(10,2) NOT NULL,
        descuento_porcentaje INTEGER,
        fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_fin TIMESTAMP,
        activa BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Tabla ofertas creada');
    
    // Insertar algunas ofertas de ejemplo
    const ofertas = [
      // Mouse Logitech G903
      { producto_id: 18, precio_original: 45000, precio_oferta: 35000, descuento_porcentaje: 22 },
      // Teclado Redragon K509 
      { producto_id: 27, precio_original: 38000, precio_oferta: 28500, descuento_porcentaje: 25 },
      // SSD Team 256GB
      { producto_id: 12, precio_original: 55000, precio_oferta: 35000, descuento_porcentaje: 36 },
      // Auriculares Logitech G733
      { producto_id: 21, precio_original: 300300, precio_oferta: 290900, descuento_porcentaje: 3 },
      // Mouse Pad Logitech Powerplay
      { producto_id: 25, precio_original: 200000, precio_oferta: 175000, descuento_porcentaje: 13 },
      // Silla Gamer Noblechairs
      { producto_id: 47, precio_original: 680000, precio_oferta: 620000, descuento_porcentaje: 9 },
      // Monitor LG 28''
      { producto_id: 55, precio_original: 450000, precio_oferta: 399000, descuento_porcentaje: 11 },
      // Procesador AMD Ryzen 5
      { producto_id: 50, precio_original: 180000, precio_oferta: 155000, descuento_porcentaje: 14 }
    ];
    
    console.log('🎯 Insertando ofertas...');
    
    for (const oferta of ofertas) {
      await pool.query(`
        INSERT INTO oferta (producto_id, precio_original, precio_oferta, descuento_porcentaje, activa) 
        VALUES ($1, $2, $3, $4, true)
      `, [oferta.producto_id, oferta.precio_original, oferta.precio_oferta, oferta.descuento_porcentaje]);
    }
    
    console.log(`✅ ${ofertas.length} ofertas creadas exitosamente`);
    
    // Verificar ofertas
    const result = await pool.query(`
      SELECT o.*, p.nombre 
      FROM oferta o 
      JOIN producto p ON o.producto_id = p.id_producto 
      WHERE o.activa = true
    `);
    
    console.log('\n🎯 Ofertas activas:');
    result.rows.forEach(row => {
      console.log(`  - ${row.nombre}: $${row.precio_original} → $${row.precio_oferta} (${row.descuento_porcentaje}% OFF)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createOfertas();