import pool from './bd/pool.js';

async function checkAllTables() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
    
    // Verificar todas las tablas existentes
    const tablesQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tablas existentes en la base de datos:');
    const tableNames = tablesQuery.rows.map(row => row.table_name);
    tableNames.forEach(table => console.log(`  - ${table}`));
    
    // Verificar estructura de tablas importantes para productos
    const importantTables = ['producto', 'categoria', 'subcategoria', 'imagen_producto', 'carrito', 'pedido'];
    
    for (const tableName of importantTables) {
      if (tableNames.includes(tableName)) {
        console.log(`\n🔍 Estructura de la tabla ${tableName}:`);
        const structureQuery = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [tableName]);
        
        structureQuery.rows.forEach(col => {
          console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
        });
      } else {
        console.log(`\n❌ Tabla ${tableName} NO existe`);
      }
    }
    
    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkAllTables();