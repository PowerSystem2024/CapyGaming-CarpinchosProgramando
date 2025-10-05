import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'capygaming',
  password: 'admin',
  port: 5432,
});

async function resetDatabase() {
  try {
    console.log('🗑️ Limpiando base de datos...');
    
    // Eliminar todas las tablas relacionadas con productos
    await pool.query('DROP TABLE IF EXISTS imagen_producto, carrito, carrito_temporal, oferta, pedido_item, pedido, pedidos, detalle_pedidos, pedido_historial CASCADE');
    await pool.query('DROP TABLE IF EXISTS producto CASCADE');
    await pool.query('DROP TABLE IF EXISTS subcategoria CASCADE');
    await pool.query('DROP TABLE IF EXISTS categoria CASCADE');
    
    console.log('✅ Base de datos limpiada');
    
  } catch (error) {
    console.error('❌ Error limpiando:', error.message);
  } finally {
    await pool.end();
  }
}

resetDatabase();