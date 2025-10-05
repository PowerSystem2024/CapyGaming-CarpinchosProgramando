import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'capygaming',
  password: 'admin',
  port: 5432,
});

async function checkTable() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'imagen_producto'
      ORDER BY ordinal_position;
    `);
    
    console.log('Estructura de tabla imagen_producto:');
    result.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable})`));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTable();