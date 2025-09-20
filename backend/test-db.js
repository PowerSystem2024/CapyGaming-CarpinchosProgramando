import pool from './bd/pool.js';

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
    
    // Verificar si la tabla usuario existe
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuario'
      );
    `);
    
    console.log('¿Tabla usuario existe?', tableCheck.rows[0].exists);
    
    // Ver estructura de la tabla
    const tableStructure = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'usuario'
      ORDER BY ordinal_position;
    `);
    
    console.log('Estructura de la tabla usuario:');
    tableStructure.rows.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    client.release();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
}

testConnection();