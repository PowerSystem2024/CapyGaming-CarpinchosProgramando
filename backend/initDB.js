// Script para inicializar la base de datos en Render
// Ejecutar: node backend/initDB.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function initializeDatabase() {
  console.log('🔄 Conectando a la base de datos...');

  // Crear cliente usando DATABASE_URL o variables individuales
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Leer el archivo init.sql
    const sqlPath = path.join(__dirname, 'bd', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 Ejecutando script de inicialización...');

    // Ejecutar el script SQL
    await client.query(sql);

    console.log('✅ Base de datos inicializada correctamente');
    console.log('');
    console.log('Tablas creadas:');
    console.log('  - usuario');
    console.log('  - categoria');
    console.log('  - subcategoria');
    console.log('  - producto');
    console.log('  - imagen_producto');
    console.log('  - password_reset_codes');
    console.log('  - orden_pago');
    console.log('  - item_orden');
    console.log('');
    console.log('✅ ¡Listo! Puedes iniciar el servidor con: npm start');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    console.error('');
    console.error('Detalles del error:');
    console.error('  Mensaje:', error.message);
    console.error('  Código:', error.code);
    if (error.position) {
      console.error('  Posición:', error.position);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Ejecutar
initializeDatabase();
