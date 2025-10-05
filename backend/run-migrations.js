import pool from './bd/pool.js';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
    
    // Leer y ejecutar el archivo de migraciones
    const migrationPath = path.join(process.cwd(), 'bd', 'complete-migrations.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('🔄 Ejecutando migraciones...');
    await client.query(migrationSQL);
    console.log('✅ Migraciones ejecutadas exitosamente');
    
    // Verificar las tablas después de la migración
    const tablesQuery = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tablas después de la migración:');
    tablesQuery.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Error en migración:', err.message);
  }
}

runMigrations();