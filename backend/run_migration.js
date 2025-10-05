import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'capygaming',
  password: 'admin',
  port: 5432,
});

async function runMigration() {
  try {
    const sql = fs.readFileSync('./bd/complete_migration.sql', 'utf8');
    console.log('Ejecutando migración completa...');
    await pool.query(sql);
    console.log('✅ Migración completada exitosamente');
    
    // Verificar tablas creadas
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Tablas en la base de datos:');
    result.rows.forEach(row => console.log('  -', row.table_name));
    
  } catch (error) {
    console.error('❌ Error en migración:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();